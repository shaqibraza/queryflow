import { Request, Response, NextFunction } from "express";
import { prisma } from "@queryflow/database";
import { comparePassword, hashPassword } from "../utils/password.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { hashRefreshToken } from "../utils/refresh-token.js";
import jwt from "jsonwebtoken";
import { findMatchingRefreshToken } from "../utils/find-refresh-token.js";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../utils/cookies.js";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // 1. Check if user exists
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

    // 3. Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash
      }
    });

    // 4. Generate access & refresh tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email
    });

    // 5. Save refresh token
    const hashedRefreshToken = await hashRefreshToken(refreshToken);

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId: user.id
      }
    });

    // set cookies
    setRefreshTokenCookie(res, refreshToken);

    // 6. return response
    return res.status(201).json({
      success: true,
      message: "User registerd successfully",
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
    console.log(error);
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

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
      email: user.email
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
    setRefreshTokenCookie(res, refreshToken);

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
    console.log(error);
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
      userId: user.id,
      email: user.email
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
    setRefreshTokenCookie(res, newRefreshToken);

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
    console.log(error);
    next(error);
  }
};
