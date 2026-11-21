"use client";

import { Coins } from "lucide-react";
import { useV1CreditsRetrieve } from "@/api/generated/endpoints/authentication/authentication";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CreditsBadgeProps {
  className?: string;
}

export function CreditsBadge({ className }: CreditsBadgeProps) {
  const { data: creditProfile, isLoading, isError } = useV1CreditsRetrieve();

  if (isError) {
    return null;
  }

  const creditsRemaining = creditProfile?.credits ?? 0;
  const isOutOfCredits = !isLoading && creditsRemaining === 0;

  return (
    <Badge
      variant={isOutOfCredits ? "outline" : "secondary"}
      className={cn(
        "group h-8 gap-1.5 px-3 text-sm transition-all duration-150 ease-out hover:scale-[1.02] hover:border-foreground/25 hover:bg-secondary/80",
        isOutOfCredits &&
          "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
        className,
      )}
    >
      <Coins className="h-4 w-4 text-amber-500 transition-transform duration-200 ease-out group-hover:rotate-12 group-hover:scale-110" />
      {isLoading ? (
        <span className="animate-pulse">Credits: ...</span>
      ) : (
        <span>
          Credits: <strong className="font-semibold">{creditsRemaining}</strong>
        </span>
      )}
    </Badge>
  );
}