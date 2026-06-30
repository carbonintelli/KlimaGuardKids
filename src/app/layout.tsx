import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SiteNav } from "@/components/SiteNav";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "KlimaGuard Kids — Child-Centric Climate Health Intelligence",
  description:
    "Open-source, agentic AI platform measuring child health impact from climate change — with dedicated India regional intelligence across 12 climate zones.",
  icons: {
    icon: "/logo.svg",
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
        <header className="sticky top-0 z-50 border-b border-sky-200/60 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4">
            <Link href="/" className="flex shrink-0 items-center gap-2">
              <Logo size={36} />
            </Link>
            <SiteNav />
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t border-sky-100 bg-white/60 py-8 text-center text-sm text-ink/60">
          <p>
            Open Source · MIT License · Climate & child health intelligence
          </p>
          <p className="mt-1">
            <a
              href="https://github.com/carbonintelli/ClimateResilienceChildHealth"
              className="text-ocean hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contribute on GitHub
            </a>
            {" · "}
            Built for children and communities worldwide — India-first regional depth
          </p>
        </footer>
      </body>
    </html>
  );
}
