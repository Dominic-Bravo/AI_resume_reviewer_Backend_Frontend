import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 border-b bg-muted/20">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-base">{resume.file_name}</CardTitle>
            <CardDescription>
              Uploaded {formatDate(resume.created_at)}
            </CardDescription>
          </div>
        </div>
        <Badge variant="outline">
          {reports.length} {reports.length === 1 ? "Scan" : "Scans"}
        </Badge>
      </CardHeader>

      <CardContent className="pt-4">
        {reports.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No scan reports associated with this file yet.
          </p>
        ) : (
          <div className="divide-y">
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