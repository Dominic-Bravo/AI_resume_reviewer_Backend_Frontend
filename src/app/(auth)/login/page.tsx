"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { useAuthLogin } from "@/api/generated/endpoints/authentication/authentication";
import { AuthLoginBody } from "@/api/generated/zod/authentication/authentication.zod";
import { setAccessToken } from "@/api/axios-instance";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type LoginFormValues = z.infer<typeof AuthLoginBody>;

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(AuthLoginBody),
  });

  const { mutate: login, isPending } = useAuthLogin({
    mutation: {
      onSuccess: (response) => {
        // Your backend returns { access: "..." } alongside setting the HttpOnly refresh cookie
        const token = (response as unknown as { access?: string })?.access;
        if (token) setAccessToken(token);

        toast.success("Welcome back!");
        router.push("/dashboard");
      },
      onError: (error) => {
        const err = error as AxiosError<{ detail?: string }>;
        toast.error(err.response?.data?.detail || "Invalid email or password.");
      },
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login({ data });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your resume scans.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </p>
            <GoogleAuthButton mode="login" disabled={isPending} />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
