import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BSS Backlog & PCR Dashboard",
  description:
    "Dashboard progres program plan, penyerapan Backlog/Schedule PCR/Capitalize, dan status Backlog & PCR — Site Bayan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
