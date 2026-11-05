import Link from "next/link";
import type { ChangeDir, Product } from "../lib/types";
import { formatTaka, pctBn, perUnit } from "../lib/format";

const STYLE: Record<ChangeDir, { arrow: string; color: string }> = {
  up: { arrow: "▲", color: "text-rise" },
  down: { arrow: "▼", color: "text-fall" },
  flat: { arrow: "—", color: "text-ink/55" },
};

type ChangeBadgeProps = {
  dir: ChangeDir;
  pct: number;
  variant?: "pill" | "plain";
  className?: string;
};

export function ChangeBadge({ dir, pct, variant = "pill", className = "" }: ChangeBadgeProps) {
  const { arrow, color } = STYLE[dir];
  const base =
    variant === "pill"
      ? "inline-flex h-6 items-center gap-1 rounded-full bg-canvas px-2 text-xs font-semibold"
      : "inline-flex items-center gap-1 text-sm font-semibold";
  return (
    <span className={`${base} ${color} ${className}`}>
      <span aria-hidden="true">{arrow}</span>
      <span>{pctBn(pct)}</span>
      <span className="sr-only">
        {dir === "up" ? "দাম বেড়েছে" : dir === "down" ? "দাম কমেছে" : "দাম অপরিবর্তিত"}
      </span>
    </span>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="card block p-4 transition-colors hover:border-brand/60 hover:bg-white"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-canvas text-2xl">
          <span aria-hidden="true">{product.image}</span>
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold leading-6">{product.nameBn}</h3>
          <p className="text-xs leading-4 text-ink/65">{perUnit(product.unit)}</p>
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs leading-4 text-ink/65">আজকের দাম</p>
          <p className="text-xl font-bold leading-7">{formatTaka(product.today)}</p>
        </div>
        <ChangeBadge dir={product.change.dir} pct={product.change.pct} className="mb-1" />
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

type PriceMoversProps = { kind: "up" | "down"; products: Product[] };

export function PriceMovers({ kind, products }: PriceMoversProps) {
  const rising = kind === "up";
  if (products.length === 0) return null;
  return (
    <section className="space-y-3" aria-labelledby={`movers-${kind}`}>
      <h2 id={`movers-${kind}`} className="flex items-center gap-1.5 text-xl font-bold">
        <span className={rising ? "text-rise" : "text-fall"} aria-hidden="true">
          {rising ? "▲" : "▼"}
        </span>
        {rising ? "আজ দাম বেড়েছে" : "আজ দাম কমেছে"}
      </h2>
      <ProductGrid products={products} />
    </section>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card p-4" aria-hidden="true">
      <div className="flex items-center gap-3">
        <div className="skeleton size-12 rounded-xl" />
        <div className="space-y-2">
          <div className="skeleton h-4 w-28" />
          <div className="skeleton h-3 w-16" />
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div className="space-y-2">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-5 w-24" />
        </div>
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="লোড হচ্ছে…">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
      <span className="sr-only">লোড হচ্ছে…</span>
    </div>
  );
}

export function SectionSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="space-y-3">
      <div className="skeleton h-7 w-40" />
      <GridSkeleton count={count} />
    </section>
  );
}

