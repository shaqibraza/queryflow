import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

export const createApp = (): express.Express => {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
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
