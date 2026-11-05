"use client";

import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import type { Product } from "@/lib/types";
import { formatTaka, pctBn, unitBn } from "@/lib/format";

const COLOR = { up: "text-rise", down: "text-fall", flat: "text-ink/55" } as const;
const ARROW = { up: "▲", down: "▼", flat: "—" } as const;

export default function Ticker({ products }: { products: Product[] }) {
  const [play, setPlay] = useState(true);

  
  useEffect(() => {
    setPlay(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="h-9 overflow-hidden border-b border-line bg-surface" role="region" aria-label="আজকের দামের টিকার">
      <Marquee play={play} pauseOnHover speed={45} autoFill className="h-9 overflow-y-hidden">
        {products.map((p) => (
          <div key={p.id} className="flex shrink-0 items-center gap-2 px-4 text-sm">
            <span aria-hidden="true">{p.image}</span>
            <span className="font-medium">{p.nameBn}</span>
            <span>
              {formatTaka(p.today)}/{unitBn(p.unit)}
            </span>
            <span className={`font-semibold ${COLOR[p.change.dir]}`}>
              {ARROW[p.change.dir]} {pctBn(p.change.pct)}
            </span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
