import type { ChangeDir, Product, SortKey } from "./types";

const bnNumber = new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 2 });
const bnNumberFixed = new Intl.NumberFormat("bn-BD", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});


export function toBn(value: number): string {
  return Number.isInteger(value) ? bnNumber.format(value) : bnNumberFixed.format(value);
}


export function formatTaka(value: number): string {
  return `${toBn(value)} টাকা`;
}

const UNIT_BN: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

export function unitBn(unit: string): string {
  return UNIT_BN[unit] ?? unit;
}


export function perUnit(unit: string): string {
  return `প্রতি ${unitBn(unit)}`;
}


export function pctBn(pct: number): string {
  const text = Math.abs(pct).toFixed(1);
  const map = "০১২৩৪৫৬৭৮৯";
  return text.replace(/\d/g, (d) => map[Number(d)]) + "%";
}

export function changeDir(current: number, past: number): ChangeDir {
  if (current > past) return "up";
  if (current < past) return "down";
  return "flat";
}

export function changePct(current: number, past: number): number {
  if (!past) return 0;
  return ((current - past) / past) * 100;
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  if (sort === "default") return products;
  const list = [...products];
  
  list.sort((a, b) => (sort === "asc" ? a.today - b.today : b.today - a.today));
  return list;
}

export function marketAverage(m: { min: number; max: number }): number {
  return (m.min + m.max) / 2;
}

export function summarize(product: Product) {
  const markets = product.markets;
  const minMarket = markets.reduce((a, b) => (b.min < a.min ? b : a), markets[0]);
  const maxMarket = markets.reduce((a, b) => (b.max > a.max ? b : a), markets[0]);
  const avg = markets.reduce((sum, m) => sum + marketAverage(m), 0) / markets.length;
  return { minMarket, maxMarket, min: minMarket.min, max: maxMarket.max, avg };
}

const bnDate = new Intl.DateTimeFormat("bn-BD", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Dhaka",
});


export function banglaDate(date: Date = new Date()): string {
  const parts = bnDate.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("weekday")}, ${get("day")} ${get("month")}, ${get("year")}`;
}
