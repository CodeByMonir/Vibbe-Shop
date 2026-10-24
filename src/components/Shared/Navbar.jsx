"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { useStore } from "@/components/context/StoreContext";

export default function Navbar() {
  const { cartCount, favoritesCount } = useStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authentication mock state (replace with your auth provider, e.g., NextAuth/Clerk)
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Search", href: "/search", icon: Search },
    {
      name: "Favorites",
      href: "/favorites",
      icon: Heart,
      badge: mounted && favoritesCount > 0 ? (favoritesCount > 99 ? "99+" : favoritesCount) : null
    },
    {
      name: "Cart",
      href: "/cart",
      icon: ShoppingBag,
      badge: mounted && cartCount > 0 ? (cartCount > 99 ? "99+" : cartCount) : null
    },
    {
      name: isSignedIn ? "Profile" : "",
      href: isSignedIn ? "/profile" : "/signin",
      icon: User,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#ffffff] border-b border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Left: Brand Identity & Moto */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 group">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0">
                <Image
                  src="/vibbeLogo.png"
                  alt="Vibbe Logo"
                  fill
                  sizes="40px"
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#000000] uppercase">
                Vibbe
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#444444] hover:text-[#000000] transition-colors rounded-none focus-visible:outline-2 focus-visible:outline-[#000000] focus-visible:outline-offset-2"
                >
                  <Icon className="w-6 h-6 text-[#333333]" />


                  {item.badge && (
                    <span className="absolute top-1 right-1 w-4 h-4 text-[9px] font-bold text-white bg-[#000000] rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Navigation Controls */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Quick Cart Access on Mobile */}
            <Link
              href="/cart"
              className="relative p-2 text-[#222222] focus-visible:outline-2 focus-visible:outline-[#000000]"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[9px] font-bold text-white bg-[#000000] rounded-full flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="p-2 text-[#000000] rounded-sm focus-visible:outline-2 focus-visible:outline-[#000000]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            className="md:hidden overflow-hidden border-t border-[#e5e7eb] bg-[#ffffff]"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-3 text-sm font-semibold uppercase tracking-wider text-[#333333] hover:bg-[#f9fafb] transition-colors rounded-none"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-[#000000]" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-[#000000] rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}