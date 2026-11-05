import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getProductBySlug } from "@/lib/api";
import {
  changeDir,
  changePct,
  formatTaka,
  marketAverage,
  perUnit,
  summarize,
  toBn,
  unitBn,
} from "@/lib/format";
import { ChangeBadge } from "@/components/Products";
import { PageContainer } from "@/components/Shell";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  return { title: product ? product.nameBn : "পণ্য পাওয়া যায়নি" };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const { min, max, avg, minMarket, maxMarket } = summarize(product);
  const diff = product.today - product.yesterday;
  const dir = product.change.dir;
  const diffText =
    dir === "up"
      ? `গতকালের তুলনায় আজ দাম বেড়েছে · ${toBn(Math.abs(diff))} টাকা`
      : dir === "down"
        ? `গতকালের তুলনায় আজ দাম কমেছে · ${toBn(Math.abs(diff))} টাকা`
        : "গতকালের তুলনায় আজ দাম অপরিবর্তিত";

  const cheapestAvg = Math.min(...product.markets.map(marketAverage));

  const history = [
    { label: "গতকাল", value: product.yesterday },
    { label: "গত সপ্তাহ", value: product.lastWeek },
    { label: "গত মাস", value: product.lastMonth },
  ];

  return (
    <PageContainer className="space-y-4">
      <nav aria-label="breadcrumb" className="text-sm">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-brand">
              হোম
            </Link>
          </li>
          <li className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5 text-ink/50" aria-hidden="true" />
            <Link href={`/category/${product.category}`} className="hover:text-brand">
              {product.categoryNameBn}
            </Link>
          </li>
          <li className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5 text-ink/50" aria-hidden="true" />
            <span aria-current="page" className="font-medium">
              {product.nameBn}
            </span>
          </li>
        </ol>
      </nav>

      <header className="card flex flex-col gap-5 p-5 md:flex-row md:items-center">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-canvas text-4xl">
          <span aria-hidden="true">{product.image}</span>
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <h1 className="text-2xl font-bold leading-9 sm:text-3xl">{product.nameBn}</h1>
          <p className="text-sm text-ink/80">
            {perUnit(product.unit)} · {product.categoryNameBn}
          </p>
          <ul className="flex flex-wrap gap-2 pt-1" aria-label="ট্যাগ">
            <li>
              <Link
                href={`/category/${product.category}`}
                className="inline-flex h-6 items-center gap-1 rounded-full bg-canvas px-2.5 text-xs font-medium hover:bg-hover"
              >
                <span aria-hidden="true">{product.categoryIcon}</span>
                {product.categoryNameBn}
              </Link>
            </li>
            <li className="inline-flex h-6 items-center rounded-full bg-canvas px-2.5 text-xs font-medium">
              {perUnit(product.unit)}
            </li>
          </ul>
          <p className="pt-2 text-sm text-ink/80">{diffText}</p>
        </div>
        <div className="rounded-2xl bg-canvas p-5 md:w-[177px] md:shrink-0">
          <p className="text-sm">আজকের দাম</p>
          <p className="text-3xl font-bold leading-9">{toBn(product.today)}</p>
          <p className="text-sm">টাকা / {unitBn(product.unit)}</p>
          <ChangeBadge dir={dir} pct={product.change.pct} variant="plain" className="mt-1" />
        </div>
      </header>

      <section className="card space-y-8 p-5">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">দামের সারসংক্ষেপ</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="সর্বনিম্ন দাম" value={formatTaka(min)} hint={`সবচেয়ে কম দামের বাজার: ${minMarket.market}`} tone="fall" />
            <Stat label="সর্বোচ্চ দাম" value={formatTaka(max)} hint={`সবচেয়ে বেশি দামের বাজার: ${maxMarket.market}`} tone="rise" />
            <Stat label="গড় দাম" value={formatTaka(avg)} hint={`${toBn(product.markets.length)}টি বাজারের গড়`} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {history.map((h) => (
              <div key={h.label} className="rounded-2xl border border-line bg-surface p-4">
                <p className="text-sm">{h.label}</p>
                <p className="text-xl font-bold leading-7">{formatTaka(h.value)}</p>
                <ChangeBadge
                  dir={changeDir(product.today, h.value)}
                  pct={changePct(product.today, h.value)}
                  variant="plain"
                  className="mt-1 text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">বাজারভিত্তিক আজকের দাম</h2>
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-line text-left font-bold">
                  <th className="px-4 py-3">বাজার</th>
                  <th className="px-4 py-3">বিভাগ</th>
                  <th className="px-4 py-3 text-right">সর্বনিম্ন</th>
                  <th className="px-4 py-3 text-right">সর্বাধিক</th>
                  <th className="px-4 py-3 text-right">গড়</th>
                </tr>
              </thead>
              <tbody>
                {product.markets.map((m, i) => {
                  const mAvg = marketAverage(m);
                  const cheapest = mAvg === cheapestAvg;
                  return (
                    <tr key={`${m.market}-${i}`} className={i % 2 === 1 ? "bg-canvas" : undefined}>
                      <td className={`px-4 py-3 ${cheapest ? "font-semibold" : "font-medium"}`}>
                        {m.market}
                        {cheapest && (
                          <span className="ml-2 rounded-full bg-fall/15 px-2 py-0.5 text-[11px] font-semibold text-fall">
                            সবচেয়ে কম গড়
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">{m.division}</td>
                      <td className="px-4 py-3 text-right">{formatTaka(m.min)}</td>
                      <td className="px-4 py-3 text-right">{formatTaka(m.max)}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatTaka(mAvg)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div>
        <Link href={`/category/${product.category}`} className="btn btn-ghost -ml-3">
          <span aria-hidden="true">{product.categoryIcon}</span> সব {product.categoryNameBn}
        </Link>
      </div>
    </PageContainer>
  );
}

function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "fall" | "rise";
}) {
  const color = tone === "fall" ? "text-fall" : tone === "rise" ? "text-rise" : "text-ink";
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-xs">{label}</p>
      <p className={`text-2xl font-bold leading-8 ${color}`}>{value}</p>
      <p className="text-xs text-ink/70">{hint}</p>
    </div>
  );
}
