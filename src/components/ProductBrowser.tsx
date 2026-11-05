"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import type { Category, Product, SortKey } from "@/lib/types";
import { sortProducts, toBn } from "@/lib/format";
import { ProductGrid } from "./Products";

type Props = {
  products: Product[];
  /** When provided, search + category chips are shown (home page). */
  categories?: Category[];
};

export default function ProductBrowser({ products, categories }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortKey>("default");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = products.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (q === "" || p.nameBn.toLowerCase().includes(q))
    );
    return sortProducts(filtered, sort);
  }, [products, query, category, sort]);

  return (
    <div className="space-y-4">
      <div className="card flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        {categories && (
          <>
            <div className="relative w-full lg:w-56">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/55"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="পণ্যের নাম লিখুন…"
                aria-label="পণ্য খুঁজুন"
                className="input pl-9"
              />
            </div>
            <div className="-mx-1 flex flex-1 gap-1.5 overflow-x-auto px-1 py-1" role="group" aria-label="বিভাগ ফিল্টার">
              <Chip active={category === "all"} onClick={() => setCategory("all")}>
                সব
              </Chip>
              {categories.map((c) => (
                <Chip key={c.id} active={category === c.slug} onClick={() => setCategory(c.slug)}>
                  <span aria-hidden="true">{c.icon}</span> {c.nameBn}
                </Chip>
              ))}
            </div>
          </>
        )}
        <div className={categories ? "lg:ml-auto" : "ml-auto"}>
          <SortSelect value={sort} onChange={setSort} />
        </div>
      </div>

      <p className="text-sm" aria-live="polite">
        মোট {toBn(visible.length)}টি পণ্য দেখানো হচ্ছে
      </p>

      {visible.length > 0 ? (
        <ProductGrid products={visible} />
      ) : (
        <div className="card px-4 py-12 text-center">
          <p className="text-lg font-semibold">কোনো পণ্য পাওয়া যায়নি</p>
          <p className="mt-1 text-sm text-ink/70">অন্য নাম লিখে বা অন্য বিভাগ বেছে আবার চেষ্টা করুন।</p>
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-6 shrink-0 cursor-pointer rounded-lg px-2.5 text-[11px] font-semibold transition-colors ${
        active ? "bg-brand text-on-brand" : "hover:bg-hover"
      }`}
    >
      {children}
    </button>
  );
}

const OPTIONS: { value: SortKey; label: string }[] = [
  { value: "default", label: "ডিফল্ট" },
  { value: "asc", label: "দাম: কম থেকে বেশি" },
  { value: "desc", label: "দাম: বেশি থেকে কম" },
];

type SortSelectProps = { value: SortKey; onChange: (value: SortKey) => void };

function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span>সাজান</span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SortKey)}
          className="h-8 cursor-pointer appearance-none rounded-lg border border-line bg-surface pl-3 pr-8 text-xs hover:bg-hover"
        >
          {OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2"
          aria-hidden="true"
        />
      </span>
    </label>
  );
}
