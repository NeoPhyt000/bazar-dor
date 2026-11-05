"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { signUp } from "../../../lib/auth-client";
import SocialButtons from "../../../components/SocialButtons";

export default function SignUpPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.confirmPassword) {
      setPasswordError("দুটি পাসওয়ার্ড মিলছে না।");
      toast.error("দুটি পাসওয়ার্ড মিলছে না।");
      return;
    }

    setLoading(true);
    const { data: resData, error } = await signUp.email({
      email: data.email as string, // user email address
      password: data.password as string, // user password -> min 8 characters by default
      name: data.name as string, // user display name
    });
    setLoading(false);

    if (error) {
      toast.error(
        error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" || error.code === "USER_ALREADY_EXISTS"
          ? "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে।"
          : error.message || "অ্যাকাউন্ট তৈরি করা যায়নি, আবার চেষ্টা করুন।"
      );
      return;
    }

    if (resData?.user.name) {
      toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এবার সাইন ইন করুন।");
      router.push("/signin");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-12">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold">অ্যাকাউন্ট তৈরি করুন</h1>
        <p className="text-sm text-ink/80">বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।</p>
      </div>

      <div className="card space-y-4 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-sm font-medium">
              নাম
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="যেমন: রহিম উদ্দিন"
              className="input"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium">
              ইমেইল
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="input"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={isVisible ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => setIsVisible((prev) => !prev)}
                aria-label="পাসওয়ার্ড দেখান/লুকান"
                className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-ink/60 hover:bg-hover"
              >
                {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="block text-sm font-medium">
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={isVisible ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="আবার লিখুন"
              className={`input ${passwordError ? "border-rise" : ""}`}
            />
            {passwordError && (
              <p role="alert" className="text-xs text-rise">
                {passwordError}
              </p>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে…" : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

        <div className="flex items-center gap-3 text-xs text-ink/70">
          <span className="h-px flex-1 bg-line" />
          অথবা
          <span className="h-px flex-1 bg-line" />
        </div>

        <SocialButtons />

        <p className="pt-1 text-sm">
          অ্যাকাউন্ট আছে?{" "}
          <Link href="/signin" className="font-medium text-brand hover:text-brand-deep">
            সাইন ইন করুন
          </Link>
        </p>
      </div>

      <Link href="/" className="mt-5 inline-flex items-center gap-1.5 text-sm hover:text-brand">
        <ArrowLeft className="size-4" /> হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
