"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { clearSession, getSession } from "@/lib/auth";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session?.username) {
      setUsername(session.username);
      setIsAuthed(true);
    } else {
      setUsername("");
      setIsAuthed(false);
    }
  }, [pathname]); // re-check on route change (useful after login/logout)

  const handleLogout = () => {
    clearSession();
    setUsername("");
    setIsAuthed(false);
    router.push("/login");
  };

  // If NOT logged in -> do not show navbar at all
  if (!isAuthed) return null;

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Employees", href: "/employees" },
    { name: "Opportunities", href: "/opportunities" },
    { name: "Sales Orders", href: "/sales-orders" },
    { name: "Import/Export", href: "/import-export" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center px-6">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2 mr-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <Link href="/dashboard" className="font-bold text-lg text-foreground">
            Sales Dashboard
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {username && (
            <span className="text-sm text-muted-foreground hidden sm:block">
              Welcome,{" "}
              <span className="text-foreground font-medium">{username}</span>
            </span>
          )}

          <ThemeToggle />

          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="flex md:hidden gap-2 px-6 pb-4 overflow-x-auto border-t border-border pt-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}