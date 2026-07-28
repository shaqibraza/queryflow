import { Request, Response, NextFunction } from "express";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // TODO:
    // 1. Check if user exists
    // 2. Hash password
    // 3. Create user
    // 4. Generate access & refresh tokens

    return res.status(201).json({
      success: true,
      message: "User registerd successfully",
      data: {
        firstName,
        lastName,
        email
      }
    });
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    // TODO:
    // 1. Find user
    // 2. Compare password
    // 3. Generate tokens

    return res.status(200).json({
      success: true,
      message: "login successful",
      data: {
        email
      }
    });
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO:
    // Verify refresh token
    // Generate new access token

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully"
    });
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO:
    // Delete refresh token

    return res.status(200).json({
      success: true,
      message: "Logout successfully"
    });
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user will come from auth middleware

    return res.status(200).json({
      success: true,
      data: req
    });
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};
