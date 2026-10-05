import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "AlgoHabit - Nền Tảng Theo Dõi Thói Quen Luyện Thuật Toán",
  description: "Tự động ghi nhận bài giải LeetCode, Codeforces, duy trì Streak, thi đua cùng Squad và thăng cấp thuật toán mỗi ngày.",
  keywords: ["leetcode habit", "algo tracker", "codeforces habit", "streak leetcode", "blind 75 tracker"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-[#0a0d14] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200`}>
        {children}
      </body>
    </html>
  );
}
