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
    <header className="border-b bg-card">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <Sparkles className="h-5 w-5 text-primary" />
          <span>RoleMatch</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <CreditsBadge />

          <Button
            variant={pathname === "/dashboard" ? "secondary" : "ghost"}
            nativeButton={false}
            size="sm"
            render={<Link href="/dashboard" />}
          >
            <FileText className="h-4 w-4 sm:mr-1.5" />
            <span className="hidden sm:inline">New Scan</span>
          </Button>

          <Button
            variant={pathname === "/history" ? "secondary" : "ghost"}
            nativeButton={false}
            size="sm"
            render={<Link href="/history" />}
          >
            <History className="h-4 w-4 sm:mr-1.5" />
            <span className="hidden sm:inline">History</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="h-4 w-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}