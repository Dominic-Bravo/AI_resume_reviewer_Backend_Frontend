import { Sparkles } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>RoleMatch</span>
        </div>
        <p>© {new Date().getFullYear()} RoleMatch. All rights reserved.</p>
      </div>
    </footer>
  );
}