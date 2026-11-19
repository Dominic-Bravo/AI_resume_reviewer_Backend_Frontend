"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { UploadCloud, FileCheck2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import {
  useV1UploadResumeCreate,
  getV1ScansHistoryListQueryKey,
} from "@/api/generated/endpoints/resume-pipeline/resume-pipeline";
import { getV1CreditsRetrieveQueryKey } from "@/api/generated/endpoints/authentication/authentication";
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

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const VALID_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

type UploadResponseShape = {
  id?: string;
  scan_id?: string;
  scan?: { id?: string };
};

export function ResumeUploadForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [file, setFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");

  const { mutate: uploadResume, isPending } = useV1UploadResumeCreate({
    mutation: {
      onSuccess: async (response) => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: getV1ScansHistoryListQueryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: getV1CreditsRetrieveQueryKey(),
          }),
        ]);

        const payload = response as unknown as UploadResponseShape;
        const scanId = payload?.scan_id || payload?.scan?.id || payload?.id;

        toast.success("Resume uploaded! Running AI analysis...");

        if (scanId) {
          router.push(`/results/${scanId}`);
        } else {
          toast.warning(
            "Scan queued, but no scan ID was returned in the response.",
          );
          router.push("/history");
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

    if (!VALID_MIME_TYPES.includes(selected.type)) {
      toast.error("Please upload a PDF or DOCX file.");
      e.target.value = "";
      return;
    }

    if (selected.size > MAX_FILE_SIZE_BYTES) {
      toast.error("File size must be 5MB or smaller.");
      e.target.value = "";
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
        target_job_title: jobTitle.trim() || undefined,
        target_job_desc: jobDesc.trim() || undefined,
      },
    });
  };

  return (
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
                    PDF or DOCX only (max 5MB)
                  </span>
                </div>
              )}
              <input
                id="resume-file"
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                disabled={isPending}
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
              disabled={isPending}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          {/* Target Job Description */}
          <div className="space-y-2">
            <Label htmlFor="job-desc">Target Job Description (Optional)</Label>
            <Textarea
              id="job-desc"
              rows={6}
              placeholder="Paste the job posting requirements here for tailored keyword matching..."
              value={jobDesc}
              disabled={isPending}
              onChange={(e) => setJobDesc(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending || !file}>
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
  );
}