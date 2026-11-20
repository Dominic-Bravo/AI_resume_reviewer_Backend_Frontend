"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  getAccessToken,
  setAccessToken,
  refreshAccessToken,
} from "@/api/axios-instance";
import { useV1LogoutCreate } from "@/api/generated/endpoints/authentication/authentication";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";

async function tryRestoreSession(): Promise<boolean> {
  if (getAccessToken()) {
    return true;
  }

  try {
    const token = await refreshAccessToken();
    return Boolean(token);
  } catch {
    return false;
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isReady, setIsReady] = useState(false);

  const { mutate: logoutRequest, isPending: isLoggingOut } =
    useV1LogoutCreate();

  useEffect(() => {
    let cancelled = false;

    tryRestoreSession().then((restored) => {
      if (cancelled) return;
      if (restored) {
        setIsReady(true);
      } else {
        router.replace("/login");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleLogout = () => {
    logoutRequest(undefined, {
      onSettled: () => {
        setAccessToken(null);
        queryClient.clear();
        toast.success("Signed out successfully.");
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