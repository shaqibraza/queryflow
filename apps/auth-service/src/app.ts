import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

export const createApp = (): express.Express => {
  const app = express();

  const frontendUrl = process.env.FRONTENED_URL;

  app.use(
    cors({
      origin: frontendUrl,
      credentials: true
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.get("/health", (_, res) => {
    res.status(200).json({
      success: true,
      message: "Auth Service is running"
    });
  });

  app.use("/", authRoutes);

  app.use(errorMiddleware);

  return app;
};
