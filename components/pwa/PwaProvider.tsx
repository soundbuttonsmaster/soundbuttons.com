"use client";

import { useEffect } from "react";

export function PwaProvider() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .then((reg) => {
          reg.update();
        })
        .catch(() => {});
    }
  }, []);

  return null;
}
