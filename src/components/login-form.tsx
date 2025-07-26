"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLogin } from "@react-oauth/google";
import { IconBrandGoogle } from "@tabler/icons-react";
import axios from "axios";
import { deleteCookie } from "cookies-next/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { getErrorMessage, setFormErrors } from "./utils/errorUtils";
import {
  ACCESS_TOKEN_COOKIE,
  API_BASE_URL,
  tokenUtils,
} from "./utils/requestUtils";

const loginFormSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

const loginPost = async (url: string, data: any) => {
  const axiosF = axios.create({
    baseURL: API_BASE_URL,
  });
  const response = await axiosF.post(url, data);
  return response.data;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      let loadingToastId;
      try {
        loadingToastId = toast.loading("Logging in...");
        const res = await loginPost(
          "/api/account/google-login?access_token=" +
            tokenResponse.access_token,
          {},
        );
        toast.dismiss(loadingToastId);
        toast.success("Logged in successfully!");
        tokenUtils.setTokens(res.accessToken, res.refreshToken);
        router.push("/dashboard");
      } catch (error) {
        toast.error(getErrorMessage(error) || "Login failed!");
      } finally {
        toast.dismiss(loadingToastId);
      }
    },
  });

  useEffect(() => {
    deleteCookie(ACCESS_TOKEN_COOKIE, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }, []);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    let loadingToastId;
    try {
      loadingToastId = toast.loading("Logging in...");
      const res = await loginPost("/api/account/login", {
        usernameOrEmail: values.usernameOrEmail,
        password: values.password,
      });
      toast.dismiss(loadingToastId);
      toast.success("Logged in successfully!");
      tokenUtils.setTokens(res.accessToken, res.refreshToken);
      router.push("/dashboard");
    } catch (error) {
      setFormErrors(error, form.setError);
      console.error("Login error eee:", error);

      toast.error(getErrorMessage(error) || "Login failed!");
    } finally {
      toast.dismiss(loadingToastId);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your username or email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                {form.formState.errors.root && (
                  <div className="text-destructive text-sm">
                    {form.formState.errors.root.message}
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="usernameOrEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username or email</FormLabel>
                      <FormControl>
                        <Input spellCheck={false} type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="#"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          spellCheck={false}
                          type="password"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={() => login()}
                  >
                    Login with Google <IconBrandGoogle />
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="register" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
