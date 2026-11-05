"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ChevronDown, LogOut, User } from "lucide-react";
import type { Category } from "../lib/types";
import { banglaDate } from "../lib/format";
import { signOut, useSession } from "../lib/auth-client";

export default function Navbar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex items-center gap-3" aria-label="বাজার দর — হোম">
          <span className="flex size-10 items-center justify-center rounded-xl bg-brand text-lg text-on-brand">
            <span aria-hidden="true">🛒</span>
          </span>
          <span className="leading-tight">
            <span className="block text-xl font-bold">বাজার দর</span>
            <BanglaDate className="hidden text-xs text-ink/70 min-[420px]:block" />
          </span>
        </Link>
        <AuthArea />
      </div>

      <nav className="border-t border-line" aria-label="পণ্যের বিভাগ">
        <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2">
          {categories.map((c) => {
            const active = pathname === `/category/${c.slug}`;
            return (
              <li key={c.id} className="shrink-0">
                <Link
                  href={`/category/${c.slug}`}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-8 items-center gap-1.5 rounded-lg px-3.5 text-xs font-semibold transition-colors ${
                    active ? "bg-brand-hover text-on-brand" : "hover:bg-hover"
                  }`}
                >
                  <span aria-hidden="true">{c.icon}</span>
                  {c.nameBn}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

const authBtn = "h-9 px-3 text-[13px] sm:h-10 sm:px-4 sm:text-sm";

function AuthArea() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div className="skeleton h-10 w-28 rounded-lg" aria-label="লোড হচ্ছে…" role="status" />;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/signin" className={`btn btn-outline ${authBtn}`}>
          সাইন ইন
        </Link>
        <Link href="/signup" className={`btn btn-primary ${authBtn}`}>
          সাইন আপ
        </Link>
      </div>
    );
  }

  return <UserMenu name={session.user.name} email={session.user.email} />;
}

function UserMenu({ name, email }: { name: string; email: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function handleSignOut() {
    setOpen(false);
    const { error } = await signOut();
    if (error) {
      toast.error(error.message || "সাইন আউট করা যায়নি, আবার চেষ্টা করুন।");
      return;
    }
    toast.success("সফলভাবে সাইন আউট হয়েছে।");
    router.push("/");
    router.refresh();
  }

  const firstName = name.trim().split(/\s+/)[0] || "ব্যবহারকারী";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="btn btn-ghost h-10 gap-2 px-1.5 font-medium"
      >
        <Avatar name={name} className="size-9 rounded-[10px] text-sm" />
        <span className="hidden max-w-24 truncate sm:inline">{firstName}</span>
        <ChevronDown className="size-3 sm:mr-1" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-30 w-64 rounded-2xl border border-line bg-surface p-2 shadow-lg"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-ink/70">{email}</p>
          </div>
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex h-9 items-center gap-2 rounded-lg px-3 text-sm hover:bg-hover"
          >
            <User className="size-4" aria-hidden="true" /> আমার প্রোফাইল
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-sm text-rise hover:bg-hover"
          >
            <LogOut className="size-4" aria-hidden="true" /> সাইন আউট
          </button>
        </div>
      )}
    </div>
  );
}


export function BanglaDate({ className = "" }: { className?: string }) {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(banglaDate());
  }, []);

  return (
    <span className={`inline-block min-h-4 ${className}`} suppressHydrationWarning>
      {text}
    </span>
  );
}

export function Avatar({ name, className = "" }: { name: string; className?: string }) {
  const initial = Array.from(name.trim())[0]?.toUpperCase() ?? "?";
  return (
    <span
      className={`flex shrink-0 items-center justify-center bg-brand font-bold text-on-brand ${className}`}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const { error } = await signOut();
    if (error) {
      toast.error(error.message || "সাইন আউট করা যায়নি, আবার চেষ্টা করুন।");
      return;
    }
    toast.success("সফলভাবে সাইন আউট হয়েছে।");
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" onClick={handleSignOut} className="btn btn-danger">
      <LogOut className="size-4" aria-hidden="true" />
      সাইন আউট
    </button>
  );
}
