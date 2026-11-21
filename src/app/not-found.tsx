import Link from "next/link";
import { FileQuestion, ArrowLeft, LayoutDashboard, History } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="group animate-fade-up w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border bg-muted transition-all duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:border-foreground/20 group-hover:bg-accent">
          <FileQuestion className="h-6 w-6 text-muted-foreground transition-transform duration-200 ease-out group-hover:rotate-6 group-hover:text-foreground" />
        </div>

        <Badge
          variant="secondary"
          className="mb-3 transition-transform duration-150 ease-out group-hover:scale-[1.02]"
        >
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
            className="group/btn transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98]"
            nativeButton={false}
            render={<Link href="/dashboard" />}
          >
            <LayoutDashboard className="mr-2 h-4 w-4 transition-transform duration-150 ease-out group-hover/btn:scale-110" />
            Go to Dashboard
          </Button>

          <Button
            variant="outline"
            className="group/btn transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-foreground/25 hover:bg-accent active:scale-[0.98]"
            nativeButton={false}
            render={<Link href="/history" />}
          >
            <History className="mr-2 h-4 w-4 transition-transform duration-200 ease-out group-hover/btn:-rotate-12" />
            Scan History
          </Button>
        </div>

        <div className="mt-5 border-t pt-4">
          <Link
            href="/"
            className="group/link inline-flex items-center rounded-sm text-xs font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5 transition-transform duration-150 ease-out group-hover/link:-translate-x-1" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}