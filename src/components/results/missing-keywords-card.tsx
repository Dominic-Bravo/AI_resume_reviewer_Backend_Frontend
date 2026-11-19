import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MissingKeywordsCardProps {
  keywords?: readonly string[] | null;
}

export function MissingKeywordsCard({ keywords }: MissingKeywordsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Missing Keywords</CardTitle>
        <CardDescription>
          High-priority terms from the job description not detected in your
          resume
        </CardDescription>
      </CardHeader>
      <CardContent>
        {keywords && keywords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw) => (
              <Badge key={kw} variant="destructive">
                {kw}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No major keyword gaps detected!
          </p>
        )}
      </CardContent>
    </Card>
  );
}