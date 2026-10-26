"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  {
    id: 1,
    name: "DROP SHOULDER",
    href: "/shop/drop-shoulder",
    image: "/img/cat/drop-shoulder.png",
  },
  {
    id: 2,
    name: "T-SHIRT",
    href: "/shop/t-shirt",
    image: "/img/cat/t-shirt.png",
  },
  {
    id: 3,
    name: "SHIRT",
    href: "/shop/shirt",
    image: "/img/cat/shirt.png",
  },
  {
    id: 4,
    name: "PANJABI",
    href: "/shop/panjabi",
    image: "/img/cat/panjabi.png",
  },
  {
    id: 5,
    name: "HOODIE",
    href: "/shop/hoodie",
    image: "/img/cat/hoodie.png",
  },
  {
    id: 6,
    name: "POLO",
    href: "/shop/polo",
    image: "/img/cat/polo.png",
  },
  {
    id: 7,
    name: "DENIM JEANS",
    href: "/shop/denim-jeans",
    image: "/img/cat/denim-jeans.png",
  },
  {
    id: 8,
    name: "HALF PANTS",
    href: "/shop/half-pants",
    image: "/img/cat/half-pants.png",
  },
  {
    id: 9,
    name: "FORMAL PANT",
    href: "/shop/formal-pant",
    image: "/img/cat/formal-pant.png",
  },
];

const DISPLAY_CATEGORIES = [...CATEGORIES, ...CATEGORIES, ...CATEGORIES];

export default function ShopByCategory() {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    if (sliderRef.current) {
      const singleSetWidth = sliderRef.current.scrollWidth / 3;
      sliderRef.current.scrollLeft = singleSetWidth;
    }
  }, []);

  // Shared drag start logic for Mouse & Touch
  const handleDragStart = (clientX) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(clientX);
    setScrollLeftState(sliderRef.current.scrollLeft);
  };

  // Shared drag move logic for Mouse & Touch
  const handleDragMove = (clientX) => {
    if (!isDragging || !sliderRef.current) return;

    const deltaX = clientX - startX;

    if (Math.abs(deltaX) > 4) {
      setHasMoved(true);
    }

    const el = sliderRef.current;
    const singleSetWidth = el.scrollWidth / 3;
    let nextScrollLeft = scrollLeftState - deltaX;

    // Infinite loop wrap boundary
    if (nextScrollLeft >= singleSetWidth * 2) {
      nextScrollLeft -= singleSetWidth;
      setStartX(clientX);
      setScrollLeftState(nextScrollLeft);
    } else if (nextScrollLeft <= 0) {
      nextScrollLeft += singleSetWidth;
      setStartX(clientX);
      setScrollLeftState(nextScrollLeft);
    }

    el.scrollLeft = nextScrollLeft;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Mouse Handlers
  const handleMouseDown = (e) => handleDragStart(e.clientX);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    handleDragMove(e.clientX);
  };

  // Touch Handlers for Mobile Phones
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    handleDragMove(e.touches[0].clientX);
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
          <div className="w-40 sm:w-52 h-0.75 bg-[#d95338] mt-3" />
        </div>

        {/* 1:1 Hand Pointer / Touch Slider Track */}
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
          className="flex items-start gap-8 sm:gap-14 overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y"
        >
          {DISPLAY_CATEGORIES.map((cat, index) => (
            <Link
              key={`${cat.id}-${index}`}
              href={cat.href}
              onClick={handleLinkClick}
              draggable={false}
              className="shrink-0 flex flex-col items-center w-42.5 sm:w-55"
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
              <div className="relative w-full h-55 sm:h-70 flex items-center justify-center">
                <Image
                  src={cat.image}
                  alt={cat.name || "Category image"}
                  width={400}
                  height={400}
                  draggable={false}
                  className="w-full h-auto object-contain pointer-events-none"
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