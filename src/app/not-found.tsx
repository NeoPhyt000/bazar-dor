import type { Metadata } from "next";
import { ErrorState } from "@/components/Shell";

export const metadata: Metadata = { title: "৪০৪ — পাতাটি পাওয়া যায়নি" };

export default function NotFound() {
  return (
    <ErrorState
      emoji="🔍"
      title="৪০৪ — পাতাটি পাওয়া যায়নি"
      message="আপনি যে পাতা বা পণ্যটি খুঁজছেন সেটি নেই, অথবা ঠিকানাটি ভুল হয়েছে।"
    />
  );
}
