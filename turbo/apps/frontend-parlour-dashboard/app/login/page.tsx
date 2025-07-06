"use client";

import { CldImage } from "next-cloudinary";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SigninInput, signinInput } from "@repo/common/types";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "../../src/context/AuthContext"; // 👈 NEW

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { login } = useAuth(); // 👈 use context login function

  const form = useForm<SigninInput>({
    resolver: zodResolver(signinInput),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SigninInput) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
        data
      );

      const { token, user } = response.data;

      login(token, user.role); // 👈 call login from context
      toast.success("Successfully Logged In!");
      router.replace("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      {/* Left side image */}
      <div className="w-1/2 h-full relative">
        <CldImage
          src="https://res.cloudinary.com/dzbfzbhtn/image/upload/v1751610359/parlour_dkllnt.png"
          fill
          alt="Parlour"
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <h1 className="text-5xl md:text-6xl font-semibold text-center">
            <span className="text-7xl font-bold text-white">Poshlaksh</span>
          </h1>
        </div>
      </div>

      {/* Right side login form */}
      <div className="w-1/2 h-full flex justify-center items-center">
        <div className="w-full max-w-lg rounded shadow-xl p-10 flex justify-center items-center flex-col bg-card">
          <h1 className="font-bold text-4xl text-foreground">Login to your Account</h1>
          <p className="mt-5 text-muted-foreground">Parlour Business Management Software</p>

          <div className="w-full mt-5 px-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="superadmin@gmail.com" {...field} className="py-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="admin123" {...field} className="py-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button type="submit" disabled={isSubmitting} className="w-full py-6">
                  {isSubmitting ? "Logging in..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
