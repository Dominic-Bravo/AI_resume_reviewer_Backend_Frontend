"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  getAccessToken,
  setAccessToken,
  AXIOS_INSTANCE,
} from "@/api/axios-instance";
import { useV1LogoutCreate } from "@/api/generated/endpoints/authentication/authentication";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const { mutate: logoutRequest, isPending: isLoggingOut } =
    useV1LogoutCreate();

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      if (getAccessToken()) {
        if (!cancelled) setIsReady(true);
        return;
      }

      try {
        const { data } = await AXIOS_INSTANCE.post<{ access?: string }>(
          "/api/v1/token/refresh/",
        );
        if (cancelled) return;

        if (data?.access) {
          setAccessToken(data.access);
          setIsReady(true);
        } else {
          router.replace("/login");
        }
      } catch {
        if (!cancelled) {
          router.replace("/login");
        }
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleLogout = () => {
    setAccessToken(null);
    logoutRequest(undefined, {
      onSettled: () => {
        router.replace("/login");
      },
    });
  };

  if (!isReady) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span>Verifying session...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar onLogout={handleLogout} isLoggingOut={isLoggingOut} />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}