"use client";

import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Heart,
    ShoppingBag,
    Trash2,
    Zap,
    ShieldCheck,
    Truck,
    RotateCcw,
    Minus,
    Plus,
    Ruler,
    Share2,
    Check,
    ChevronDown,
    X,
    ArrowLeft,
} from "lucide-react";
import { useStore } from "@/components/context/StoreContext";

const COLOR_HEX_MAP = {
    black: "#111111",
    white: "#FFFFFF",
    charcoal: "#27272A",
    grey: "#71717A",
    gray: "#71717A",
    beige: "#D4C5B9",
    olive: "#556B2F",
    navy: "#1E293B",
    sand: "#E2D9CC",
    cream: "#F5F5DC",
    brown: "#5C4033",
};

export default function ProductDetailsView({ product, products, categories }) {
    const router = useRouter();
    const { cart, addToCart, removeFromCart, toggleFavorite, isFavorite } = useStore();

    // Check if this product is already in the cart to populate initial values
    const existingInCart = useMemo(() => {
        if (!product || !Array.isArray(cart)) return null;
        return cart.find((item) => String(item.id) === String(product.id)) || null;
    }, [cart, product]);

    // Initial state setup (React initializes fresh on every product change because of key={matchedProduct.id})
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState(
        existingInCart?.size ||
        (Array.isArray(product?.sizes) && product?.sizes[0] ? product.sizes[0] : "")
    );
    const [selectedColor, setSelectedColor] = useState(
        existingInCart?.color ||
        (Array.isArray(product?.colors) && product?.colors[0]
            ? product.colors[0]
            : product?.color || "")
    );
    const [quantity, setQuantity] = useState(Number(existingInCart?.quantity) || 1);
    const [sizeError, setSizeError] = useState(false);

    const [openAccordion, setOpenAccordion] = useState("details");
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [sizeUnit, setSizeUnit] = useState("in");
    const [copiedLink, setCopiedLink] = useState(false);

    const galleryImages = useMemo(() => {
        if (!product) return [];
        const imgs = product.images && product.images.length > 0 ? product.images : [product.image];
        return imgs.filter(Boolean);
    }, [product]);

    const targetSize = selectedSize || product?.selectedSize || "Standard";

    // Detect if the specific variant configuration is in the cart
    const currentCartItem = useMemo(() => {
        if (!product || !Array.isArray(cart)) return null;
        return (
            cart.find(
                (item) =>
                    String(item.id) === String(product.id) &&
                    String(item.size).toLowerCase() === String(targetSize).toLowerCase() &&
                    (!selectedColor || String(item.color).toLowerCase() === String(selectedColor).toLowerCase())
            ) || null
        );
    }, [cart, product, targetSize, selectedColor]);

    const isInCart = Boolean(currentCartItem);
    const favoriteActive = isFavorite(product.id);

    const relatedProducts = useMemo(() => {
        return products
            .filter((p) => p.category === product.category && String(p.id) !== String(product.id))
            .slice(0, 4);
    }, [products, product]);

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        if (product?.colorImages && product.colorImages[color]) {
            const idx = galleryImages.findIndex((img) => img === product.colorImages[color]);
            if (idx !== -1) setSelectedImage(idx);
        }
    };

    const handleCartToggle = () => {
        if (Array.isArray(product.sizes) && product.sizes.length > 0 && !selectedSize) {
            setSizeError(true);
            return;
        }
        setSizeError(false);

        if (isInCart) {
            removeFromCart(product.id, targetSize, selectedColor);
        } else {
            addToCart(
                {
                    ...product,
                    selectedSize: targetSize,
                    color: selectedColor || product.color || "Standard",
                    quantity: Number(quantity),
                },
                targetSize,
                Number(quantity)
            );
        }
    };

    const handleDirectCheckout = () => {
        if (Array.isArray(product.sizes) && product.sizes.length > 0 && !selectedSize) {
            setSizeError(true);
            return;
        }
        setSizeError(false);

        if (!isInCart) {
            addToCart(
                {
                    ...product,
                    selectedSize: targetSize,
                    color: selectedColor || product.color || "Standard",
                    quantity: Number(quantity),
                },
                targetSize,
                Number(quantity)
            );
        }
        router.push("/checkout");
    };

    const handleShare = useCallback(async () => {
        if (typeof window === "undefined") return;
        const shareData = {
            title: product.name,
            text: `Check out ${product.name} on Vibbe.`,
            url: window.location.href,
        };
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if (err.name !== "AbortError") console.error(err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
            } catch (err) {
                console.error(err);
            }
        }
    }, [product]);

    const currentImageSrc = galleryImages[selectedImage] || product.image || "/placeholder.png";
    const colorsList = Array.isArray(product.colors) && product.colors.length > 0
        ? product.colors
        : product.color
            ? [product.color]
            : [];

    const activeCategoryHref = product.categoryHref;

    return (
        <div className="min-h-screen bg-[#ffffff] text-[#111827] font-sans selection:bg-[#000000] selection:text-white">
            {/* Category Pills Navigation Strip */}
            <div className="border-b border-[#e5e7eb] bg-[#fafafa]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#71717A] hover:text-[#000000] transition-colors shrink-0 pr-2 border-r border-[#e5e7eb]"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            <span>All</span>
                        </Link>

                        {categories.map((cat) => {
                            const isActive =
                                cat.href === product.categoryHref ||
                                cat.name.toLowerCase() === product.category?.toLowerCase();

                            return (
                                <Link
                                    key={cat.id}
                                    href={cat.href}
                                    className={`px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors shrink-0 ${isActive
                                        ? "bg-[#000000] text-white"
                                        : "bg-[#ffffff] text-[#71717A] border border-[#e5e7eb] hover:border-[#000000] hover:text-[#000000]"
                                        }`}
                                >
                                    {cat.name}
                                </Link>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={handleShare}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#555555] hover:text-[#000000] transition-colors shrink-0 pl-2 cursor-pointer"
                    >
                        {copiedLink ? (
                            <>
                                <Check className="w-3.5 h-3.5 text-[#15803d]" />
                                <span className="text-[#15803d]">Copied</span>
                            </>
                        ) : (
                            <>
                                <Share2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Share</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
                    {/* Gallery */}
                    <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
                        {galleryImages.length > 1 && (
                            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0">
                                {galleryImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative w-16 sm:w-20 aspect-3/4 bg-[#f4f4f5] border transition-all cursor-pointer ${selectedImage === idx
                                            ? "border-[#000000] ring-1 ring-[#000000]"
                                            : "border-[#e5e7eb] opacity-70 hover:opacity-100"
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} thumb ${idx + 1}`}
                                            fill
                                            sizes="80px"
                                            className="object-cover object-center"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="relative aspect-3/4 w-full bg-[#f4f4f5] overflow-hidden">
                            <Image
                                src={currentImageSrc}
                                alt={product.name}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 55vw"
                                className="object-cover object-center"
                            />

                            {product.badge && (
                                <span className="absolute top-4 left-4 bg-[#000000] text-white text-[10px] font-bold uppercase px-2.5 py-1 tracking-wider pointer-events-none">
                                    {product.badge}
                                </span>
                            )}

                            <button
                                type="button"
                                onClick={() => toggleFavorite(product)}
                                aria-label={favoriteActive ? "Remove from wishlist" : "Add to wishlist"}
                                className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center transition-colors shadow-sm cursor-pointer ${favoriteActive ? "text-[#d95338]" : "text-[#111111] hover:text-[#d95338]"
                                    }`}
                            >
                                <Heart className={`w-5 h-5 ${favoriteActive ? "fill-current" : ""}`} />
                            </button>
                        </div>
                    </div>

                    {/* Right Options Column */}
                    <div className="lg:col-span-5 flex flex-col">
                        <Link
                            href={activeCategoryHref}
                            className="text-xs font-bold uppercase tracking-widest text-[#9ca3af] hover:text-[#000000] transition-colors inline-block"
                        >
                            {product.category}
                        </Link>

                        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#000000] mt-1">
                            {product.name}
                        </h1>

                        <div className="flex items-baseline gap-3 mt-4 pb-6 border-b border-[#e5e7eb]">
                            <span className="text-2xl font-black text-[#000000]">
                                ৳{product.price?.toLocaleString()}
                            </span>
                            {product.originalPrice && (
                                <span className="text-sm text-[#9ca3af] line-through">
                                    ৳{product.originalPrice.toLocaleString()}
                                </span>
                            )}
                            {product.originalPrice && (
                                <span className="text-xs font-bold text-[#d95338] uppercase tracking-wider">
                                    Save ৳{(product.originalPrice - product.price).toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* In-cart Status indicator */}
                        {isInCart && (
                            <div className="flex items-center justify-between px-3 py-2 mt-4 bg-[#f0fdf4] border border-[#bbf7d0] text-[11px] font-bold uppercase tracking-wider text-[#15803d]">
                                <span className="flex items-center gap-1.5">
                                    <Check className="w-3.5 h-3.5" /> In Your Bag
                                </span>
                                <span className="text-[10px] text-[#166534]">
                                    Qty: {currentCartItem.quantity}
                                </span>
                            </div>
                        )}

                        <p className="text-xs sm:text-sm text-[#555555] leading-relaxed mt-6">
                            {product.description ||
                                "Tailored minimalist drop silhouette crafted with heavyweight combed cotton. Engineered for structured drape, tactile longevity, and clean streetwear styling."}
                        </p>

                        {/* Color Swatches */}
                        {colorsList.length > 0 && (
                            <div className="mt-6">
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2.5">
                                    <span className="text-[#000000]">Color</span>
                                    <span className="text-[#666666]">{selectedColor || "Select"}</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    {colorsList.map((c) => {
                                        const normalized = c.toLowerCase().trim();
                                        const hexColor = COLOR_HEX_MAP[normalized] || "#E5E7EB";
                                        const isSelected = selectedColor?.toLowerCase() === normalized;

                                        return (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => handleColorSelect(c)}
                                                className={`group relative flex items-center justify-center w-8 h-8 rounded-full border transition-all cursor-pointer ${isSelected
                                                    ? "ring-2 ring-[#000000] ring-offset-2 border-transparent"
                                                    : "border-[#e5e7eb] hover:scale-105"
                                                    }`}
                                            >
                                                <span
                                                    className="w-full h-full rounded-full border border-black/10"
                                                    style={{ backgroundColor: hexColor }}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Size Selector */}
                        {Array.isArray(product.sizes) && product.sizes.length > 0 && (
                            <div className="mt-6">
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2.5">
                                    <span className="text-[#000000]">Size</span>
                                    <button
                                        type="button"
                                        onClick={() => setShowSizeModal(true)}
                                        className="inline-flex items-center gap-1 text-[#555555] hover:text-[#000000] underline underline-offset-2 transition-colors cursor-pointer"
                                    >
                                        <Ruler className="w-3.5 h-3.5" />
                                        <span>Size Guide</span>
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => {
                                                setSelectedSize(s);
                                                setSizeError(false);
                                            }}
                                            className={`h-10 min-w-10 px-3.5 text-xs font-bold uppercase border transition-colors cursor-pointer ${selectedSize === s
                                                ? "bg-[#000000] text-white border-[#000000]"
                                                : "bg-white text-[#111111] border-[#e5e7eb] hover:border-[#000000]"
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                                {sizeError && (
                                    <p className="text-xs text-[#d95338] font-semibold mt-2">
                                        Please select a size to proceed.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Quantity Controller */}
                        <div className="mt-6">
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2.5">
                                Quantity
                            </label>
                            <div className="flex items-center border border-[#e5e7eb] w-32 h-11">
                                <button
                                    type="button"
                                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                    className="w-10 h-full flex items-center justify-center text-[#111111] hover:bg-[#fafafa] transition-colors disabled:opacity-40 cursor-pointer"
                                    disabled={quantity <= 1 || product.inStock === false}
                                >
                                    <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="flex-1 text-center text-xs font-bold text-[#000000]">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity((prev) => prev + 1)}
                                    className="w-10 h-full flex items-center justify-center text-[#111111] hover:bg-[#fafafa] transition-colors cursor-pointer"
                                    disabled={product.inStock === false}
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={handleCartToggle}
                                disabled={product.inStock === false}
                                className={`w-full h-12 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors border ${product.inStock === false
                                    ? "bg-[#f4f4f5] text-[#9ca3af] border-[#e5e7eb] cursor-not-allowed"
                                    : isInCart
                                        ? "bg-[#ffffff] text-[#d95338] border-[#d95338] hover:bg-[#fff5f5] cursor-pointer"
                                        : "bg-[#000000] text-white border-[#000000] hover:bg-[#222222] cursor-pointer"
                                    }`}
                            >
                                {product.inStock === false ? (
                                    <span>Out of Stock</span>
                                ) : isInCart ? (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        <span>Remove From Bag</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag className="w-4 h-4" />
                                        <span>Add To Bag</span>
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleDirectCheckout}
                                disabled={product.inStock === false}
                                className={`w-full h-12 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-sm ${product.inStock === false
                                    ? "hidden"
                                    : "bg-[#111111] text-white hover:bg-[#000000] cursor-pointer"
                                    }`}
                            >
                                <Zap className="w-4 h-4 fill-current text-[#facc15]" />
                                <span>Direct Checkout</span>
                            </button>
                        </div>

                        {/* Accordions */}
                        <div className="mt-8 border-t border-[#e5e7eb] divide-y divide-[#e5e7eb] text-xs">
                            <div className="py-3.5">
                                <button
                                    type="button"
                                    onClick={() => setOpenAccordion((prev) => (prev === "details" ? null : "details"))}
                                    className="w-full flex items-center justify-between font-bold uppercase tracking-wider text-[#000000] cursor-pointer"
                                >
                                    <span>Fabric & Silhouette Specifications</span>
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform duration-200 ${openAccordion === "details" ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>
                                {openAccordion === "details" && (
                                    <div className="pt-3 text-[#555555] space-y-1.5 leading-relaxed">
                                        <p>260+ GSM Heavyweight Combed Cotton / French Terry</p>
                                        <p>Drop-shoulder structure with reinforced neckline binding</p>
                                        <p>Pre-shrunk finish for reliable form retention through washes</p>
                                    </div>
                                )}
                            </div>

                            <div className="py-3.5">
                                <button
                                    type="button"
                                    onClick={() => setOpenAccordion((prev) => (prev === "shipping" ? null : "shipping"))}
                                    className="w-full flex items-center justify-between font-bold uppercase tracking-wider text-[#000000] cursor-pointer"
                                >
                                    <span>Shipping & Local Delivery</span>
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform duration-200 ${openAccordion === "shipping" ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>
                                {openAccordion === "shipping" && (
                                    <div className="pt-3 text-[#555555] space-y-1.5 leading-relaxed">
                                        <p>Inside Dhaka: ৳70 (48-72 hours via Pathao / Steadfast)</p>
                                        <p>Outside Dhaka: ৳130 (3-5 business days)</p>
                                        <p>Free shipping applied automatically on all orders over ৳1,500</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Trust Markers */}
                        <div className="grid grid-cols-1 gap-3 pt-6 border-t border-[#e5e7eb] text-xs text-[#555555]">
                            <div className="flex items-center gap-2.5">
                                <Truck className="w-4 h-4 text-[#000000] shrink-0" />
                                <span>Pan-Bangladesh delivery (Dhaka 48h, Nationwide 3-5 days)</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <RotateCcw className="w-4 h-4 text-[#000000] shrink-0" />
                                <span>7-Day Doorstep Replacement Guarantee</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <ShieldCheck className="w-4 h-4 text-[#000000] shrink-0" />
                                <span>100% Verified Authentic Minimalist Silhouette</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-20 pt-12 border-t border-[#e5e7eb]">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">
                                    Curated Pairs
                                </span>
                                <h2 className="text-xl font-black uppercase tracking-tight text-[#000000] mt-0.5">
                                    Complete The Fit
                                </h2>
                            </div>
                            <Link
                                href={activeCategoryHref}
                                className="text-xs font-bold uppercase tracking-wider text-[#000000] hover:text-[#d95338] transition-colors"
                            >
                                Explore Category ({product.category})
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                            {relatedProducts.map((rel) => {
                                const relFav = isFavorite(rel.id);
                                return (
                                    <div key={rel.id} className="group flex flex-col">
                                        <div className="relative aspect-3/4 w-full bg-[#f4f4f5] overflow-hidden mb-2.5">
                                            <Link href={`/shop/${rel.id}`} className="block w-full h-full relative">
                                                <Image
                                                    src={rel.image}
                                                    alt={rel.name}
                                                    fill
                                                    sizes="(max-width: 640px) 50vw, 25vw"
                                                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                                                />
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleFavorite(rel);
                                                }}
                                                aria-label={relFav ? "Remove from wishlist" : "Add to wishlist"}
                                                className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center transition-colors shadow-sm cursor-pointer ${relFav ? "text-[#d95338]" : "text-[#111111] hover:text-[#d95338]"
                                                    }`}
                                            >
                                                <Heart className={`w-3.5 h-3.5 ${relFav ? "fill-current" : ""}`} />
                                            </button>
                                        </div>

                                        <span className="text-[10px] font-bold uppercase text-[#9ca3af]">
                                            {rel.category}
                                        </span>
                                        <Link
                                            href={`/shop/${rel.id}`}
                                            className="text-xs font-bold text-[#111111] uppercase tracking-wide group-hover:underline truncate mt-0.5"
                                        >
                                            {rel.name}
                                        </Link>
                                        <span className="text-xs font-black text-[#000000] mt-1">
                                            ৳{rel.price?.toLocaleString()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>

            {/* Size Guide Modal */}
            {showSizeModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
                    onClick={() => setShowSizeModal(false)}
                >
                    <div
                        className="w-full max-w-lg bg-white border border-[#e5e7eb] p-6 shadow-2xl relative select-none"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb]">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-wider text-[#000000]">
                                    Size Guide & Measurements
                                </h3>
                                <p className="text-[11px] text-[#555555] mt-0.5">
                                    Standard Asian / Street Minimalist Regular-to-Drop Fit
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowSizeModal(false)}
                                className="text-[#9ca3af] hover:text-[#000000] transition-colors p-1 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center justify-end gap-1 my-3 text-xs">
                            <button
                                type="button"
                                onClick={() => setSizeUnit("in")}
                                className={`px-2 py-0.5 text-[10px] font-bold uppercase border cursor-pointer ${sizeUnit === "in"
                                    ? "bg-[#000000] text-white border-[#000000]"
                                    : "bg-white text-[#444444] border-[#e5e7eb]"
                                    }`}
                            >
                                Inches
                            </button>
                            <button
                                type="button"
                                onClick={() => setSizeUnit("cm")}
                                className={`px-2 py-0.5 text-[10px] font-bold uppercase border cursor-pointer ${sizeUnit === "cm"
                                    ? "bg-[#000000] text-white border-[#000000]"
                                    : "bg-white text-[#444444] border-[#e5e7eb]"
                                    }`}
                            >
                                CM
                            </button>
                        </div>

                        <table className="w-full text-left text-xs border border-[#e5e7eb]">
                            <thead>
                                <tr className="bg-[#fafafa] border-b border-[#e5e7eb] text-[10px] uppercase tracking-wider text-[#000000]">
                                    <th className="p-2.5 font-bold">Size</th>
                                    <th className="p-2.5 font-bold">Chest ({sizeUnit})</th>
                                    <th className="p-2.5 font-bold">Length ({sizeUnit})</th>
                                    <th className="p-2.5 font-bold">Shoulder ({sizeUnit})</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e5e7eb] text-[#444444]">
                                {[
                                    { size: "S", chest: sizeUnit === "in" ? "40" : "101", len: sizeUnit === "in" ? "27" : "68", sh: sizeUnit === "in" ? "20" : "51" },
                                    { size: "M", chest: sizeUnit === "in" ? "42" : "106", len: sizeUnit === "in" ? "28" : "71", sh: sizeUnit === "in" ? "21" : "53" },
                                    { size: "L", chest: sizeUnit === "in" ? "44" : "112", len: sizeUnit === "in" ? "29" : "74", sh: sizeUnit === "in" ? "22" : "56" },
                                    { size: "XL", chest: sizeUnit === "in" ? "46" : "117", len: sizeUnit === "in" ? "30" : "76", sh: sizeUnit === "in" ? "23" : "58" },
                                    { size: "XXL", chest: sizeUnit === "in" ? "48" : "122", len: sizeUnit === "in" ? "31" : "79", sh: sizeUnit === "in" ? "24" : "61" },
                                ].map((row) => (
                                    <tr key={row.size} className="hover:bg-[#fafafa]">
                                        <td className="p-2.5 font-bold text-[#000000]">{row.size}</td>
                                        <td className="p-2.5">{row.chest}</td>
                                        <td className="p-2.5">{row.len}</td>
                                        <td className="p-2.5">{row.sh}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}