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
}

export class AuthService {
  static async register(payload: RegisterPayload) {
    const { data } = await authApi.post("/register", payload);

    return data;
  }

  static async login(payload: LoginPayload) {
    const { data } = await authApi.post("/login", payload);

    return data;
  }

  static async logout() {
    const { data } = await authApi.post("/logout");

    return data;
  }

  static async me() {
    const { data } = await authApi.get("/me");

    return data;
  }

  static async refresh() {
    const { data } = await authApi.post("/refresh");

    return data;
  }
}
