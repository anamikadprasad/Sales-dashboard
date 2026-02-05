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
  FileUp 
} from "lucide-react";

export function Sidebar() {
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
      setIsAuthed(false);
    }
  }, [pathname]);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  if (!isAuthed) return null;

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Employees", href: "/employees", icon: <Users size={20} /> },
    { name: "Opportunities", href: "/opportunities", icon: <Briefcase size={20} /> },
    { name: "Sales Orders", href: "/sales-orders", icon: <ShoppingCart size={20} /> },
    { name: "Import/Export", href: "/import-export", icon: <FileUp size={20} /> },
  ];

  return (
    <>
      {/* Desktop Sidebar (logo removed as requested) */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-border bg-card">
        <nav className="flex-1 px-4 space-y-2 mt-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile: keep layout simple — navbar now provides logo/brand */}
      <div className="md:hidden" />
    </>
  );
}