"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  UploadCloud,
  FileCheck2,
  Loader2,
  X,
  Sparkles,
} from "lucide-react";
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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function ResumeUploadForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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

  const validateAndSetFile = (selected?: File) => {
    if (!selected) return;

    const lowerName = selected.name.toLowerCase();
    const hasValidExtension =
      lowerName.endsWith(".pdf") || lowerName.endsWith(".docx");
    const hasValidMime = VALID_MIME_TYPES.includes(selected.type);

    if (!hasValidMime && !hasValidExtension) {
      toast.error("Please upload a PDF or DOCX file.");
      return;
    }

    if (selected.size > MAX_FILE_SIZE_BYTES) {
      toast.error("File size must be 5MB or smaller.");
      return;
    }

    setFile(selected);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndSetFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isPending && !isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isPending) return;
    const droppedFile = e.dataTransfer.files?.[0];
    validateAndSetFile(droppedFile);
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

  const wordCount = jobDesc.trim() ? jobDesc.trim().split(/\s+/).length : 0;

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
          {/* Drag-and-Drop File Zone */}
          <div className="space-y-2">
            <Label htmlFor="resume-file">Resume File *</Label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="relative"
            >
              <label
                htmlFor="resume-file"
                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-all duration-150 ${
                  isDragging
                    ? "scale-[1.01] border-primary bg-primary/5 ring-2 ring-primary/20"
                    : file
                      ? "border-primary/40 bg-primary/[0.02] hover:border-primary/60"
                      : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40"
                } ${isPending ? "pointer-events-none opacity-60" : ""}`}
              >
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <FileCheck2 className="h-6 w-6" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-foreground">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • Click or drop a new file
                        to replace
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                        isDragging
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">
                        {isDragging
                          ? "Drop your resume here"
                          : "Drag & drop your resume, or click to browse"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF or DOCX only (max 5MB)
                      </p>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  id="resume-file"
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  disabled={isPending}
                  onChange={handleFileChange}
                />
              </label>

              {file && !isPending && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remove selected file"
                  onClick={handleClearFile}
                  className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="job-desc">
                Target Job Description (Optional)
              </Label>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {wordCount > 0 && (
                  <>
                    <span>
                      {wordCount} {wordCount === 1 ? "word" : "words"}
                    </span>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => setJobDesc("")}
                      className="text-primary hover:underline disabled:opacity-50"
                    >
                      Clear
                    </button>
                  </>
                )}
              </div>
            </div>
            <Textarea
              id="job-desc"
              rows={6}
              placeholder="Paste the job posting requirements here for tailored keyword matching..."
              value={jobDesc}
              disabled={isPending}
              onChange={(e) => setJobDesc(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full transition-transform active:scale-[0.98]"
            disabled={isPending || !file}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading & Queuing Scan...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze Resume
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}