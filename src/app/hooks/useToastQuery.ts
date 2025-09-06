"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { showSuccess, showError } from "@/app/utils/toast";

export default function useToastQuery() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toastProcessed = useRef(false);

  useEffect(() => {
    const status = searchParams.get("status");
    const message = searchParams.get("message");

    if (
      (status === "success" || status === "error") &&
      message &&
      !toastProcessed.current
    ) {
      toastProcessed.current = true;

      if (status === "success") {
        showSuccess(decodeURIComponent(message));
      } else if (status === "error") {
        showError(decodeURIComponent(message));
      }

      const url = new URL(window.location.href);
      url.searchParams.delete("status");
      url.searchParams.delete("message");
      router.replace(url.pathname, { scroll: false });

      setTimeout(() => {
        toastProcessed.current = false;
      }, 500);
    }
  }, [searchParams, router]);
}
