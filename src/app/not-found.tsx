import Link from "next/link";
import { FileQuestion, ArrowLeft, LayoutDashboard, History } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="h-6 w-6 text-muted-foreground" />
        </div>

        <Badge variant="secondary" className="mb-3">
          404 — Page Not Found
        </Badge>

        <h1 className="text-2xl font-bold tracking-tight">
          We couldn&apos;t find that page
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          The link may be broken, the scan ID may not exist, or the page may
          have been moved.
        </p>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Button
            nativeButton={false}
            render={<Link href="/dashboard" />}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Button>

          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/history" />}
          >
            <History className="mr-2 h-4 w-4" />
            Scan History
          </Button>
        </div>

        <div className="mt-5 border-t pt-4">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}