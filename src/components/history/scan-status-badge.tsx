import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ScanStatusBadgeProps {
  status?: string;
}

export function ScanStatusBadge({ status }: ScanStatusBadgeProps) {
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