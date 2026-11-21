"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, History, LogOut, Sparkles } from "lucide-react";
import { CreditsBadge } from "@/components/dashboard/credits-badge";
import { Button } from "@/components/ui/button";

interface DashboardNavbarProps {
  onLogout: () => void;
  isLoggingOut?: boolean;
}

export function DashboardNavbar({
  onLogout,
  isLoggingOut = false,
}: DashboardNavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-card/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
        <Link
          href="/dashboard"
          className="group flex items-center gap-2 font-semibold tracking-tight transition-opacity duration-150 hover:opacity-90"
        >
          <Sparkles className="h-5 w-5 text-primary transition-transform duration-200 ease-out group-hover:rotate-12 group-hover:scale-105" />
          <span>RoleMatch</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <CreditsBadge />

          <Button
            variant={pathname === "/dashboard" ? "secondary" : "ghost"}
            nativeButton={false}
            size="sm"
            className="group transition-all duration-150 ease-out hover:-translate-y-0.5"
            render={<Link href="/dashboard" />}
          >
            <FileText className="h-4 w-4 transition-transform duration-150 ease-out group-hover:scale-105 sm:mr-1.5" />
            <span className="hidden sm:inline">New Scan</span>
          </Button>

          <Button
            variant={pathname === "/history" ? "secondary" : "ghost"}
            nativeButton={false}
            size="sm"
            className="group transition-all duration-150 ease-out hover:-translate-y-0.5"
            render={<Link href="/history" />}
          >
            <History className="h-4 w-4 transition-transform duration-300 ease-out group-hover:-rotate-45 sm:mr-1.5" />
            <span className="hidden sm:inline">History</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            disabled={isLoggingOut}
            className="group transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-foreground/25 hover:bg-accent disabled:pointer-events-none"
          >
            <LogOut className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 sm:mr-1.5" />
            <span className="hidden sm:inline">
              {isLoggingOut ? "Signing out..." : "Sign out"}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}