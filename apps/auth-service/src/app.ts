import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Auth Service is running 🚀"
  });
});

app.use("/auth", authRoutes);

// Global Error Handler
app.use(errorMiddleware);

const PORT = process.env.AUTH_SERVICE_PORT || 4001;

app.listen(PORT, () => {
  console.log(`🚀 Auth Service running on http://localhost:${PORT}`);
});
