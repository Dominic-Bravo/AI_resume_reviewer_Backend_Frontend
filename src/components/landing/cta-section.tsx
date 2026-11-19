import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="border-t bg-muted/30 py-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Ready to see how your resume scores?
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Create a free account in seconds and run your first AI resume analysis
          right away.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/signup" />}
          >
            Create Free Account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}