import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { FAQChatbot } from "@/components/faq-chatbot";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import PageProgress from "@/components/page-progress";
import PageAnimation from "@/components/page-animation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://typecircle.vercel.app"),
  title: "TypeCircle - Discover Your Enneagram Personality Type",
  description:
    "Take our comprehensive Enneagram personality assessment to discover your true self. Join a supportive community for personal growth and meaningful connections through the Enneagram system.",
  keywords: [
    "enneagram",
    "personality test",
    "self-discovery",
    "personality types",
    "enneagram assessment",
    "personal growth",
  ],
  authors: [{ name: "TypeCircle" }],
  creator: "TypeCircle",
  publisher: "TypeCircle",
  openGraph: {
    title: "TypeCircle - Discover Your Enneagram Personality Type",
    description:
      "Take our comprehensive Enneagram personality assessment to discover your true self. Join a supportive community for personal growth and meaningful connections.",
    url: "https://typecircle.vercel.app",
    siteName: "TypeCircle",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TypeCircle - Enneagram Personality Assessment",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TypeCircle - Discover Your Enneagram Personality Type",
    description:
      "Take our comprehensive Enneagram personality assessment to discover your true self.",
    images: ["/og-image.png"],
    creator: "@typecircle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "TypeCircle",
      description:
        "Discover your Enneagram personality type with our comprehensive assessment and join a supportive community for personal growth.",
      url: "https://typecircle.vercel.app",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      creator: {
        "@type": "Organization",
        name: "TypeCircle",
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <PageProgress />
            <main className="pt-16 flex-1">
              <PageAnimation>{children}</PageAnimation>
            </main>
            <Footer />
            <FAQChatbot />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
