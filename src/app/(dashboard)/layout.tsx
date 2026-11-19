"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, LogOut, Sparkles } from "lucide-react";
import {
  getAccessToken,
  setAccessToken,
  AXIOS_INSTANCE,
} from "@/api/axios-instance";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      if (getAccessToken()) {
        setIsReady(true);
        return;
      }
      try {
        const { data } = await AXIOS_INSTANCE.post<{ access: string }>(
          "/api/v1/token/refresh/",
        );
        setAccessToken(data.access);
        setAccessToken(data.access);
        setIsReady(true);
      } catch {
        router.replace("/login");
      }
    };

    restoreSession();
  }, [router]);

  const handleLogout = () => {
    setAccessToken(null);
    router.push("/login");
  };

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Verifying session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <Sparkles className="h-5 w-5 text-primary" />
            <span>ResumeAI</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/dashboard" />}
            >
              <FileText className="mr-2 h-4 w-4" />
              New Scan
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
