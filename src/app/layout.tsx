import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "APELSI - Aplikasi Pencatatan Pelanggaran Siswa SAAS",
  description: "APELSI (Aplikasi Pencatatan Pelanggaran Siswa) adalah platform SAAS modern untuk mempermudah sekolah dalam mengelola, mencatat, dan memantau data pelanggaran serta kedisiplinan siswa secara real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        </div>
        <Toaster/>
      </body>
    </html>
  );
}
