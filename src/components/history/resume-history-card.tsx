import Link from "next/link";
import { FileText, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScanReportRow, type ScanReportItem } from "./scan-report-row";

export interface ResumeHistoryItem {
  id: string | number;
  file_name: string;
  created_at?: string;
  scan_reports?: readonly ScanReportItem[] | null;
}

interface ResumeHistoryCardProps {
  resume: ResumeHistoryItem;
  formatDate: (isoDate?: string) => string;
}

export function ResumeHistoryCard({
  resume,
  formatDate,
}: ResumeHistoryCardProps) {
  const reports = Array.isArray(resume.scan_reports) ? resume.scan_reports : [];
  const rescanHref = `/dashboard?resumeId=${encodeURIComponent(
    String(resume.id),
  )}&fileName=${encodeURIComponent(resume.file_name)}`;

  return (
    <Card className="group animate-fade-up overflow-hidden transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-md">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b bg-muted/20 transition-colors duration-200 group-hover:bg-muted/35">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-primary/10 text-primary transition-all duration-200 ease-out group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base">{resume.file_name}</CardTitle>
            <CardDescription>
              Uploaded {formatDate(resume.created_at)}
            </CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="transition-colors duration-150 group-hover:border-foreground/25"
          >
            {reports.length} {reports.length === 1 ? "Scan" : "Scans"}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="group/btn h-8 text-xs transition-all duration-150 ease-out hover:bg-accent active:scale-[0.98]"
            nativeButton={false}
            render={<Link href={rescanHref} />}
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary transition-transform duration-200 ease-out group-hover/btn:rotate-12 group-hover/btn:scale-110" />
            New Role Scan
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {reports.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No scan reports associated with this file yet.
          </p>
        ) : (
          <div className="space-y-2">
            {reports.map((report) => (
              <ScanReportRow
                key={report.id}
                report={report}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}