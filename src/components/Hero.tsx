import Image from "next/image";
import { toBn } from "@/lib/format";
import { BanglaDate } from "./Navbar";

type Props = { productCount: number; marketCount: number; categoryCount: number };

export default function Hero({ productCount, marketCount, categoryCount }: Props) {
  const stats = [
    { label: "পণ্য", value: productCount, caption: "টি নিত্যদিনের পণ্য" },
    { label: "বাজার", value: marketCount, caption: "টি বাজার অন্তর্ভুক্ত" },
    { label: "বিভাগ", value: categoryCount, caption: "টি বিভাগের তথ্য" },
  ];

  return (
    <section className="card overflow-hidden rounded-3xl">
      <div className="grid items-center gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_auto] lg:gap-10">
        <div className="max-w-xl space-y-3">
          <p className="inline-flex h-7 items-center rounded-full bg-brand/10 px-3 text-sm font-medium text-brand">
            <BanglaDate />
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">আজকের বাজারের দাম এক নজরে</h1>
          <p className="text-base leading-relaxed text-ink/80">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়,
            সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>
          <div className="flex flex-wrap gap-3 pt-3">
            <a href="#সব-পণ্য" className="btn btn-primary">
              সব পণ্য দেখুন
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Image
            src="/bazar-hero.png"
            alt="সবজি, ফল ও পণ্যে ভরা বাজারের ঝুড়ি"
            width={315}
            height={263}
            priority
            className="h-auto w-36 sm:w-40"
          />
          <dl className="grid w-full grid-cols-3 divide-x divide-dashed divide-line rounded-2xl border border-line bg-canvas/60 lg:w-[420px]">
            {stats.map((s) => (
              <div key={s.label} className="px-3 py-4 sm:px-5">
                <dt className="text-xs text-ink/70">{s.label}</dt>
                <dd className="text-3xl font-bold leading-10 text-brand">{toBn(s.value)}</dd>
                <dd className="text-xs text-ink/70">{s.caption}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
