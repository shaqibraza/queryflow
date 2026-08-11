import { Response } from "express";

const isProduction = process.env.NODE_ENV === "production";

export const setRefreshTokenCookie = (res: Response, refreshToken: string, rememberMe: boolean) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    ...(rememberMe
      ? {
          maxAge: 30 * 24 * 60 * 60 * 1000
        }
      : {})
  });
};

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/"
  });
};
