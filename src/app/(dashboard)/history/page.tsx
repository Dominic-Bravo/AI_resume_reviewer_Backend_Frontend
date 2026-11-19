"use client";

import Link from "next/link";
import {
  FileText,
  ArrowRight,
  Loader2,
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
} from "lucide-react";

import { useV1ScansHistoryList } from "@/api/generated/endpoints/resume-pipeline/resume-pipeline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatDate(isoDate?: string) {
  if (!isoDate) return "";
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function StatusBadge({ status }: { status?: string }) {
  switch (status) {
    case "DONE":
      return (
        <Badge variant="secondary" className="gap-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          Completed
        </Badge>
      );
    case "PROCESSING":
    case "PENDING":
      return (
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3.5 w-3.5 animate-pulse text-amber-500" />
          {status === "PROCESSING" ? "Processing" : "Pending"}
        </Badge>
      );
    case "FAILED":
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3.5 w-3.5" />
          Failed
        </Badge>
      );
    default:
      return <Badge variant="outline">{status || "Unknown"}</Badge>;
  }
}

export default function ScanHistoryPage() {
  const {
    data: resumes,
    isLoading,
    isError,
    refetch,
  } = useV1ScansHistoryList();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading your resume scan history...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="mx-auto max-w-lg border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Failed to Load Scan History
          </CardTitle>
          <CardDescription>
            We couldn&apos;t fetch your past scans right now.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
          <Button nativeButton={false} render={<Link href="/dashboard" />}>
            Go to Scanner
          </Button>
        </CardContent>
      </Card>
    );
  }

  const hasResumes = Array.isArray(resumes) && resumes.length > 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scan History</h1>
          <p className="text-muted-foreground">
            Review past AI resume evaluations, ATS match scores, and keyword
            reports.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/dashboard" />}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Scan
        </Button>
      </div>

      {!hasResumes ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">No scans yet</h2>
              <p className="text-sm text-muted-foreground">
                Upload a resume on the scanner page to generate your first AI
                report.
              </p>
            </div>
            <Button
              className="mt-2"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              Upload Your First Resume
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {resumes.map((resume) => {
            const reports = Array.isArray(resume.scan_reports)
              ? resume.scan_reports
              : [];

            return (
              <Card key={resume.id}>
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 border-b bg-muted/20">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-base">
                        {resume.file_name}
                      </CardTitle>
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
                        <div
                          key={report.id}
                          className="flex flex-wrap items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                        >
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium">
                                {report.target_job_title ||
                                  "General Resume Scan"}
                              </span>
                              <StatusBadge status={report.status} />
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
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
