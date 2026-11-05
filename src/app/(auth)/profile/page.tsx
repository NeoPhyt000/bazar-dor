"use client";

import Link from "next/link";
import { ArrowLeft, Mail, PencilLine, User } from "lucide-react";
import { Avatar } from "@/components/Navbar";
import { useSession } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10" role="status" aria-label="লোড হচ্ছে">
        <div className="skeleton h-40 rounded-2xl" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">প্রোফাইল দেখা যাচ্ছে না</h1>
        <p className="mt-2 text-sm text-ink/75">প্রোফাইল দেখতে আবার সাইন ইন করুন।</p>
        <Link href="/signin" className="btn btn-primary mt-5">সাইন ইন</Link>
      </div>
    );
  }

  const { name, email } = session.user;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm hover:text-brand">
        <ArrowLeft className="size-4" aria-hidden="true" /> হোম পেজে ফিরে যান
      </Link>

      <div className="mt-5">
        <h1 className="text-2xl font-bold">আমার প্রোফাইল</h1>
        <p className="mt-1 text-sm text-ink/75">আপনার অ্যাকাউন্টের তথ্য দেখুন ও আপডেট করুন।</p>
      </div>

      <section className="card mt-6 p-5 sm:p-7" aria-label="অ্যাকাউন্টের তথ্য">
        <div className="flex items-center gap-4 border-b border-line pb-5">
          <Avatar name={name} className="size-14 rounded-2xl text-xl" />
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold">{name || "ব্যবহারকারী"}</h2>
            <p className="truncate text-sm text-ink/70">{email}</p>
          </div>
        </div>

        <dl className="divide-y divide-line">
          <div className="flex items-start gap-3 py-4">
            <User className="mt-0.5 size-4 shrink-0 text-ink/60" aria-hidden="true" />
            <div className="min-w-0">
              <dt className="text-xs text-ink/65">নাম</dt>
              <dd className="mt-1 break-words text-sm font-medium">{name || "যোগ করা হয়নি"}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3 py-4">
            <Mail className="mt-0.5 size-4 shrink-0 text-ink/60" aria-hidden="true" />
            <div className="min-w-0">
              <dt className="text-xs text-ink/65">ইমেইল</dt>
              <dd className="mt-1 break-all text-sm font-medium">{email}</dd>
            </div>
          </div>
        </dl>

        <Link href="/profile/update-profile" className="btn btn-primary mt-2">
          <PencilLine className="size-4" aria-hidden="true" /> প্রোফাইল আপডেট করুন
        </Link>
      </section>
    </div>
  );
}
