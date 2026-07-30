import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error(error);
  void _next;
  const message = error instanceof Error ? error.message : "Unexpected error";

  response.status(500).json({
    error: {
      message
    }
  });
};
