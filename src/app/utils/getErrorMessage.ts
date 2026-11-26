import { isAxiosError } from "axios";

export function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}