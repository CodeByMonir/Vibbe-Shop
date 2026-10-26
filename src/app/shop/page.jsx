"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  ShoppingBag,
  Heart,
  Check,
  RotateCw,
} from "lucide-react";
import { useStore } from "@/components/context/StoreContext";
import { useFetch } from "@/components/hooks/useFetch";
import LoadingSpinner from "@/components/loading/loading";

function SearchContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const { addToCart, toggleFavorite, isFavorite } = useStore();

  const {
    data: rawProducts,
    loading,
    error,
    retryCount,
    refetch,
  } = useFetch("/data/products.json", { maxRetries: 3, retryDelay: 1000 });

  const products = useMemo(() => {
    return Array.isArray(rawProducts) ? rawProducts : [];
  }, [rawProducts]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [addedItemNotice, setAddedItemNotice] = useState(null);

  // Sync category from URL parameter whenever URL changes
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory("All");
    }
  }, [categoryFromUrl]);

  const handleQuickAdd = (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addToCart(product);
    setAddedItemNotice(product.id);
    setTimeout(() => {
      setAddedItemNotice((current) => (current === product.id ? null : current));
    }, 1400);
  };

  const handleToggleWishlist = (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    toggleFavorite(product);
  };

  // Derive categories and sizes dynamically
  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return ["All", ...list];
  }, [products]);

  const sizes = useMemo(() => {
    const allSizes = products.flatMap((p) => (Array.isArray(p.sizes) ? p.sizes : []));
    return ["All", ...Array.from(new Set(allSizes))];
  }, [products]);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const name = product?.name || "";
        const category = product?.category || "";
        const query = searchTerm.toLowerCase();

        const matchesSearch =
          name.toLowerCase().includes(query) || category.toLowerCase().includes(query);

        // Case-insensitive category match
        const matchesCategory =
          selectedCategory === "All" ||
          category.toLowerCase() === selectedCategory.toLowerCase();

        const matchesSize =
          selectedSize === "All" ||
          (Array.isArray(product?.sizes) && product.sizes.includes(selectedSize));

        return matchesSearch && matchesCategory && matchesSize;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return 0;
      });
  }, [products, searchTerm, selectedCategory, selectedSize, sortBy]);

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
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              <button
                onClick={() => setShowFiltersMobile((prev) => !prev)}
                className="lg:hidden inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-[#ffffff] border border-[#e5e7eb] hover:border-[#000000] text-[#000000] transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <p className="text-xs text-[#444444] whitespace-nowrap">
                Showing <span className="font-bold text-[#000000]">{filteredProducts.length}</span> results
              </p>

              <div
                className={`${showFiltersMobile ? "flex" : "hidden"
                  } lg:flex flex-wrap items-center gap-4 sm:gap-6 w-full lg:w-auto pt-3 lg:pt-0 mt-1 lg:mt-0 border-t lg:border-t-0 border-[#e5e7eb]`}
              >
                {/* Category Dropdown */}
                <div className="flex items-center gap-2">
                  <label htmlFor="category-select" className="text-xs font-bold uppercase tracking-widest text-[#000000] shrink-0">
                    Category:
                  </label>
                  <div className="relative">
                    <select
                      id="category-select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="h-9 pl-3 pr-8 text-xs font-semibold uppercase bg-[#ffffff] text-[#111111] border border-[#e5e7eb] hover:border-[#000000] focus:border-[#000000] focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#444444]">
                      <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Size Dropdown */}
                <div className="flex items-center gap-2">
                  <label htmlFor="size-select" className="text-xs font-bold uppercase tracking-widest text-[#000000] shrink-0">
                    Size:
                  </label>
                  <div className="relative">
                    <select
                      id="size-select"
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="h-9 pl-3 pr-8 text-xs font-semibold uppercase bg-[#ffffff] text-[#111111] border border-[#e5e7eb] hover:border-[#000000] focus:border-[#000000] focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size === "All" ? "All Sizes" : size}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#444444]">
                      <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
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

            {/* Sort Dropdown */}
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
                  <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <main className="pt-6 sm:pt-8">
          {loading ? (
            <LoadingSpinner text="Loading collection..." className="py-24" />
          ) : error ? (
            <div className="py-16 sm:py-24 text-center flex flex-col items-center justify-center border border-dashed border-[#e5e7eb] px-4">
              <h3 className="text-base font-bold uppercase tracking-wide text-[#d95338]">
                Failed to load products
              </h3>
              <p className="text-xs text-[#444444] mt-1 max-w-sm">
                We couldn't connect to the catalog after 3 attempts. Please check your connection.
              </p>
              <button
                onClick={refetch}
                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-[#000000] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#222222] transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
              {filteredProducts.map((product) => {
                const favoriteActive = isFavorite(product.id);
                const isJustAdded = addedItemNotice === product.id;

                return (
                  <div key={product.id} className="group flex flex-col">
                    {/* Clickable Image Container */}
                    <div className="relative aspect-[3/4] w-full bg-[#f4f4f5] overflow-hidden mb-3">
                      <Link
                        href={`/shop/${product.id}`}
                        className="block w-full h-full relative"
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          loading="eager"
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      </Link>

                      {product.badge && (
                        <span className="pointer-events-none absolute top-2.5 left-2.5 bg-[#000000] text-white text-[9px] font-bold uppercase px-2 py-0.5 tracking-wider">
                          {product.badge}
                        </span>
                      )}

                      {/* Wishlist Button (Stop propagation to prevent link click) */}
                      <button
                        onClick={(e) => handleToggleWishlist(product, e)}
                        aria-label={favoriteActive ? "Remove from wishlist" : "Add to wishlist"}
                        className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center transition-colors shadow-sm ${favoriteActive
                            ? "text-[#d95338]"
                            : "text-[#111111] hover:text-[#d95338]"
                          }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${favoriteActive ? "fill-current" : ""}`}
                        />
                      </button>

                      {/* Quick Add To Cart Button */}
                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className="hidden sm:flex absolute inset-x-0 bottom-0 h-10 bg-[#000000] text-white text-xs font-semibold uppercase tracking-wider items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200 cursor-pointer"
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#15803d]" />
                            <span className="text-[#15803d]">Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Quick Add</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-col flex-1 justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#9ca3af] tracking-wider block mb-1">
                          {product.category}
                        </span>
                        <Link
                          href={`/shop/${product.id}`}
                          className="text-xs font-bold text-[#111111] uppercase tracking-wide hover:underline line-clamp-1"
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

                        {/* Mobile Add to Cart Button */}
                        <button
                          onClick={(e) => handleQuickAdd(product, e)}
                          className="sm:hidden p-1.5 border border-[#e5e7eb] hover:border-[#000000] text-[#000000] transition-colors"
                          aria-label="Add to cart"
                        >
                          {isJustAdded ? (
                            <Check className="w-3.5 h-3.5 text-[#15803d]" />
                          ) : (
                            <ShoppingBag className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen text="Loading Search..." />}>
      <SearchContent />
    </Suspense>
  );
}