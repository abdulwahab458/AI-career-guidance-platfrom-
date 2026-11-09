"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { GetStarted, SignIn } from "@/components/landing/Ctas";
import BrandLogo from "./BrandLogo";

const marketingLinks = [
  { href: "#product", label: "Product" },
  { href: "#workflow", label: "Workflow" },
  { href: "#features", label: "Features" },
  { href: "#questions", label: "Questions" },
];

const Header = () => {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useUser();
  const isLanding = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isLanding) return undefined;

    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLanding]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        isLanding
          ? scrolled || menuOpen
            ? "border-b border-sky-300/10 bg-[#07080d]/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
          : "border-b border-white/10 bg-slate-950/90 backdrop-blur-xl"
      }`}
    >
      <div className={`flex h-16 items-center justify-between ${isLanding ? "mx-auto max-w-6xl px-6" : "px-4 sm:px-6"}`}>
        <BrandLogo />

        {isLanding && (
          <nav className="hidden items-center gap-8 md:flex" aria-label="Page">
            {marketingLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-400 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-1 sm:gap-2">
          {isLanding && (
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full text-white md:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
          <SignIn className={isLanding ? "hidden sm:inline-flex" : ""} />
          {!isLoaded ? (
            <span aria-hidden="true" className="h-11 w-28 rounded-full bg-white/10" />
          ) : isSignedIn ? (
            <span className="ml-1 flex items-center">
              <UserButton />
            </span>
          ) : (
            <GetStarted className="h-10 px-4" />
          )}
        </div>
      </div>

      {isLanding && menuOpen && (
        <nav className="border-t border-white/10 px-6 py-3 md:hidden" aria-label="Page">
          {marketingLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm text-zinc-200"
            >
              {link.label}
            </a>
          ))}
          <div className="py-2 sm:hidden">
            <SignIn />
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
