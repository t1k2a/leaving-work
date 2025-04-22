import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import * as dotenv from 'dotenv';

dotenv.config({path: `${process.cwd()}/.env`});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "退勤アプリ",
  description: "退勤を記録するだけのアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
