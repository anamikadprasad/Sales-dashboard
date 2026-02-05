"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  const borderColor = isDark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.12)";
  const glow = isDark ? "0 6px 18px rgba(255,255,255,0.08)" : "0 6px 18px rgba(0,0,0,0.06)";
  const iconColor = isDark ? "white" : "black";

  return (
    <button
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center transition-transform active:scale-95 focus:outline-none w-12 h-12 rounded-xl"
      style={
        {
          background: "transparent",
          border: `1px solid ${borderColor}`,
          boxShadow: glow,
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        } as React.CSSProperties
      }
    >
      <span aria-hidden className="sr-only">
        Toggle theme
      </span>

      {isDark ? (
        <Sun className="w-6 h-6" style={{ color: iconColor }} />
      ) : (
        <Moon className="w-6 h-6" style={{ color: iconColor }} />
      )}
    </button>
  );
}