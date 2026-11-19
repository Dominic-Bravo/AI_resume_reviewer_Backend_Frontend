import { FileSearch, ShieldCheck, Target, Zap } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FEATURES = [
  {
    icon: Target,
    title: "Keyword Gap Detection",
    description:
      "Pinpoints exact hard skills and domain terms present in the job posting but missing from your resume.",
  },
  {
    icon: FileSearch,
    title: "4-Axis Scoring",
    description:
      "Evaluates Experience Impact, Skills Alignment, ATS Formatting, and Role Relevance independently.",
  },
  {
    icon: Zap,
    title: "Bullet Point Critiques",
    description:
      "Transforms passive task descriptions into high-impact, metric-driven achievements ready to copy in one click.",
  },
  {
    icon: ShieldCheck,
    title: "Idempotent & Fast",
    description:
      "Asynchronous background processing ensures instant uploads and duplicate-safe scanning without wasting credits.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Built for modern Applicant Tracking Systems
        </h2>
        <p className="mt-2 text-muted-foreground">
          Every report breaks down the exact signals recruiters and automated
          screeners look for.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <CardHeader>
              <Icon className="h-6 w-6 text-primary" />
              <CardTitle className="pt-2 text-base">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}