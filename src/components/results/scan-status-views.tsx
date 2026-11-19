import Link from "next/link";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ScanPollingStateProps {
  status?: string;
  onRefetch: () => void;
}

export function ScanPollingState({ status, onRefetch }: ScanPollingStateProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">
          {status === "PROCESSING"
            ? "AI is generating critiques..."
            : "Analyzing resume..."}
        </h2>
        <p className="text-sm text-muted-foreground">
          Evaluating category alignment, keyword gaps, and section-by-section
          improvements.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRefetch}
        className="mt-2"
      >
        Check Status Now
      </Button>
    </div>
  );
}

export function ScanFailedState() {
  return (
    <Card className="mx-auto max-w-lg border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          Analysis Failed
        </CardTitle>
        <CardDescription>
          We couldn&apos;t complete the analysis for this document. Your scan
          credit has been preserved.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button nativeButton={false} render={<Link href="/dashboard" />}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Try Another Resume
        </Button>
      </CardContent>
    </Card>
  );
}