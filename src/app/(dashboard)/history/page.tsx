"use client";

import Link from "next/link";
import { FileText, Loader2, AlertCircle, PlusCircle } from "lucide-react";

import { useV1ScansHistoryList } from "@/api/generated/endpoints/resume-pipeline/resume-pipeline";
import { ResumeHistoryCard } from "@/components/history/resume-history-card";
import { Button } from "@/components/ui/button";
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
          {resumes.map((resume) => (
            <ResumeHistoryCard
              key={resume.id}
              resume={resume}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}