import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScanStatusBadge } from "./scan-status-badge";

export interface ScanReportItem {
  id: string | number;
  target_job_title?: string | null;
  overall_score?: number | null;
  status?: string;
  created_at?: string;
}

interface ScanReportRowProps {
  report: ScanReportItem;
  formatDate: (isoDate?: string) => string;
}

export function ScanReportRow({ report, formatDate }: ScanReportRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">
            {report.target_job_title || "General Resume Scan"}
          </span>
          <ScanStatusBadge status={report.status} />
        </div>
        <p className="text-xs text-muted-foreground">
          Scanned {formatDate(report.created_at)}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {typeof report.overall_score === "number" && (
          <div className="flex items-center gap-1.5 rounded-md border bg-muted/40 px-2.5 py-1 text-sm font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {report.overall_score}%
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href={`/results/${report.id}`} />}
        >
          View Report
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}