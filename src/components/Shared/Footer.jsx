"use client";

import {
    ArrowRight,
    CheckCircle2,
    RotateCcw,
    ShieldCheck,
    Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    FaFacebookF,
    FaInstagram,
    FaXTwitter,
    FaYoutube,
} from "react-icons/fa6";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [currentYear, setCurrentYear] = useState(2026);

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail("");
            setTimeout(() => setSubscribed(false), 5000);
        }
    };

    const footerLinks = {
        shop: [
            { name: "Oversized Tees", href: "/category/oversized-tees" },
            { name: "Resort Shirts", href: "/category/shirts" },
            { name: "Cargo & Utility", href: "/category/cargos" },
            { name: "Denim & Jeans", href: "/category/denim" },
            { name: "Tailored Trousers", href: "/category/trousers" },
            { name: "Sneakers", href: "/category/sneakers" },
        ],
        support: [
            { name: "Track Your Order", href: "/track-order" },
            { name: "Returns & Exchanges", href: "/returns" },
            { name: "Shipping & Delivery", href: "/shipping" },
            { name: "Size Guide", href: "/size-guide" },
            { name: "Contact Us", href: "/contact" },
            { name: "FAQs", href: "/faqs" },
        ],
        brand: [
            { name: "About Vibbe", href: "/about" },
            { name: "Stores & Outlets", href: "/stores" },
            { name: "Sustainability", href: "/sustainability" },
            { name: "Careers", href: "/careers" },
            { name: "Press & Media", href: "/press" },
        ],
        legal: [
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" },
            { name: "Return Policy", href: "/return-policy" },
            { name: "Grievance Officer", href: "/grievance" },
        ],
    };

    return (
        <footer className="w-full bg-[#ffffff] text-[#111827] border-t border-[#e5e7eb] font-sans">
            {/* 1. Value Proposition Banner */}
            <div className="border-b border-[#e5e7eb]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#f4f4f5] flex items-center justify-center shrink-0">
                                <Truck className="w-6 h-6 text-[#000000]" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                                    Nationwide Express Delivery
                                </h4>
                                <p className="text-xs text-[#444444] mt-0.5">
                                    Free delivery across Bangladesh on orders over ৳1,500
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#f4f4f5] flex items-center justify-center shrink-0">
                                <RotateCcw className="w-6 h-6 text-[#000000]" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                                    7-Day Easy Exchange
                                </h4>
                                <p className="text-xs text-[#444444] mt-0.5">
                                    Hassle-free replacement policy with doorstep pickup
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#f4f4f5] flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-6 h-6 text-[#000000]" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                                    100% Authentic Apparel
                                </h4>
                                <p className="text-xs text-[#444444] mt-0.5">
                                    Ethically crafted with certified heavyweight cotton fabrics
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Footer Directory & Newsletter */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
                    {/* Brand & Newsletter Column (5 Cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-between">
                        <div>
                            <Link href="/" className="inline-flex items-center gap-2 group mb-4">
                                <div className="relative w-8 h-8 shrink-0">
                                    <Image
                                        src="/img/logo/vibbeLogo.png"
                                        alt="Vibbe"
                                        fill
                                        sizes="32px"
                                        className="object-contain"
                                    />
                                </div>
                                <span className="text-xl font-black uppercase tracking-tight text-[#000000]">
                                    Vibbe
                                </span>
                            </Link>
                            <p className="text-xs sm:text-sm text-[#444444] max-w-sm leading-relaxed mb-6">
                                Premium modern street tailoring and elevated basics engineered for confidence and everyday comfort.
                            </p>

                            {/* Newsletter Form */}
                            <div className="max-w-md">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-[#000000] mb-2">
                                    Join the Inner Circle
                                </h4>
                                <p className="text-xs text-[#444444] mb-3">
                                    Get exclusive access to weekly limited drops, lookbooks, and private seasonal sales.
                                </p>

                                <form onSubmit={handleSubscribe} className="relative flex items-center">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address..."
                                        required
                                        className="w-full h-11 px-4 pr-28 text-xs bg-[#ffffff] border border-[#e5e7eb] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#000000] transition-colors"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-1 top-1 bottom-1 px-4 bg-[#000000] text-white hover:bg-[#222222] transition-colors flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider focus-visible:outline-2 focus-visible:outline-[#000000]"
                                    >
                                        <span>Join</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </form>

                                {subscribed && (
                                    <p className="flex items-center gap-1.5 text-xs text-[#15803d] mt-2 font-medium">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Welcome to Vibbe. Check your inbox soon!</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="mt-8 flex items-center gap-3">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                                className="w-9 h-9 rounded-full border border-[#e5e7eb] flex items-center justify-center text-[#333333] hover:text-[#000000] hover:border-[#000000] transition-colors"
                            >
                                <FaInstagram className="w-4 h-4" />
                            </a>

                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Facebook"
                                className="w-9 h-9 rounded-full border border-[#e5e7eb] flex items-center justify-center text-[#333333] hover:text-[#000000] hover:border-[#000000] transition-colors"
                            >
                                <FaFacebookF className="w-3.5 h-3.5" />
                            </a>

                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="X (Twitter)"
                                className="w-9 h-9 rounded-full border border-[#e5e7eb] flex items-center justify-center text-[#333333] hover:text-[#000000] hover:border-[#000000] transition-colors"
                            >
                                <FaXTwitter className="w-3.5 h-3.5" />
                            </a>

                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="YouTube"
                                className="w-9 h-9 rounded-full border border-[#e5e7eb] flex items-center justify-center text-[#333333] hover:text-[#000000] hover:border-[#000000] transition-colors"
                            >
                                <FaYoutube className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Nav Links Columns (7 Cols) */}
                    <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
                        {/* Column 1: Shop */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[#000000] mb-4">
                                Shop
                            </h3>
                            <ul className="space-y-2.5">
                                {footerLinks.shop.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-xs text-[#444444] hover:text-[#000000] transition-colors block py-0.5"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 2: Help & Support */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[#000000] mb-4">
                                Help
                            </h3>
                            <ul className="space-y-2.5">
                                {footerLinks.support.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-xs text-[#444444] hover:text-[#000000] transition-colors block py-0.5"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3: Brand */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[#000000] mb-4">
                                Brand
                            </h3>
                            <ul className="space-y-2.5">
                                {footerLinks.brand.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-xs text-[#444444] hover:text-[#000000] transition-colors block py-0.5"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 4: Legal & Policies */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[#000000] mb-4">
                                Legal
                            </h3>
                            <ul className="space-y-2.5">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-xs text-[#444444] hover:text-[#000000] transition-colors block py-0.5"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Sub-Footer (Copyright & Payment Badges) */}
            <div className="border-t border-[#e5e7eb] bg-[#fafafa]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-[#444444] tracking-wide text-center sm:text-left">
                        © {currentYear} VIBBE SHOP BANGLADESH PVT. LTD. ALL RIGHTS RESERVED.
                    </p>

                    {/* Standard Bangladesh Payment Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-bold text-[#333333] uppercase tracking-wider">
                        <span className="px-2.5 py-1 bg-white border border-[#e5e7eb]">Developed <a
                            href="https://codebymonir.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                        >CodeByMonir</a></span>
                    </div>
                </div>
            </div>
        </footer>
    );
}