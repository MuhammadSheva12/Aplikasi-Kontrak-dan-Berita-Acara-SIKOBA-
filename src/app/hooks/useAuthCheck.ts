"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "@/app/utils/axiosAPI";
import { showError } from "@/app/utils/toast";

export default function useAuthCheck() {
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      await axios.get("/auth/check", { withCredentials: true });
    } catch (error: any) {
      console.error("Auth check failed:", error);

      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        showError("Sesi login sudah habis, silakan login ulang.");
        router.replace("/login");
      } else {
        showError("Terjadi kesalahan saat memeriksa sesi login.");
      }

      // Langsung arahkan tanpa delay untuk UX lebih cepat
    }
  }, [router]);

  return checkAuth;
}
