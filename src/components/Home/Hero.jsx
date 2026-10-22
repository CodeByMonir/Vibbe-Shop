"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const SLIDES = [
    {
        id: 1,
        title: "Minimalist Tokyo Oversized Tee",
        image:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1800&q=85",
    },
    {
        id: 2,
        title: "Cuban Collar Textured Resort Shirt",
        image:
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1800&q=85",
    },
    {
        id: 3,
        title: "Relaxed Wide-Leg Pleated Trousers",
        image:
            "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1800&q=85",
    },
    {
        id: 4,
        title: "Distressed Monochrome Trucker Jacket",
        image:
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1800&q=85",
    },
    {
        id: 5,
        title: "Raw Edge Utility Cargo Pant",
        image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1800&q=85",
    },
];

const variants = {
    enter: (dir) => ({
        x: dir > 0 ? "100%" : "-100%",
        opacity: 0.4,
        scale: 0.98,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.75,
            ease: [0.25, 1, 0.5, 1],
        },
    },
    exit: (dir) => ({
        x: dir > 0 ? "-100%" : "100%",
        opacity: 0.3,
        scale: 0.98,
        transition: {
            duration: 0.7,
            ease: [0.5, 0, 0.75, 0],
        },
    }),
};

export default function ImageCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const autoPlayDuration = 5000;
    const currentSlide = SLIDES[currentIndex];

    const paginate = useCallback((newDirection) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => {
            let nextIndex = prevIndex + newDirection;
            if (nextIndex >= SLIDES.length) nextIndex = 0;
            if (nextIndex < 0) nextIndex = SLIDES.length - 1;
            return nextIndex;
        });
    }, []);

    // Autoplay
    useEffect(() => {
        if (isHovered) return;

        const timer = setInterval(() => {
            paginate(1);
        }, autoPlayDuration);

        return () => clearInterval(timer);
    }, [isHovered, paginate]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight") paginate(1);
            if (e.key === "ArrowLeft") paginate(-1);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [paginate]);

    const handleDragEnd = (_, info) => {
        const swipeThreshold = 50;
        const swipeVelocityThreshold = 300;

        if (info.offset.x < -swipeThreshold || info.velocity.x < -swipeVelocityThreshold) {
            paginate(1);
        } else if (info.offset.x > swipeThreshold || info.velocity.x > swipeVelocityThreshold) {
            paginate(-1);
        }
    };

    return (
        <div
            className="relative h-screen w-full overflow-hidden font-sans select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence initial={false} custom={direction} mode="sync">
                <motion.div
                    key={currentSlide.id}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                    className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
                >
                    {/* Background Slide Image */}
                    <img
                        src={currentSlide.image}
                        alt={currentSlide.title}
                        className="w-full h-full object-cover object-center pointer-events-none"
                    />

                    

                    {/* Heading Only */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 lg:p-16 max-w-4xl pointer-events-none">
                        <motion.h1
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md"
                        >
                            {currentSlide.title}
                        </motion.h1>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 inset-x-4 flex items-center justify-between pointer-events-none z-20">
                <button
                    onClick={() => paginate(-1)}
                    aria-label="Previous Slide"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 pointer-events-auto shadow-2xl group"
                >
                    <ChevronLeft className="w-5 h-5 text-slate-200 group-hover:-translate-x-0.5 transition-transform" />
                </button>

                <button
                    onClick={() => paginate(1)}
                    aria-label="Next Slide"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 pointer-events-auto shadow-2xl group"
                >
                    <ChevronRight className="w-5 h-5 text-slate-200 group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>
        </div>
    );
}