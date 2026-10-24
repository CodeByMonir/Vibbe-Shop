"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useStore } from "@/components/context/StoreContext";

export default function Navbar() {
  const { cartCount, favoritesCount } = useStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent SSR hydration mismatch for dynamic localStorage counters
  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "New Drops", href: "/search?category=All" },
    { name: "Oversized Tees", href: "/search?category=Oversized+Tees" },
    { name: "Shirts", href: "/search?category=Shirts" },
    { name: "Cargos", href: "/search?category=Cargos" },
    { name: "Denim", href: "/search?category=Denim" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#ffffff] border-b border-[#e5e7eb] font-sans selection:bg-[#000000] selection:text-white">
      {/* Top Shipping Bar Announcement */}
      <div className="bg-[#000000] text-white text-[11px] font-semibold tracking-widest uppercase py-2 px-4 text-center">
        Pan-Bangladesh Free Express Shipping on orders over ৳1,500
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Left: Mobile Menu Button & Desktop Nav Links */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-[#000000] hover:opacity-70 transition-opacity"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs font-bold uppercase tracking-wider text-[#111111] hover:text-[#d95338] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: Brand Logo */}
          <div className="flex-1 lg:flex-initial text-center lg:text-left flex justify-center items-center">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 shrink-0">
                <Image
                  src="/vibbeLogo.png"
                  alt="Vibbe"
                  fill
                  sizes="32px"
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-[#000000]">
                Vibbe
              </span>
            </Link>
          </div>

          {/* Right: Search, Wishlist & Cart Action Icons */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Search Link */}
            <Link
              href="/search"
              aria-label="Search Collection"
              className="p-1.5 text-[#000000] hover:text-[#d95338] transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Wishlist Link with Live Counter */}
            <Link
              href="/favorites"
              aria-label="Wishlist"
              className="relative p-1.5 text-[#000000] hover:text-[#d95338] transition-colors"
            >
              <Heart className="w-5 h-5" />
              {mounted && favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#d95338] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {favoritesCount > 99 ? "99+" : favoritesCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Link with Live Counter */}
            <Link
              href="/cart"
              aria-label="Shopping Bag"
              className="relative p-1.5 text-[#000000] hover:text-[#d95338] transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#000000] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e5e7eb] bg-[#ffffff] px-6 py-6 transition-all">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold uppercase tracking-wider text-[#111111] hover:text-[#d95338] py-1 border-b border-[#f4f4f5]"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold uppercase tracking-wider text-[#d95338] py-1 pt-2"
            >
              Search All Products →
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}