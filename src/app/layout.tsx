import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { Suspense } from "react";
import { AppChrome } from "@/components/AppChrome";
import { INDIA_REGIONS } from "@/lib/india-regions";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "KlimaGuard Kids — Child-Centric Climate Health Intelligence",
  description:
    `Open-source, agentic AI platform measuring child health impact from climate change — with dedicated India regional intelligence across ${INDIA_REGIONS.length} climate zones.`,
  icons: {
    icon: [{ url: "/logo/logo_klimaguardkids.jpeg", type: "image/jpeg" }],
    shortcut: "/logo/logo_klimaguardkids.jpeg",
    apple: [
      {
        url: "/logo/logo_klimaguardkids.jpeg",
        sizes: "1254x1254",
        type: "image/jpeg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-sans antialiased`}>
        <Suspense fallback={<main className="min-h-screen">{children}</main>}>
          <AppChrome>{children}</AppChrome>
        </Suspense>
      </body>
    </html>
  );
}
