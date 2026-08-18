"use client";

import { useEffect } from "react";

interface GlobalStyleProviderProps {
  settings: Record<string, string>;
}

export function GlobalStyleProvider({ settings }: GlobalStyleProviderProps) {
  useEffect(() => {
    const root = document.documentElement;

    // Apply primary & accent color (HSL format: e.g. "43 74% 49%")
    const accentColor = settings["accent_color"] || "43 74% 49%";
    
    // Set HSL CSS variables
    root.style.setProperty("--accent", accentColor);
    root.style.setProperty("--color-accent", `hsl(${accentColor})`);
    
    // If primary color is explicitly customized
    if (settings["primary_color_hsl"]) {
      root.style.setProperty("--primary", settings["primary_color_hsl"]);
      root.style.setProperty("--color-primary", `hsl(${settings["primary_color_hsl"]})`);
    } else {
      // By default link primary brand highlights to the chosen accent
      root.style.setProperty("--primary-brand", accentColor);
    }

    // Apply Typography Engine
    if (settings["heading_font"]) {
      const fontClass = settings["heading_font"];
      // Map class name to CSS font-family variable
      let fontFamily = "var(--font-alexandria), sans-serif";
      if (fontClass === "font-cairo") fontFamily = "var(--font-cairo), sans-serif";
      else if (fontClass === "font-tajawal") fontFamily = "var(--font-tajawal), sans-serif";
      else if (fontClass === "font-readex") fontFamily = "var(--font-readex), sans-serif";
      else if (fontClass === "font-almarai") fontFamily = "var(--font-almarai), sans-serif";
      else if (fontClass === "font-amiri") fontFamily = "var(--font-amiri), serif";
      
      root.style.setProperty("--font-heading-active", fontFamily);
    }

  }, [settings]);

  return null;
}
