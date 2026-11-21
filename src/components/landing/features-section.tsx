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
    <section id="features" className="border-t bg-background py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="animate-fade-up mx-auto max-w-2xl text-center">
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
            <Card
              key={title}
              className="group animate-fade-up transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-md"
            >
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/50 transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5 transition-transform duration-200 ease-out group-hover:scale-105" />
                </div>
                <CardTitle className="pt-3 text-base">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}