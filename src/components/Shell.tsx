import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-6 text-center text-sm sm:flex-row sm:justify-between sm:text-left">
        <p>বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
        <p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
      </div>
    </footer>
  );
}

export function PageContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-6xl px-4 py-6 ${className}`}>{children}</div>;
}

type Props = { title: string; message: string; emoji?: string };

export function ErrorState({ title, message, emoji = "🛒" }: Props) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-surface text-4xl border border-line">
        <span aria-hidden="true">{emoji}</span>
      </div>
      <h1 className="mt-5 text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-ink/75">{message}</p>
      <Link href="/" className="btn btn-primary mt-6">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}

