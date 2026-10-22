"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";

const CATEGORIES = [
  {
    id: 1,
    name: "CARGOS",
    href: "/category/cargos",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "POLOS",
    href: "/category/polos",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "OUTERWEAR",
    href: "/category/outerwear",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "PLUS SIZE",
    href: "/category/plus-size",
    badge: "3XL TO 6XL",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    name: "SNEAKERS",
    href: "/category/sneakers",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    name: "SHIRTS",
    href: "/category/shirts",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 7,
    name: "DENIM",
    href: "/category/denim",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
  },
];

const DISPLAY_CATEGORIES = [...CATEGORIES, ...CATEGORIES, ...CATEGORIES];

export default function ShopByCategory() {
  const sliderRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    if (sliderRef.current) {
      const singleSetWidth = sliderRef.current.scrollWidth / 3;
      sliderRef.current.scrollLeft = singleSetWidth;
    }
  }, []);

  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    setHasMoved(false);
    // Track exact screen coordinates
    setStartX(e.clientX);
    setScrollLeftState(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || !sliderRef.current) return;
    e.preventDefault();

    // Exact 1:1 pixel difference
    const deltaX = e.clientX - startX;

    if (Math.abs(deltaX) > 4) {
      setHasMoved(true);
    }

    const el = sliderRef.current;
    const singleSetWidth = el.scrollWidth / 3;
    let nextScrollLeft = scrollLeftState - deltaX;

    // Infinite loop wrap boundary
    if (nextScrollLeft >= singleSetWidth * 2) {
      nextScrollLeft -= singleSetWidth;
      setStartX(e.clientX);
      setScrollLeftState(nextScrollLeft);
    } else if (nextScrollLeft <= 0) {
      nextScrollLeft += singleSetWidth;
      setStartX(e.clientX);
      setScrollLeftState(nextScrollLeft);
    }

    el.scrollLeft = nextScrollLeft;
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
  };

  const handleLinkClick = (e) => {
    if (hasMoved) {
      e.preventDefault();
    }
  };

  return (
    <section className="w-full bg-[#ffffff] py-10 sm:py-14 select-none">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-8">

        {/* Header Block */}
        <div className="mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl font-light text-[#111111] tracking-wide leading-tight">
            SHOP BY
            <span className="block font-black text-3xl sm:text-4xl text-[#000000] tracking-tight">
              CATEGORY
            </span>
          </h2>
          <div className="w-40 sm:w-52 h-[3px] bg-[#d95338] mt-3" />
        </div>

        {/* 1:1 Hand Pointer Slider Track */}
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="flex items-start gap-8 sm:gap-14 overflow-hidden cursor-pointer"
        >
          {DISPLAY_CATEGORIES.map((cat, index) => (
            <Link
              key={`${cat.id}-${index}`}
              href={cat.href}
              onClick={handleLinkClick}
              draggable={false}
              className="flex-shrink-0 flex flex-col items-center w-[170px] sm:w-[220px] cursor-pointer"
            >
              {/* Category Title + Badge */}
              <div className="flex items-center justify-center gap-2 mb-4 h-7">
                <span className="text-sm sm:text-base font-bold tracking-wider text-[#111111] uppercase">
                  {cat.name}
                </span>

                {cat.badge && (
                  <span className="px-2 py-0.5 text-[9px] font-semibold text-[#d95338] border border-[#d95338] rounded-full uppercase tracking-tighter">
                    {cat.badge}
                  </span>
                )}
              </div>

              {/* Product Floating Image */}
              <div className="relative w-full h-[220px] sm:h-[280px] flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.name}
                  draggable={false}
                  className="max-h-full max-w-full object-contain pointer-events-none"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom "SHOP ALL" Link */}
        <div className="mt-8 sm:mt-10">
          <Link
            href="/shop"
            className="text-xs sm:text-sm font-bold tracking-widest text-[#000000] uppercase underline underline-offset-4 cursor-pointer"
          >
            SHOP ALL
          </Link>
        </div>

      </div>
    </section>
  );
}