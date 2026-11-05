import { PageContainer } from "@/components/Shell";
import { GridSkeleton } from "@/components/Products";

export default function Loading() {
  return (
    <PageContainer className="space-y-4">
      <div className="skeleton h-[94px] rounded-2xl" />
      <div className="skeleton h-16 rounded-2xl" />
      <GridSkeleton count={6} />
    </PageContainer>
  );
}
