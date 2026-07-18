// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { heading, body } from "@/fonts";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "typecircle — find your type, find your people",
  description:
    "Discover your Enneagram type and connect with a community that gets it.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="min-h-screen flex flex-col antialiased font-body">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
