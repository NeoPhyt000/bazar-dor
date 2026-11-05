import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getProducts } from "../../../lib/api";
import { toBn } from "../../../lib/format";
import { PageContainer } from "../../../components/Shell";
import ProductBrowser from "../../../components/ProductBrowser";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug).catch(() => null);
  return { title: category ? `${category.nameBn} এর দাম` : "বিভাগ পাওয়া যায়নি" };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = (await getProducts()).filter((p) => p.category === category.slug);

  return (
    <PageContainer className="space-y-4">
      <header className="card flex items-center gap-3 p-5">
        <span className="text-4xl" aria-hidden="true">
          {category.icon}
        </span>
        <div>
          <h1 className="text-2xl font-bold leading-8">{category.nameBn}</h1>
          <p className="text-sm text-ink/80">{toBn(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
      </header>
      <ProductBrowser products={products} />
    </PageContainer>
  );
}
