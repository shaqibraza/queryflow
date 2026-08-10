import { authApi } from "./api";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export class AuthService {
  static async register(payload: RegisterPayload) {
    const { data } = await authApi.post("/register", payload);

    return data;
  }

  static async verifyEmail(payload: VerifyEmailPayload) {
    const { data } = await authApi.post("/verify-email", payload);

    return data;
  }

  static async resendVerificationOtp(email: string) {
    const { data } = await authApi.post("/resend-verification", { email });

    return data;
  }

  static async login(payload: LoginPayload) {
    const { data } = await authApi.post("/login", payload);

    return data.data;
  }

  static async logout() {
    const { data } = await authApi.post("/logout");

    return data;
  }

  static async me() {
    const { data } = await authApi.get("/me");

    return data.data;
  }

  static async refresh() {
    const { data } = await authApi.post("/refresh");

    return data.data;
  }

  static async updateProfile(payload: { firstName: string; lastName: string }) {
    const { data } = await authApi.patch("/update-profile", payload);

    return data.data;
  }

  static async uploadAvatar(file: File) {
    const formData = new FormData();

    formData.append("avatar", file);

    const { data } = await authApi.post("/avatar", formData);

    return data.data;
  }
}
