"use client";

import { useStore } from "@/components/context/StoreContext";
import {
  ArrowRight,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const FREE_SHIPPING_THRESHOLD = 1500; // Free shipping threshold in BDT (৳)

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useStore();
  const [mounted, setMounted] = useState(false);

  const [deliveryArea, setDeliveryArea] = useState("dhaka"); // 'dhaka' (৳70) or 'outside' (৳130)
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in percent
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Prevent SSR hydration mismatch when reading localStorage state
  useEffect(() => {
    setMounted(true);
  }, []);

  const displayedCart = mounted ? cart : [];

  // Subtotal Calculation
  const subtotal = useMemo(() => {
    return displayedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [displayedCart]);

  // Discount Calculation
  const discountAmount = useMemo(() => {
    return Math.round((subtotal * appliedDiscount) / 100);
  }, [subtotal, appliedDiscount]);

  // Shipping Calculation
  const shippingCost = useMemo(() => {
    if (displayedCart.length === 0) return 0;
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
    return deliveryArea === "dhaka" ? 70 : 130;
  }, [subtotal, deliveryArea, displayedCart.length]);

  // Total
  const total = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + shippingCost);
  }, [subtotal, discountAmount, shippingCost]);

  // Free shipping progress meter
  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // Promo Code Handler
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    if (couponCode.trim().toUpperCase() === "VIBBE10") {
      setAppliedDiscount(10);
      setCouponSuccess("10% promotional discount applied!");
    } else {
      setCouponError("Invalid coupon code. Try 'VIBBE10'");
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#111827] font-sans selection:bg-[#000000] selection:text-white">
      {/* Header Banner */}
      <div className="border-b border-[#e5e7eb] bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#000000]">
                Shopping Bag
              </h1>
              <p className="text-xs sm:text-sm text-[#444444] mt-1.5">
                Review your items and proceed to secure checkout.
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#444444]">
              {displayedCart.reduce((acc, item) => acc + item.quantity, 0)} Items
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {displayedCart.length === 0 ? (
          /* Empty Bag State */
          <div className="py-20 text-center flex flex-col items-center justify-center border border-dashed border-[#e5e7eb] px-4">
            <div className="w-14 h-14 rounded-full bg-[#f4f4f5] flex items-center justify-center mb-4">
              <ShoppingBag className="w-6 h-6 text-[#9ca3af]" />
            </div>
            <h2 className="text-base font-bold uppercase tracking-wider text-[#000000]">
              Your bag is currently empty
            </h2>
            <p className="text-xs text-[#444444] mt-1 max-w-sm">
              Discover modern street tailoring, heavyweight tees, and utilitarian outerwear crafted for everyday wear.
            </p>
            <Link
              href="/search"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#000000] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#222222] transition-colors"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 flex flex-col gap-6">

              {/* Free Shipping Tracker */}
              <div className="p-4 bg-[#fafafa] border border-[#e5e7eb]">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-[#000000] uppercase tracking-wider">
                    {subtotal >= FREE_SHIPPING_THRESHOLD
                      ? "✓ You have unlocked free delivery nationwide"
                      : `Add ৳${remainingForFreeShipping.toLocaleString()} more to unlock free shipping`}
                  </span>
                  <span className="font-semibold text-[#444444]">{progressToFreeShipping}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#e5e7eb] overflow-hidden">
                  <div
                    className="h-full bg-[#000000] transition-all duration-300"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="border-t border-[#e5e7eb] divide-y divide-[#e5e7eb]">
                {displayedCart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="py-6 flex gap-4 sm:gap-6">
                    {/* Item Image */}
                    <div className="relative aspect-3/4 w-24 sm:w-28 bg-[#f4f4f5] shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="112px"
                        className="object-cover object-center"
                      />
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#9ca3af] tracking-wider block">
                              {item.category}
                            </span>
                            <Link
                              href={`/products/${item.id}`}
                              className="text-xs sm:text-sm font-bold uppercase text-[#000000] tracking-wide hover:underline line-clamp-1 mt-0.5"
                            >
                              {item.name}
                            </Link>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id, item.size)}
                            aria-label="Remove item"
                            className="text-[#9ca3af] hover:text-[#d95338] transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Variants */}
                        <div className="flex items-center gap-3 mt-2 text-xs text-[#444444]">
                          <span className="border border-[#e5e7eb] px-2 py-0.5 font-semibold text-[#111111]">
                            Size: {item.size}
                          </span>
                          <span>{item.color}</span>
                        </div>
                      </div>

                      {/* Quantity Controller & Total Item Price */}
                      <div className="flex items-center justify-between mt-4 pt-2">
                        <div className="flex items-center border border-[#e5e7eb] h-8">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.size, -1)}
                            aria-label="Decrease quantity"
                            className="w-8 h-full flex items-center justify-center text-[#111111] hover:bg-[#fafafa] transition-colors disabled:opacity-40"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-9 text-center text-xs font-bold text-[#000000]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.size, 1)}
                            aria-label="Increase quantity"
                            className="w-8 h-full flex items-center justify-center text-[#111111] hover:bg-[#fafafa] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-black text-[#000000]">
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </span>
                          {item.quantity > 1 && (
                            <span className="block text-[10px] text-[#9ca3af]">
                              ৳{item.price.toLocaleString()} each
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear Bag Option */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={clearCart}
                  className="text-xs font-bold uppercase tracking-wider text-[#d95338] underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                  Clear Bag
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#e5e7eb]">
                <div className="flex items-center gap-2.5 text-xs text-[#444444]">
                  <Truck className="w-4 h-4 text-[#000000] shrink-0" />
                  <span>Pan-Bangladesh Fast Shipping</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#444444]">
                  <RotateCcw className="w-4 h-4 text-[#000000] shrink-0" />
                  <span>7-Day Easy Doorstep Exchange</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#444444]">
                  <ShieldCheck className="w-4 h-4 text-[#000000] shrink-0" />
                  <span>100% Genuine Certified Fabrics</span>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="border border-[#e5e7eb] p-6 bg-[#fafafa]">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#000000] pb-4 border-b border-[#e5e7eb]">
                  Order Summary
                </h3>

                <div className="space-y-3 py-4 text-xs border-b border-[#e5e7eb]">
                  <div className="flex justify-between text-[#444444]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#000000]">
                      ৳{subtotal.toLocaleString()}
                    </span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-[#15803d]">
                      <span>Discount ({appliedDiscount}%)</span>
                      <span className="font-semibold">-৳{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Destination Selector */}
                  <div className="pt-2">
                    <label className="text-[11px] font-bold uppercase text-[#000000] tracking-wider block mb-1.5">
                      Shipping Destination
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setDeliveryArea("dhaka")}
                        className={`py-2 px-2.5 text-center border font-semibold uppercase tracking-wider transition-colors ${deliveryArea === "dhaka"
                            ? "bg-[#000000] text-white border-[#000000]"
                            : "bg-[#ffffff] text-[#444444] border-[#e5e7eb] hover:border-[#000000]"
                          }`}
                      >
                        Inside Dhaka
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryArea("outside")}
                        className={`py-2 px-2.5 text-center border font-semibold uppercase tracking-wider transition-colors ${deliveryArea === "outside"
                            ? "bg-[#000000] text-white border-[#000000]"
                            : "bg-[#ffffff] text-[#444444] border-[#e5e7eb] hover:border-[#000000]"
                          }`}
                      >
                        Outside Dhaka
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between text-[#444444] pt-2">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-[#000000]">
                      {shippingCost === 0 ? "FREE" : `৳${shippingCost}`}
                    </span>
                  </div>
                </div>

                {/* Promo Code Form */}
                <div className="py-4 border-b border-[#e5e7eb]">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Promo Code (e.g. VIBBE10)"
                      className="flex-1 h-9 px-3 text-xs uppercase bg-[#ffffff] border border-[#e5e7eb] text-[#000000] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#000000] transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-4 h-9 bg-[#000000] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#222222] transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                  {couponError && (
                    <p className="text-[11px] text-[#d95338] mt-1.5">{couponError}</p>
                  )}
                  {couponSuccess && (
                    <p className="text-[11px] text-[#15803d] mt-1.5">{couponSuccess}</p>
                  )}
                </div>

                {/* Total Line */}
                <div className="pt-4 pb-6 flex items-baseline justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#000000]">
                    Total (BDT)
                  </span>
                  <span className="text-lg font-black text-[#000000]">
                    ৳{total.toLocaleString()}
                  </span>
                </div>

                {/* Checkout Link */}
                <Link
                  href="/checkout"
                  className="w-full h-12 bg-[#000000] text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#222222] transition-colors shadow-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-[10px] text-center text-[#9ca3af] uppercase tracking-wider mt-3">
                  Taxes & localized shipping calculated at checkout
                </p>
              </div>

              {/* Local Payment Badges */}
              <div className="mt-4 p-3 border border-[#e5e7eb] bg-white flex flex-wrap items-center justify-center gap-1.5 text-[9px] font-bold text-[#444444] uppercase tracking-wider">
                <span className="px-2 py-0.5 bg-[#fafafa] border border-[#e5e7eb]">bKash</span>
                <span className="px-2 py-0.5 bg-[#fafafa] border border-[#e5e7eb]">Nagad</span>
                <span className="px-2 py-0.5 bg-[#fafafa] border border-[#e5e7eb]">Rocket</span>
                <span className="px-2 py-0.5 bg-[#fafafa] border border-[#e5e7eb]">Cash on Delivery</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}