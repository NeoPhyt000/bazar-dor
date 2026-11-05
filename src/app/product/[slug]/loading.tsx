import { PageContainer } from "@/components/Shell";

export default function Loading() {
  return (
    <PageContainer className="space-y-4" >
      <div role="status" aria-label="লোড হচ্ছে…" className="space-y-4">
        <div className="skeleton h-5 w-56" />
        <div className="skeleton h-44 rounded-2xl" />
        <div className="skeleton h-[560px] rounded-2xl" />
      </div>
    </PageContainer>
  );
}
