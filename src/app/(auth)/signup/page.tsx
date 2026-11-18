"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { useAuthRegister } from "@/api/generated/endpoints/authentication/authentication";
import { AuthRegisterBody } from "@/api/generated/zod/authentication/authentication.zod";
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

const SignupSchema = AuthRegisterBody.refine(
  (data) => data.password === data.password_confirm,
  {
    message: "Passwords do not match",
    path: ["password_confirm"],
  },
);

type SignupFormValues = z.infer<typeof SignupSchema>;

export default function SignupPage() {
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
        const token = (response as unknown as { access?: string })?.access;
        if (token) setAccessToken(token);

        toast.success("Account created! Welcome aboard.");
        router.push("/dashboard");
      },
      onError: (error) => {
        const err = error as AxiosError<{ email?: string[]; detail?: string }>;
        const message =
          err.response?.data?.email?.[0] ||
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
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Start analyzing and optimizing your resume with AI.
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
              <Label htmlFor="password">Password (min 8 characters)</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirm">Confirm Password</Label>
              <Input
                id="password_confirm"
                type="password"
                {...register("password_confirm")}
              />
              {errors.password_confirm && (
                <p className="text-xs text-destructive">
                  {errors.password_confirm.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
            <GoogleAuthButton mode="login" disabled={isPending} />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
