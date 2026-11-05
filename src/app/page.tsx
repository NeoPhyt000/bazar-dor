import { getCategories, getProducts } from "../lib/api";
import Hero from "@/components/Hero";
import { PageContainer } from "@/components/Shell";
import { PriceMovers } from "@/components/Products";
import ProductBrowser from "@/components/ProductBrowser";

export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const risers = products
    .filter((p) => p.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);
  const fallers = products
    .filter((p) => p.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, 6);

  const marketCount = new Set(products.flatMap((p) => p.markets.map((m) => m.market))).size;

  return (
    <PageContainer className="space-y-8">
      <Hero productCount={products.length} marketCount={marketCount} categoryCount={categories.length} />
      <PriceMovers kind="up" products={risers} />
      <PriceMovers kind="down" products={fallers} />
      <section id="সব-পণ্য" className="scroll-mt-6 space-y-3">
        <h2 className="text-xl font-bold">সব পণ্য</h2>
        <ProductBrowser products={products} categories={categories} />
      </section>
    </PageContainer>
  );
}
