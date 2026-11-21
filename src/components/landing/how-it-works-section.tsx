import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const STEPS = [
  {
    step: "Step 01",
    title: "Upload Your Resume",
    description:
      "Drop in your current PDF or DOCX resume. Our parser extracts layout, metrics, and skill hierarchy cleanly.",
  },
  {
    step: "Step 02",
    title: "Paste the Job Description",
    description:
      "Add the target role title and posting requirements so our AI benchmarks your experience against real recruiter filters.",
  },
  {
    step: "Step 03",
    title: "Apply Actionable Rewrites",
    description:
      "Copy quantified bullet point improvements and weave missing keywords naturally into your resume before hitting submit.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-t bg-background py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="animate-fade-up mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            From raw resume to interview-ready in three steps
          </h2>
          <p className="mt-2 text-muted-foreground">
            No generic templates—tailor every application to the exact role you
            are targeting.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ step, title, description }) => (
            <Card
              key={step}
              className="group animate-fade-up transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-md"
            >
              <CardHeader>
                <Badge
                  variant="outline"
                  className="w-fit transition-colors duration-200 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  {step}
                </Badge>
                <CardTitle className="pt-2 text-lg">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}