"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { clearSession, getSession } from "@/lib/auth";
import { useEffect, useRef, useState } from "react";
import { User, ChevronDown, LogOut as LogOutIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();

  const [isAuthed, setIsAuthed] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isDark = theme === "dark";
  const borderColor = isDark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.12)";
  const glow = isDark ? "0 8px 24px rgba(255,255,255,0.08)" : "0 8px 20px rgba(0,0,0,0.06)";
  const textColor = isDark ? "white" : "black";
  const iconColor = isDark ? "white" : "black";

  useEffect(() => {
    const session = getSession();
    if (session?.username) {
      setIsAuthed(true);
      setUsername(session.username);
    } else {
      setIsAuthed(false);
      setUsername("");
    }
  }, [pathname]);

  const handleLogout = () => {
    clearSession();
    setIsAuthed(false);
    setOpen(false);
    router.push("/login");
  };

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!isAuthed) return null;

  return (
    <nav className="sticky top-4 z-50 w-full bg-transparent">
      <div className="flex items-center h-14 px-4 md:px-6">
        {/* Left: Logo + Brand */}
        {/* Left: Logo + Brand */}
        <Link href="/dashboard" className="flex items-center gap-3 mr-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-white/5"
            style={{
              border: `1px solid ${borderColor}`,
              boxShadow: glow,
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            <Image
              src="/shield_logo.png" 
              alt="Integra logo"
              width={32}
              height={32}
              className="object-contain"
              priority
              // If the image fails, this ensures we don't just have a blank box
              onError={(e) => {
                console.error("Logo failed to load");
              }}
            />
          </div>

          <span className="hidden sm:inline-block font-bold text-lg tracking-wider" style={{ color: textColor }}>
            INTEGRA
          </span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side: Theme toggle + Profile */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <div ref={containerRef} className="relative">
            <button
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-haspopup="menu"
              className="flex items-center gap-3 px-3 py-1.5 rounded-xl transition-shadow focus:outline-none"
              style={{
                background: "transparent",
                border: `1px solid ${borderColor}`,
                boxShadow: glow,
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              } as React.CSSProperties}
            >
              <span style={{ color: textColor }} className="text-sm font-medium ml-2">
                {username}
              </span>

              <ChevronDown size={16} style={{ color: iconColor }} />

              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background: "transparent",
                  border: `1px solid ${borderColor}`,
                  boxShadow: glow,
                }}
                aria-hidden
              >
                <User size={22} style={{ color: iconColor }} />
              </div>
            </button>

            {open && (
              <div
                role="menu"
                aria-label="Profile menu"
                className="absolute right-0 mt-2 w-44 rounded-xl z-50 overflow-hidden"
                style={{
                  background: "transparent",
                  border: `1px solid ${borderColor}`,
                  boxShadow: glow,
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                } as React.CSSProperties}
              >
                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral/6"
                    role="menuitem"
                    style={{ color: textColor }}
                  >
                    <User size={16} style={{ color: iconColor }} />
                    <span>Profile</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-neutral/6"
                    role="menuitem"
                    style={{ color: textColor }}
                  >
                    <LogOutIcon size={16} style={{ color: iconColor }} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}