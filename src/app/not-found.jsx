"use client";

import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#ffffff] text-[#111827] flex items-center justify-center px-4 sm:px-6 lg:px-8 selection:bg-[#000000] selection:text-white">
            <div className="max-w-2xl w-full text-center py-16">
                {/* Subtle Brand Tag */}
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-xs font-bold uppercase tracking-[0.25em] text-[#444444] mb-4"
                >
                    Error 404 • Page Not Found
                </motion.p>

                {/* Large Editorial Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-7xl sm:text-9xl font-black tracking-tighter text-[#000000] leading-none mb-6"
                >
                    LOST.
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-sm sm:text-base text-[#444444] max-w-md mx-auto leading-relaxed mb-10"
                >
                    The drop or collection you are looking for has been moved, sold out,
                    or does not exist.
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14"
                >
                    {/* Primary Button: Return Home */}
                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#000000] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#222222] transition-colors focus-visible:outline-2 focus-visible:outline-[#000000] focus-visible:outline-offset-2"
                    >
                        <Home className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Link>

                    {/* Secondary Button: Browse Shop */}
                    <Link
                        href="/search"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent text-[#000000] border border-[#e5e7eb] hover:border-[#000000] text-xs font-semibold uppercase tracking-wider transition-colors focus-visible:outline-2 focus-visible:outline-[#000000] focus-visible:outline-offset-2"
                    >
                        <Search className="w-4 h-4" />
                        <span>Search Catalog</span>
                    </Link>
                </motion.div>

                {/* Quick Links Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="pt-10 border-t border-[#e5e7eb] flex flex-wrap justify-center gap-6 sm:gap-8 text-xs font-medium text-[#444444]"
                >
                    <Link
                        href="/category/oversized-tees"
                        className="hover:text-[#000000] transition-colors underline-offset-4 hover:underline"
                    >
                        Oversized Tees
                    </Link>
                    <Link
                        href="/category/shirts"
                        className="hover:text-[#000000] transition-colors underline-offset-4 hover:underline"
                    >
                        Resort Shirts
                    </Link>
                    <Link
                        href="/category/trousers"
                        className="hover:text-[#000000] transition-colors underline-offset-4 hover:underline"
                    >
                        Bottomwear
                    </Link>
                    <Link
                        href="/cart"
                        className="hover:text-[#000000] transition-colors underline-offset-4 hover:underline"
                    >
                        View Bag
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
