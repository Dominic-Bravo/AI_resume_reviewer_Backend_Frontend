"use client";

import { Coins } from "lucide-react";
import { useV1CreditsRetrieve } from "@/api/generated/endpoints/authentication/authentication";
import { Badge } from "@/components/ui/badge";

interface CreditsBadgeProps {
  className?: string;
}

export function CreditsBadge({ className }: CreditsBadgeProps) {
  const { data: creditProfile, isLoading, isError } = useV1CreditsRetrieve();

  if (isError) {
    return null;
  }

  const creditsRemaining = creditProfile?.credits ?? 0;

  return (
    <Badge
      variant="secondary"
      className={className ?? "h-8 gap-1.5 px-3 text-sm"}
    >
      <Coins className="h-4 w-4 text-amber-500" />
      {isLoading ? (
        <span>Credits: ...</span>
      ) : (
        <span>
          Credits: <strong className="font-semibold">{creditsRemaining}</strong>
        </span>
      )}
    </Badge>
  );
}
