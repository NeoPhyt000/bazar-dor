import { PageContainer } from "@/components/Shell";
import { SectionSkeleton } from "@/components/Products";

export default function Loading() {
  return (
    <PageContainer className="space-y-8">
      <div className="skeleton h-72 rounded-3xl" />
      <SectionSkeleton />
      <SectionSkeleton />
      <SectionSkeleton count={9} />
    </PageContainer>
  );
}
