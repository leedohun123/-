import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "전화번호부",
  description: "나만의 전화번호부 앱",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={geist.className}>
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
