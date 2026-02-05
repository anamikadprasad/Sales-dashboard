"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearSession, getSession } from "@/lib/auth";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShoppingCart,
  FileUp,
  X as XIcon,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [isAuthed, setIsAuthed] = useState(false);

  // Sidebar open state; toggled by the Navbar via CustomEvent
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session?.username) {
      setUsername(session.username);
      setIsAuthed(true);
    } else {
      setIsAuthed(false);
    }
  }, [pathname]);

  useEffect(() => {
    function onToggle() {
      setIsOpen((v) => !v);
    }
    window.addEventListener("toggleSidebar", onToggle as EventListener);
    return () => window.removeEventListener("toggleSidebar", onToggle as EventListener);
  }, []);

  // close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  if (!isAuthed) return null;

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Employees", href: "/employees", icon: <Users size={18} /> },
    { name: "Opportunities", href: "/opportunities", icon: <Briefcase size={18} /> },
    { name: "Sales Orders", href: "/sales-orders", icon: <ShoppingCart size={18} /> },
    { name: "Import/Export", href: "/import-export", icon: <FileUp size={18} /> },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      )}

      {/* Slide-over panel */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 transform bg-card shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center overflow-hidden">
              <img src="/shield_logo.png" alt="Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-bold">INTEGRA</span>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-md hover:bg-accent/10 transition"
          >
            <XIcon size={18} />
          </button>
        </div>

        <nav className="px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-border">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-sm font-medium">{username}</div>
              <div className="text-xs text-muted-foreground">Signed in</div>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm rounded-md border border-border hover:bg-destructive/10"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}