"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { useStore } from "@/components/context/StoreContext";
import LoadingSpinner from "../loading/loading";

export default function CategoryShowcase({ initialCategories = [] }) {
    const { addToCart, toggleFavorite, isFavorite } = useStore();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                const res = await fetch("/data/products.json");
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}: Failed to load /data/products.json`);
                }

                const json = await res.json();

                // Safely extract array whether JSON is [ ... ] or { products: [ ... ] } or { data: [ ... ] }
                let items = [];
                if (Array.isArray(json)) {
                    items = json;
                } else if (Array.isArray(json?.products)) {
                    items = json.products;
                } else if (Array.isArray(json?.data)) {
                    items = json.data;
                } else {
                    throw new Error("JSON structure invalid: expected an array of products.");
                }

                if (isMounted) {
                    setProducts(items);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("CategoryShowcase error:", err);
                    setFetchError(err.message);
                    setLoading(false);
                }
            }
        }

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    // Group products by category
    const groupedProducts = useMemo(() => {
        if (!products || products.length === 0) return {};

        const groups = {};

        products.forEach((product) => {
            const cat = (product.category || "Uncategorized").trim();
            if (!groups[cat]) {
                groups[cat] = [];
            }
            groups[cat].push(product);
        });

        // If specific initial categories are requested, filter with fallback
        if (initialCategories && initialCategories.length > 0) {
            const filtered = {};
            const availableKeys = Object.keys(groups);

            initialCategories.forEach((target) => {
                const found = availableKeys.find(
                    (k) => k.toLowerCase().trim() === target.toLowerCase().trim()
                );
                if (found && groups[found].length > 0) {
                    filtered[found] = groups[found];
                }
            });

            // If categories matched, use filtered; otherwise fall back to all groups
            if (Object.keys(filtered).length > 0) {
                return filtered;
            }
        }

        return groups;
    }, [products, initialCategories]);

    // 1. Loading State
    if (loading) {
        return <LoadingSpinner text="Loading curated collections..." className="py-24" />;
    }

    // 2. Fetch or Parse Error State
    if (fetchError) {
        return (
            <div className="py-12 text-center border border-dashed border-[#d95338] max-w-xl mx-auto my-8 px-4">
                <p className="text-xs font-bold uppercase text-[#d95338] tracking-wider mb-1">
                    Catalog Loading Error
                </p>
                <p className="text-xs text-[#555555] font-mono">{fetchError}</p>
            </div>
        );
    }

    const categoryEntries = Object.entries(groupedProducts);

    // 3. Empty Products State
    if (categoryEntries.length === 0) {
        return (
            <div className="py-16 text-center text-xs font-bold uppercase tracking-widest text-[#9ca3af]">
                No products found in catalog.
            </div>
        );
    }

    return (
        <div className="w-full bg-[#ffffff] py-10 sm:py-16 selection:bg-[#000000] selection:text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
                {categoryEntries.map(([categoryName, items]) => (
                    <section key={categoryName} className="flex flex-col">
                        {/* Category Header */}
                        <div className="flex items-end justify-between pb-4 border-b border-[#e5e7eb] mb-6 sm:mb-8">
                            <div>
                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#9ca3af]">
                                    Collection
                                </span>
                                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#000000] mt-0.5">
                                    {categoryName}
                                </h2>
                            </div>

                            <Link
                                href={`/search?category=${encodeURIComponent(categoryName)}`}
                                className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#000000] hover:text-[#d95338] transition-colors"
                            >
                                <span>View All ({items.length})</span>
                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
                            {items.slice(0, 4).map((product) => {
                                const favoriteActive = isFavorite(product.id);

                                return (
                                    <div key={product.id} className="group flex flex-col">
                                        <div className="relative aspect-[3/4] w-full bg-[#f4f4f5] overflow-hidden mb-3">
                                            <Link
                                                href={`/shop/${product.id}`}
                                                className="block w-full h-full relative"
                                            >
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                                                />
                                            </Link>

                                            {product.badge && (
                                                <span className="absolute top-2.5 left-2.5 pointer-events-none bg-[#000000] text-white text-[9px] font-bold uppercase px-2 py-0.5 tracking-wider">
                                                    {product.badge}
                                                </span>
                                            )}

                                            {/* Wishlist Button */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleFavorite(product);
                                                }}
                                                aria-label={favoriteActive ? "Remove from wishlist" : "Add to wishlist"}
                                                className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center transition-colors shadow-sm ${favoriteActive ? "text-[#d95338]" : "text-[#111111] hover:text-[#d95338]"
                                                    }`}
                                            >
                                                <Heart className={`w-4 h-4 ${favoriteActive ? "fill-current" : ""}`} />
                                            </button>

                                            {/* Quick Add To Cart */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    addToCart(product);
                                                }}
                                                className="hidden sm:flex absolute inset-x-0 bottom-0 h-10 bg-[#000000] text-white text-xs font-semibold uppercase tracking-wider items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200 cursor-pointer hover:bg-[#222222]"
                                            >
                                                <ShoppingBag className="w-3.5 h-3.5" />
                                                <span>Quick Add</span>
                                            </button>
                                        </div>

                                        {/* Metadata & Title */}
                                        <div className="flex flex-col flex-1 justify-between gap-2">
                                            <div>
                                                <Link
                                                    href={`/shop/${product.id}`}
                                                    className="text-xs font-bold text-[#111111] uppercase tracking-wide hover:underline line-clamp-1 block"
                                                >
                                                    {product.name}
                                                </Link>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-black text-[#000000]">
                                                        ৳{product.price.toLocaleString()}
                                                    </span>
                                                    {product.originalPrice && (
                                                        <span className="text-xs text-[#9ca3af] line-through">
                                                            ৳{product.originalPrice.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Mobile Add-To-Bag Quick Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => addToCart(product)}
                                                    aria-label="Add to cart"
                                                    className="sm:hidden p-1.5 border border-[#e5e7eb] hover:border-[#000000] text-[#000000] transition-colors"
                                                >
                                                    <ShoppingBag className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}