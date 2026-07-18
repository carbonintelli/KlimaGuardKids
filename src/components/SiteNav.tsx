"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", className: "text-ink/80 hover:text-ocean" },
  { href: "/india", label: "India", className: "text-ink/80 hover:text-saffron" },
  { href: "/play", label: "Kids play", className: "text-ink/80 hover:text-leaf" },
  {
    href: "/pitch",
    label: "About",
    className:
      "rounded-full bg-ocean px-4 py-2 text-white shadow-md hover:bg-sky-600",
  },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative flex items-center" aria-label="Main navigation">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-lg p-2 text-ink/80 hover:bg-sky-50 md:hidden"
        aria-expanded={open}
        aria-controls="site-nav-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
      </button>

      <div
        id="site-nav-menu"
        className={`${
          open
            ? "absolute right-0 top-full z-50 mt-2 flex w-56 flex-col gap-1 rounded-2xl border border-sky-200 bg-white p-3 shadow-lg"
            : "hidden"
        } md:static md:mt-0 md:flex md:w-auto md:flex-row md:flex-wrap md:items-center md:justify-end md:gap-2 md:border-0 md:bg-transparent md:p-0 md:shadow-none lg:gap-3 xl:gap-4`}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${link.className} ${
              open ? "block w-full" : ""
            }`}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
