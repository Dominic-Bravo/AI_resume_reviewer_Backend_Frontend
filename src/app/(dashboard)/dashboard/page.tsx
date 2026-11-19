"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import Link from "next/link";
import { UploadCloud, FileCheck2, Loader2, History } from "lucide-react";
import { useV1UploadResumeCreate } from "@/api/generated/endpoints/resume-pipeline/resume-pipeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");

  const { mutate: uploadResume, isPending } = useV1UploadResumeCreate({
    mutation: {
      onSuccess: (response) => {
        // Check for scan id returned in the response payload
        const scanId =
          (response as unknown as { id?: string; scan_id?: string })?.id ||
          (response as unknown as { scan_id?: string })?.scan_id;

        toast.success("Resume uploaded! Running AI analysis...");
        if (scanId) {
          router.push(`/results/${scanId}`);
        }
      },
      onError: (error) => {
        const err = error as AxiosError<{ detail?: string; file?: string[] }>;
        const msg =
          err.response?.data?.file?.[0] ||
          err.response?.data?.detail ||
          "Failed to upload resume. Please check your file format and credits.";
        toast.error(msg);
      },
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(selected.type)) {
      toast.error("Please upload a PDF or DOCX file.");
      return;
    }
    setFile(selected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a resume file first.");
      return;
    }

    uploadResume({
      data: {
        file,
        target_job_title: jobTitle || undefined,
        target_job_desc: jobDesc || undefined,
      },
    });
  };

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
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/history" />}
        >
          <History className="mr-2 h-4 w-4" />
          Scan History
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Scan</CardTitle>
          <CardDescription>
            Supports PDF and DOCX up to 5MB. Uses 1 scan credit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Dropzone */}
            <div className="space-y-2">
              <Label htmlFor="resume-file">Resume File *</Label>
              <label
                htmlFor="resume-file"
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center transition hover:border-primary/50 hover:bg-muted/40"
              >
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileCheck2 className="h-8 w-8 text-primary" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      Click to replace file
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <UploadCloud className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Click to select your resume
                    </span>
                    <span className="text-xs text-muted-foreground">
                      PDF or DOCX only
                    </span>
                  </div>
                )}
                <input
                  id="resume-file"
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Target Job Title */}
            <div className="space-y-2">
              <Label htmlFor="job-title">Target Job Title (Optional)</Label>
              <Input
                id="job-title"
                placeholder="e.g., Senior Full-Stack Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            {/* Target Job Description */}
            <div className="space-y-2">
              <Label htmlFor="job-desc">
                Target Job Description (Optional)
              </Label>
              <Textarea
                id="job-desc"
                rows={6}
                placeholder="Paste the job posting requirements here for tailored keyword matching..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || !file}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading & Queuing Scan...
                </>
              ) : (
                "Analyze Resume"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
