import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ScanStatusBadgeProps {
  status?: string;
}

export function ScanStatusBadge({ status }: ScanStatusBadgeProps) {
  switch (status) {
    case "DONE":
      return (
        <Badge
          variant="secondary"
          className="group gap-1 border-emerald-500/25 bg-emerald-500/10 text-emerald-700 transition-all duration-150 ease-out hover:scale-[1.02] hover:bg-emerald-500/15 dark:text-emerald-400"
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 transition-transform duration-150 ease-out group-hover:scale-110" />
          Completed
        </Badge>
      );
    case "PROCESSING":
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="group gap-1 border-amber-500/30 bg-amber-500/10 text-amber-700 transition-all duration-150 ease-out hover:scale-[1.02] hover:bg-amber-500/15 dark:text-amber-400"
        >
          <Clock className="h-3.5 w-3.5 animate-pulse text-amber-500" />
          {status === "PROCESSING" ? "Processing" : "Pending"}
        </Badge>
      );
    case "FAILED":
      return (
        <Badge
          variant="destructive"
          className="group gap-1 transition-all duration-150 ease-out hover:scale-[1.02] hover:shadow-2xs"
        >
          <XCircle className="h-3.5 w-3.5 transition-transform duration-150 ease-out group-hover:rotate-90" />
          Failed
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="transition-all duration-150 ease-out hover:border-foreground/25 hover:bg-muted/50"
        >
          {status || "Unknown"}
        </Badge>
      );
  }
}