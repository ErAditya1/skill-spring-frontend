"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function DynamicFavicon() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const link =
      document.querySelector("link[rel='icon']") ||
      document.createElement("link");

    link.setAttribute("rel", "icon");
    link.setAttribute(
      "href",
      resolvedTheme === "dark"
        ? "/skillspringDark.png"
        : "/skillspringLight.png"
    );

    document.head.appendChild(link);
  }, [resolvedTheme]);

  return null;
}
