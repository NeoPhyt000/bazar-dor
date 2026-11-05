"use client";

import { ErrorState } from "@/components/Shell";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <ErrorState
        emoji="⚠️"
        title="কিছু একটা ভুল হয়েছে"
        message="ডেটা আনতে সমস্যা হচ্ছে। একটু পরে আবার চেষ্টা করুন।"
      />
      <div className="-mt-14 pb-14 text-center">
        <button type="button" onClick={reset} className="btn btn-outline">
          আবার চেষ্টা করুন
        </button>
      </div>
    </div>
  );
}
