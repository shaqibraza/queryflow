import jwt from "jsonwebtoken";

type JwtPayload = {
  userId: string;
  email: string;
};

type RefreshTokenPayload = JwtPayload & {
  rememberMe: boolean;
};

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET must be configured");
  }

  return secret;
};

export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: "15m"
  });
};

export const generateRefreshToken = (payload: RefreshTokenPayload) => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: "30d"
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, getJwtSecret()) as RefreshTokenPayload;
};
