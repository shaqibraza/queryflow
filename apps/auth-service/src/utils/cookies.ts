import { Response } from "express";

export const setRefreshTokenCookie = (res: Response, refreshToken: string, rememberMe: boolean) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/"
  });
};
