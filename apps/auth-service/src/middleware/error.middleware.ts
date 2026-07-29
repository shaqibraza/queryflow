import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  if (error instanceof Error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
};
