import { AxiosError } from "axios";

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiMessage = error.response?.data?.message;
    if (typeof apiMessage === "string") return apiMessage;

    if (Array.isArray(apiMessage) && apiMessage.length > 0) {
      return String(apiMessage[0]);
    }

    if (error.code === "ERR_NETWORK") {
      return "Can't reach the server. Check your connection and try again.";
    }

    if (error.response?.status === 409) {
      return "An account with this email already exists.";
    }

    if (error.response?.status === 401) {
      return "Invalid email or password.";
    }

    return "Something went wrong. Please try again.";
  }

  if (error instanceof Error) return error.message;

  return "Something went wrong. Please try again.";
}
