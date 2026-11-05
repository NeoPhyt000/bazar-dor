"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { getCallbackURL, signIn } from "@/lib/auth-client";
import SocialButtons from "@/components/SocialButtons";

export default function SignInPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("redirect")) {
      toast("এই পাতাটি দেখতে আগে সাইন ইন করুন।", { id: "auth-required", icon: "🔒" });
    }
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    setLoading(true);
    const { error } = await signIn.email({
      email: data.email as string, 
      password: data.password as string,
      callbackURL: getCallbackURL(), 
    });
    setLoading(false);

    if (error) {
      toast.error(
        error.status === 401 ? "ইমেইল বা পাসওয়ার্ড সঠিক নয়।" : error.message || "সাইন ইন করা যায়নি।"
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-12">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold">সাইন ইন</h1>
        <p className="text-sm text-ink/80">বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।</p>
      </div>

      <div className="card space-y-4 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
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
                autoComplete="current-password"
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

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "সাইন ইন হচ্ছে…" : "সাইন ইন"}
          </button>
        </form>

        <div className="flex items-center gap-3 text-xs text-ink/70">
          <span className="h-px flex-1 bg-line" />
          অথবা
          <span className="h-px flex-1 bg-line" />
        </div>

        <SocialButtons />

        <p className="pt-1 text-sm">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/signup" className="font-medium text-brand hover:text-brand-deep">
            সাইন আপ করুন
          </Link>
        </p>
      </div>

      <Link href="/" className="mt-5 inline-flex items-center gap-1.5 text-sm hover:text-brand">
        <ArrowLeft className="size-4" /> হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
