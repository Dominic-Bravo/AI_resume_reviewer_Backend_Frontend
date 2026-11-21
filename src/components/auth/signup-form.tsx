"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { useAuthRegister } from "@/api/generated/endpoints/authentication/authentication";
import { AuthRegisterBody } from "@/api/generated/zod/authentication/authentication.zod";
import { setAccessToken } from "@/api/axios-instance";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";

const SignupSchema = AuthRegisterBody.refine(
  (data) => data.password === data.password_confirm,
  {
    message: "Passwords do not match",
    path: ["password_confirm"],
  },
);

type SignupFormValues = z.infer<typeof SignupSchema>;

export function SignupForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
  });

  const { mutate: registerUser, isPending } = useAuthRegister({
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

        toast.success("Account created! Welcome aboard.");
        router.push("/dashboard");
      },
      onError: (error) => {
        const err = error as AxiosError<{
          email?: string[];
          password?: string[];
          detail?: string;
        }>;
        const message =
          err.response?.data?.email?.[0] ||
          err.response?.data?.password?.[0] ||
          err.response?.data?.detail ||
          "Registration failed. Please check your details.";
        toast.error(message);
      },
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    registerUser({ data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-up">
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isPending}
            className="transition-colors duration-150 focus-visible:border-foreground/40"
            {...register("email")}
          />
          {errors.email && (
            <p className="animate-fade-up text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password (min 8 characters)</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            disabled={isPending}
            className="transition-colors duration-150 focus-visible:border-foreground/40"
            {...register("password")}
          />
          {errors.password && (
            <p className="animate-fade-up text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password_confirm">Confirm Password</Label>
          <Input
            id="password_confirm"
            type="password"
            autoComplete="new-password"
            disabled={isPending}
            className="transition-colors duration-150 focus-visible:border-foreground/40"
            {...register("password_confirm")}
          />
          {errors.password_confirm && (
            <p className="animate-fade-up text-xs text-destructive">
              {errors.password_confirm.message}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-2">
        <Button
          type="submit"
          className="group w-full transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-1" />
            </>
          )}
        </Button>

        <div className="relative flex w-full items-center py-1">
          <div className="grow border-t" />
          <span className="mx-3 shrink text-xs uppercase text-muted-foreground">
            Or continue with
          </span>
          <div className="grow border-t" />
        </div>

        <GoogleAuthButton mode="signup" disabled={isPending} />

        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 transition-opacity duration-150 hover:opacity-80 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </form>
  );
}