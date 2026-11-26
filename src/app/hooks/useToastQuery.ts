"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { showSuccess, showError } from "@/app/utils/toast";

export default function useToastQuery() {
  const pathname = usePathname();
  const router = useRouter();
  const toastProcessed = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const message = params.get("message");

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

      router.replace(window.location.pathname, { scroll: false });

      setTimeout(() => {
        toastProcessed.current = false;
      }, 500);
    }
  }, [pathname, router]);
}