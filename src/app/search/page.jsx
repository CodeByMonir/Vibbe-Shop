"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, SlidersHorizontal, ArrowUpDown, ShoppingBag, Heart } from "lucide-react";

// Mock Product Dataset (using Bangladesh Taka currency standard ৳)
const ALL_PRODUCTS = [
  {
    id: 1,
    name: "Minimalist Tokyo Oversized Tee",
    category: "Oversized Tees",
    price: 1499,
    originalPrice: 1999,
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    isNew: true,
  },
  {
    id: 2,
    name: "Cuban Collar Linen Resort Shirt",
    category: "Shirts",
    price: 1899,
    originalPrice: null,
    sizes: ["M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
    isNew: false,
  },
  {
    id: 3,
    name: "Pleated Wide-Leg Trousers",
    category: "Trousers",
    price: 2499,
    originalPrice: 2999,
    sizes: ["30", "32", "34", "36"],
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
    isNew: false,
  },
  {
    id: 4,
    name: "Raw Denim Utility Cargo Pant",
    category: "Cargos",
    price: 2699,
    originalPrice: null,
    sizes: ["30", "32", "34"],
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    isNew: true,
  },
  {
    id: 5,
    name: "Distressed Monochrome Trucker Jacket",
    category: "Outerwear",
    price: 3899,
    originalPrice: 4499,
    sizes: ["M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    isNew: false,
  },
  {
    id: 6,
    name: "Heavyweight Boxy Graphic Tee",
    category: "Oversized Tees",
    price: 1699,
    originalPrice: 2199,
    sizes: ["S", "M", "L", "XL", "2XL"],
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    isNew: true,
  },
];

const CATEGORIES = ["All", "Oversized Tees", "Shirts", "Cargos", "Trousers", "Outerwear"];
const SIZES = ["All", "S", "M", "L", "XL", "30", "32", "34"];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [sortBy, setSortBy] = useState("featured"); // featured, price-low, price-high
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Filter and Sort Engine
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const matchesSize =
        selectedSize === "All" || product.sizes.includes(selectedSize);

      return matchesSearch && matchesCategory && matchesSize;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0; // "featured" maintains default
    });
  }, [searchTerm, selectedCategory, selectedSize, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedSize("All");
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#111827] font-sans selection:bg-[#000000] selection:text-white">
      {/* Search Header Banner */}
      <div className="border-b border-[#e5e7eb] bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#000000] mb-6">
            Search The Collection
          </h1>

          {/* Primary Search Input Field */}
          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product, style, category, or fit..."
              className="w-full h-14 pl-12 pr-12 text-sm sm:text-base bg-[#ffffff] border border-[#e5e7eb] text-[#000000] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#000000] transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444444] hover:text-[#000000]"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Unified Filter & Controls Bar */}
        <div className="py-4 border-b border-[#e5e7eb]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Mobile Trigger, Count & Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              {/* Mobile Filters Toggle Button */}
              <button
                onClick={() => setShowFiltersMobile((prev) => !prev)}
                className="lg:hidden inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-[#ffffff] border border-[#e5e7eb] hover:border-[#000000] text-[#000000] transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>

              {/* Results Count */}
              <p className="text-xs text-[#444444] whitespace-nowrap">
                Showing <span className="font-bold text-[#000000]">{filteredProducts.length}</span> results
              </p>

              {/* Collapsible Dropdowns Container on Mobile / Inline on Desktop */}
              <div
                className={`${showFiltersMobile ? "flex" : "hidden"
                  } lg:flex flex-wrap items-center gap-4 sm:gap-6 w-full lg:w-auto pt-3 lg:pt-0 mt-1 lg:mt-0 border-t lg:border-t-0 border-[#e5e7eb]`}
              >
                {/* Category Dropdown */}
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="category-select"
                    className="text-xs font-bold uppercase tracking-widest text-[#000000] shrink-0"
                  >
                    Category:
                  </label>
                  <div className="relative">
                    <select
                      id="category-select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="h-9 pl-3 pr-8 text-xs font-semibold uppercase bg-[#ffffff] text-[#111111] border border-[#e5e7eb] hover:border-[#000000] focus:border-[#000000] focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#444444]">
                      <svg
                        className="w-3.5 h-3.5 fill-none stroke-current"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Size Dropdown */}
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="size-select"
                    className="text-xs font-bold uppercase tracking-widest text-[#000000] shrink-0"
                  >
                    Size:
                  </label>
                  <div className="relative">
                    <select
                      id="size-select"
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="h-9 pl-3 pr-8 text-xs font-semibold uppercase bg-[#ffffff] text-[#111111] border border-[#e5e7eb] hover:border-[#000000] focus:border-[#000000] focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      {SIZES.map((size) => (
                        <option key={size} value={size}>
                          {size === "All" ? "All Sizes" : size}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#444444]">
                      <svg
                        className="w-3.5 h-3.5 fill-none stroke-current"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Clear Active Filters */}
                {(selectedCategory !== "All" || selectedSize !== "All" || searchTerm) && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs font-bold uppercase tracking-wider text-[#d95338] underline underline-offset-4 hover:opacity-80 transition-opacity"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>

            {/* Right: Sort By Dropdown */}
            <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#444444]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#444444]">Sort:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-9 pl-2 pr-7 text-xs font-semibold uppercase bg-transparent text-[#000000] border border-transparent hover:border-[#e5e7eb] focus:border-[#000000] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="featured">Featured Drops</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <div className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[#444444]">
                  <svg
                    className="w-3.5 h-3.5 fill-none stroke-current"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <main className="pt-6 sm:pt-8">
          {filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="py-16 sm:py-24 text-center flex flex-col items-center justify-center border border-dashed border-[#e5e7eb] px-4">
              <Search className="w-10 h-10 text-[#9ca3af] mb-4" />
              <h3 className="text-base font-bold uppercase tracking-wide text-[#000000]">
                No products found
              </h3>
              <p className="text-xs text-[#444444] mt-1 max-w-sm">
                We couldn't find matches for your search. Try resetting your filters or check for spelling errors.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-6 px-6 py-2.5 bg-[#000000] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#222222] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Catalog Grid - 4 Column Layout */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group flex flex-col">
                  {/* Image Block */}
                  <div className="relative aspect-[3/4] w-full bg-[#f4f4f5] overflow-hidden mb-3">
                    <Image
                      src={product.image}
                      alt={product.name}
                      loading="eager"
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Tag Badge */}
                    {product.isNew && (
                      <span className="absolute top-2.5 left-2.5 bg-[#000000] text-white text-[9px] font-bold uppercase px-2 py-0.5 tracking-wider">
                        New Drop
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      aria-label="Add to Wishlist"
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#111111] hover:text-[#d95338] transition-colors shadow-sm"
                    >
                      <Heart className="w-4 h-4" />
                    </button>

                    {/* Quick Add Overlay */}
                    <button className="hidden sm:flex absolute inset-x-0 bottom-0 h-10 bg-[#000000] text-white text-xs font-semibold uppercase tracking-wider items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Quick Add</span>
                    </button>
                  </div>

                  {/* Details Block */}
                  <div className="flex flex-col flex-1 justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#9ca3af] tracking-wider block mb-1">
                        {product.category}
                      </span>
                      <Link
                        href={`/products/${product.id}`}
                        className="text-xs font-bold text-[#111111] uppercase tracking-wide hover:underline line-clamp-1"
                      >
                        {product.name}
                      </Link>
                    </div>

                    {/* Price Matrix */}
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}