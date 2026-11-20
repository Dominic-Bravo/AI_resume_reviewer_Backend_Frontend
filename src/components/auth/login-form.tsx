"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { useAuthLogin } from "@/api/generated/endpoints/authentication/authentication";
import { AuthLoginBody } from "@/api/generated/zod/authentication/authentication.zod";
import { setAccessToken } from "@/api/axios-instance";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";

type LoginFormValues = z.infer<typeof AuthLoginBody>;

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

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
        const payload = response as unknown as {
          access?: string;
          tokens?: { access?: string };
        };
        const token = payload?.access || payload?.tokens?.access;

        if (token) {
          setAccessToken(token);
        }

        queryClient.clear();
        toast.success("Welcome back!");
        router.replace("/dashboard");
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isPending}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            disabled={isPending}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-2">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <div className="relative flex w-full items-center py-1">
          <div className="grow border-t" />
          <span className="mx-3 shrink text-xs uppercase text-muted-foreground">
            Or continue with
          </span>
          <div className="grow border-t" />
        </div>

        <GoogleAuthButton mode="login" disabled={isPending} />

        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </form>
  );
}