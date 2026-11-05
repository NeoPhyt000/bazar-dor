"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { updateUser, useSession } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const [loading, setLoading] = useState(false);
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();

    if (!name) {
      toast.error("নাম লিখুন।");
      return;
    }

    setLoading(true);
    const { error } = await updateUser({ name });
    setLoading(false);

    if (error) {
      toast.error(error.message || "প্রোফাইল আপডেট করা যায়নি। আবার চেষ্টা করুন।");
      return;
    }

    toast.success("প্রোফাইল আপডেট হয়েছে।");
    router.push("/profile");
    router.refresh();
  };

  if (isPending) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-10" role="status" aria-label="লোড হচ্ছে">
        <div className="skeleton h-48 rounded-2xl" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">প্রোফাইল আপডেট করা যাচ্ছে না</h1>
        <p className="mt-2 text-sm text-ink/75">প্রোফাইল আপডেট করতে আবার সাইন ইন করুন।</p>
        <Link href="/signin" className="btn btn-primary mt-5">সাইন ইন</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-12">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold">প্রোফাইল আপডেট</h1>
        <p className="text-sm text-ink/80">আপনার প্রোফাইলের নাম পরিবর্তন করুন।</p>
      </div>

      <div className="card p-6">
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
              maxLength={100}
              autoComplete="name"
              defaultValue={session.user.name}
              placeholder="আপনার নাম"
              className="input"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "আপডেট হচ্ছে…" : "পরিবর্তন সংরক্ষণ করুন"}
          </button>
        </form>
      </div>

      <Link href="/profile" className="mt-5 inline-flex items-center gap-1.5 text-sm hover:text-brand">
        <ArrowLeft className="size-4" /> প্রোফাইলে ফিরে যান
      </Link>
    </div>
  );
}
