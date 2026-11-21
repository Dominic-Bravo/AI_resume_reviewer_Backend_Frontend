import Link from "next/link";
import { Sparkles } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 px-4">
      <Link
        href="/"
        className="group animate-fade-up mb-6 flex items-center gap-2 font-bold tracking-tight transition-opacity duration-150 hover:opacity-90"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs transition-all duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:shadow-md">
          <Sparkles className="h-4 w-4 transition-transform duration-200 ease-out group-hover:rotate-12" />
        </div>
        <span className="text-lg">RoleMatch</span>
      </Link>

      <Card className="animate-fade-up w-full max-w-md shadow-sm transition-all duration-200 ease-out hover:border-foreground/20 hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your resume scans.
          </CardDescription>
        </CardHeader>
        <LoginForm />
      </Card>
    </div>
  );
}