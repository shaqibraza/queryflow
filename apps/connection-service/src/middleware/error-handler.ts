import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/app-error.js";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      error: {
        message: error.message
      }
    });
  }

  console.error(error);

  return response.status(500).json({
    error: {
      message: "Internal server error"
    }
  });
};
