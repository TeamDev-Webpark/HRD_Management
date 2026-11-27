import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai } from "next/font/google";
import { MainLayout } from "@/components/layout/MainLayout";
import { DemoStoreProvider } from "@/context/DemoStoreContext";
import { LayoutProvider } from "@/context/LayoutContext";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-thai",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HRD Management | ระบบบริหารและพัฒนาทรัพยากรบุคคล",
  description:
    "ระบบบริหารและพัฒนาทรัพยากรบุคคล (Human Resource Development) สำหรับองค์กร",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${notoSansThai.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[#F8FAFC] text-[#1E293B] antialiased">
        <DemoStoreProvider>
          <LayoutProvider>
            <MainLayout>{children}</MainLayout>
          </LayoutProvider>
        </DemoStoreProvider>
      </body>
    </html>
  );
}
