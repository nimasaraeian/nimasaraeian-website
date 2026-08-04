"use client";

import { useEffect } from "react";

export default function ManifestGuard() {
  useEffect(() => {
    const expected = "/nima-os/manifest.webmanifest";
    document.querySelectorAll<HTMLLinkElement>('link[rel="manifest"]').forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (!href.includes(expected)) link.remove();
    });

    if (!document.querySelector(`link[rel="manifest"][href="${expected}"]`)) {
      const link = document.createElement("link");
      link.rel = "manifest";
      link.href = expected;
      document.head.appendChild(link);
    }

    document.title = "Nima OS";
  }, []);

  return null;
}
