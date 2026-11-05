import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { getCategories, getProducts } from "../lib/api";
import type { Category, Product } from "../lib/types";
import Navbar from "../components/Navbar";
import Ticker from "../components/Ticker";
import { Footer } from "../components/Shell";
import { Toaster } from "react-hot-toast";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-hind-siliguri",
});


export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "বাজার দর — আজকের বাজারের দাম এক নজরে",
    template: "%s | বাজার দর",
  },
  description:
    "চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার আজকের দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let categories: Category[] = [];
  let products: Product[] = [];
  try {
    [categories, products] = await Promise.all([getCategories(), getProducts()]);
  } catch {
    
  }

  return (
    <html lang="bn">
      <body className={`${hindSiliguri.variable} flex min-h-screen flex-col`}>
        <Navbar categories={categories} />
        <Ticker products={products} />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#fafcfa",
              color: "#1d271f",
              border: "1px solid rgb(29 39 31 / 0.12)",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#05893e", secondary: "#f3fbf4" } },
            error: { iconTheme: { primary: "#d03739", secondary: "#fff6f5" } },
          }}
        />
      </body>
    </html>
  );
}
