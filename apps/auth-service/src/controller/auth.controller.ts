import { Request, Response, NextFunction } from "express";
import { prisma } from "@queryflow/database";
import { comparePassword, hashPassword } from "../utils/password.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { hashRefreshToken } from "../utils/refresh-token.js";
import jwt from "jsonwebtoken";
import { findMatchingRefreshToken } from "../utils/find-refresh-token.js";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../utils/cookies.js";
import {
  generateVerificationOtp,
  hashVerificationOtp,
  verifyVerificationOtp
} from "../utils/verification-otp.js";
import { sendVerificationEmail } from "../utils/mailer.js";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    // 2. Hash password
    const passwordHash = await hashPassword(password);

    // 3. Generate 6-digit OTP
    const verificationOtp = generateVerificationOtp();

    // 4. Hash OTP before storing it
    const hashedVerificationOtp = await hashVerificationOtp(verificationOtp);

    // 5. OTP expires after 10 minutes
    const verificationOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // 6. Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        emailVerified: false,
        verificationOtp: hashedVerificationOtp,
        verificationOtpExpiry
      }
    });

    // 7. Send verification email
    try {
      await sendVerificationEmail(user.email, verificationOtp);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);

      // Remove the newly created user if email failed
      await prisma.user.delete({
        where: {
          id: user.id
        }
      });

      return res.status(500).json({
        success: false,
        message: "Unable to send verification email. Please try again."
      });
    }

    // 8. Do NOT issue access/refresh tokens here
    return res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar,
          emailVerified: user.emailVerified
        }
      }
    });
  } catch (error) {
    console.error("Registration error:", error);

    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;

    // 1. Find user (select verification fields so types include them)
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        emailVerified: true,
        verificationOtp: true,
        verificationOtpExpiry: true
      }
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 2. Already verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified"
      });
    }

    // 3. Make sure OTP exists
    if (!user.verificationOtp || !user.verificationOtpExpiry) {
      return res.status(400).json({
        success: false,
        message: "Verification OTP not found"
      });
    }

    // 4. Check OTP expiry
    if (
      user.verificationOtpExpiry &&
      new Date() > (user.verificationOtpExpiry as unknown as Date)
    ) {
      return res.status(400).json({
        success: false,
        message: "Verification OTP has expired"
      });
    }

    // 5. Compare entered OTP with hashed OTP
    const isValidOtp = await verifyVerificationOtp(otp, user.verificationOtp);

    if (!isValidOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification OTP"
      });
    }

    // 6. Verify email and invalidate OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationOtp: null,
        verificationOtpExpiry: null
      }
    });

    // 7. Success
    return res.status(200).json({
      success: true,
      message: "Email verified successfully"
    });
  } catch (error) {
    console.error("Email verification error:", error);

    next(error);
  }
};

export const resendVerificationOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const genericResponse = {
      success: true,
      message: "If the account exists and is not verified, a new verification code has been sent."
    };

    const user = await prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      return res.status(200).json(genericResponse);
    }

    if (user.emailVerified) {
      return res.status(200).json(genericResponse);
    }

    const verificationOtp = generateVerificationOtp();

    const hashedVerificationOtp = await hashVerificationOtp(verificationOtp);

    const verificationOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        verificationOtp: hashedVerificationOtp,
        verificationOtpExpiry
      }
    });

    try {
      await sendVerificationEmail(user.email, verificationOtp);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);

      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          verificationOtp: null,
          verificationOtpExpiry: null
        }
      });

      return res.status(500).json({
        success: false,
        message: "Unable to send verification email. Please try again."
      });
    }
    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error("Resend verification OTP error:", error);
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, rememberMe } = req.body;

    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // 2. Compare password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // 3. Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      rememberMe
    });

    // 4. Save refresh token
    const hashedRefreshToken = await hashRefreshToken(refreshToken);

    await prisma.refreshToken.deleteMany({
      where: {
        userId: user.id
      }
    });

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId: user.id
      }
    });

    // set cookies
    setRefreshTokenCookie(res, refreshToken, rememberMe);

    // send response
    return res.status(200).json({
      success: true,
      message: "login successful",
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar,
          emailVerified: user.emailVerified
        },
        accessToken
      }
    });
  } catch (error: any) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is missing"
      });
    }

    // Verify JWT
    const payload = verifyRefreshToken(refreshToken);

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId
      }
    });

    if (!user) {
      clearRefreshTokenCookie(res);

      return res.status(401).json({
        success: false,
        message: "Invalid refresh token"
      });
    }

    // Find all refresh tokens
    const refreshTokens = await prisma.refreshToken.findMany({
      where: {
        userId: user.id
      }
    });

    // Find matching hashed token
    const matchedToken = await findMatchingRefreshToken(refreshToken, refreshTokens);

    if (!matchedToken) {
      // Refresh Token Reuse Detection
      await prisma.refreshToken.deleteMany({
        where: {
          userId: user.id
        }
      });

      clearRefreshTokenCookie(res);

      return res.status(401).json({
        success: false,
        message: "Refresh token reuse detected. Please login again."
      });
    }

    // Check revoked
    if (matchedToken.isRevoked) {
      await prisma.refreshToken.delete({
        where: {
          id: matchedToken.id
        }
      });

      clearRefreshTokenCookie(res);

      return res.status(401).json({
        success: false,
        message: "Refresh token has been revoked"
      });
    }

    // Check expiry
    if (matchedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({
        where: {
          id: matchedToken.id
        }
      });

      clearRefreshTokenCookie(res);

      return res.status(401).json({
        success: false,
        message: "Refresh token has expired"
      });
    }

    // Rotate Refresh Token
    await prisma.refreshToken.delete({
      where: {
        id: matchedToken.id
      }
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email
    });

    const newRefreshToken = generateRefreshToken({
      userId: payload.userId,
      email: payload.email,
      rememberMe: payload.rememberMe
    });

    const hashedRefreshToken = await hashRefreshToken(newRefreshToken);

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId: user.id
      }
    });

    // Set new HttpOnly Cookie
    setRefreshTokenCookie(res, newRefreshToken, payload.rememberMe);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken
      }
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      clearRefreshTokenCookie(res);

      return res.status(401).json({
        success: false,
        message: "Refresh token has expired"
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      clearRefreshTokenCookie(res);

      return res.status(401).json({
        success: false,
        message: "Invalid refresh token"
      });
    }

    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is missing"
      });
    }

    // Verify JWT
    const payload = verifyRefreshToken(refreshToken);

    // Find all refresh tokens for user
    const refreshTokens = await prisma.refreshToken.findMany({
      where: {
        userId: payload.userId
      }
    });

    // Find matching hashed refresh token
    const matchedToken = await findMatchingRefreshToken(refreshToken, refreshTokens);

    if (!matchedToken) {
      clearRefreshTokenCookie(res);

      return res.status(401).json({
        success: false,
        message: "Refresh token not found"
      });
    }

    // Delete refresh token
    await prisma.refreshToken.delete({
      where: {
        id: matchedToken.id
      }
    });

    // Clear HttpOnly Cookie
    clearRefreshTokenCookie(res);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      clearRefreshTokenCookie(res);

      return res.status(401).json({
        success: false,
        message: "Refresh token has expired"
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      clearRefreshTokenCookie(res);

      return res.status(401).json({
        success: false,
        message: "Invalid refresh token"
      });
    }

    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    next(error);
  }
};
