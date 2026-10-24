"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, Heart } from "lucide-react";

const INITIAL_FAVORITES = [
  {
    id: 1,
    name: "Minimalist Tokyo Oversized Tee",
    category: "Oversized Tees",
    price: 1499,
    originalPrice: 1999,
    selectedSize: "L",
    inStock: true,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Pleated Wide-Leg Trousers",
    category: "Trousers",
    price: 2499,
    originalPrice: 2999,
    selectedSize: "32",
    inStock: true,
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Raw Denim Utility Cargo Pant",
    category: "Cargos",
    price: 2699,
    originalPrice: null,
    selectedSize: "32",
    inStock: false,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
  },
];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);

  const removeItem = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setFavorites([]);
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#111827] font-sans selection:bg-[#000000] selection:text-white">
      {/* Header Banner */}
      <div className="border-b border-[#e5e7eb] bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#000000]">
                Wishlist
              </h1>
              <p className="text-xs sm:text-sm text-[#444444] mt-1.5">
                Curated essentials saved for your personal rotation.
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#444444]">
              {favorites.length} {favorites.length === 1 ? "Item" : "Items"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {favorites.length === 0 ? (
          /* Empty State */
          <div className="py-20 text-center flex flex-col items-center justify-center border border-dashed border-[#e5e7eb] px-4">
            <div className="w-14 h-14 rounded-full bg-[#f4f4f5] flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-[#9ca3af]" />
            </div>
            <h2 className="text-base font-bold uppercase tracking-wider text-[#000000]">
              Your wishlist is empty
            </h2>
            <p className="text-xs text-[#444444] mt-1 max-w-sm">
              Keep track of limited drops, seasonal essentials, and new silhouettes by tapping the heart icon while browsing.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#000000] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#222222] transition-colors"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div>
            {/* Action Bar */}
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#e5e7eb]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#000000]">
                Saved Products
              </span>
              <button
                onClick={clearAll}
                className="text-xs font-bold uppercase tracking-wider text-[#d95338] underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                Clear Wishlist
              </button>
            </div>

            {/* Grid Catalog */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
              {favorites.map((product) => (
                <div key={product.id} className="group flex flex-col">
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] w-full bg-[#f4f4f5] overflow-hidden mb-3">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Stock Status Tag */}
                    {!product.inStock && (
                      <span className="absolute top-2.5 left-2.5 bg-[#000000]/80 backdrop-blur-sm text-white text-[9px] font-bold uppercase px-2 py-0.5 tracking-wider">
                        Out of Stock
                      </span>
                    )}

                    {/* Remove Action */}
                    <button
                      onClick={() => removeItem(product.id)}
                      aria-label="Remove item"
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-[#111111] hover:text-[#d95338] hover:bg-white transition-colors shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Move to Cart Quick-Action Button */}
                    {product.inStock && (
                      <button className="hidden sm:flex absolute inset-x-0 bottom-0 h-10 bg-[#000000] text-white text-xs font-semibold uppercase tracking-wider items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move To Bag</span>
                      </button>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col flex-1 justify-between gap-2">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase text-[#9ca3af] tracking-wider mb-1">
                        <span>{product.category}</span>
                        {product.selectedSize && (
                          <span className="border border-[#e5e7eb] px-1 py-0.2 text-[#444444]">
                            Size: {product.selectedSize}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/products/${product.id}`}
                        className="text-xs font-bold text-[#111111] uppercase tracking-wide hover:underline line-clamp-1"
                      >
                        {product.name}
                      </Link>
                    </div>

                    {/* Price & Mobile CTA */}
                    <div className="flex flex-col gap-2 pt-1">
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

                      {/* Mobile-Only Direct Action */}
                      <button
                        disabled={!product.inStock}
                        className={`sm:hidden w-full py-2 text-[11px] font-bold uppercase tracking-wider border flex items-center justify-center gap-1.5 transition-colors ${product.inStock
                            ? "bg-[#000000] text-white border-[#000000]"
                            : "bg-[#f4f4f5] text-[#9ca3af] border-[#e5e7eb] cursor-not-allowed"
                          }`}
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>{product.inStock ? "Move to Bag" : "Out of Stock"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}