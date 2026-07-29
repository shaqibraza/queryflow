import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

type JwtPayload = {
  userId: string;
  email: string;
};

export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
