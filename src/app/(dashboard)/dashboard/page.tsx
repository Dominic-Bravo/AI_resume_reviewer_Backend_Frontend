"use client";

import { ResumeUploadForm } from "@/components/dashboard/resume-upload-form";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="animate-fade-up flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            AI Resume Scanner
          </h1>
          <p className="text-muted-foreground">
            Upload your resume and paste a target job description to uncover
            keyword gaps and bullet improvements.
          </p>
        </div>
      </div>

      <ResumeUploadForm />
    </div>
  );
}