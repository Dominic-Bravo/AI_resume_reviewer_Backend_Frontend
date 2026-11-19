"use client";

import Link from "next/link";
import { History } from "lucide-react";

import { CreditsBadge } from "@/components/dashboard/credits-badge";
import { ResumeUploadForm } from "@/components/dashboard/resume-upload-form";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
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