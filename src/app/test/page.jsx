"use client";


/**
 * Universal Hydration-Safe Loading Spinner for Vibbe Storefront.
 * Works out-of-the-box without touching globals.css or tailwind.config.
 */
export default function LoadingSpinner({
  text = "Loading...",
  size = "md",
  fullScreen = false,
  className = "",
}) {
  const sizeMap = {
    sm: { box: 24, stroke: 2, dot: 4, text: "text-[10px]" },
    md: { box: 38, stroke: 2.5, dot: 6, text: "text-xs" },
    lg: { box: 52, stroke: 3, dot: 8, text: "text-sm" },
  };

  const { box, stroke, dot, text: textClass } = sizeMap[size] || sizeMap.md;

  const containerClass = fullScreen
    ? "min-h-screen w-full flex items-center justify-center bg-white"
    : `w-full flex items-center justify-center py-12 ${className}`;

  return (
    <div className={containerClass} role="status" aria-live="polite">
      <div className="flex flex-col items-center justify-center gap-3.5 select-none">

        {/* Isolated Animation Container */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: `${box + 8}px`, height: `${box + 8}px` }}
        >
          {/* Outer Morphing Diamond / Square */}
          <div
            style={{
              width: `${box}px`,
              height: `${box}px`,
              border: `${stroke}px solid #000000`,
              borderRadius: "4px",
              animation: "vibbeMorph 1.4s cubic-bezier(0.65, 0, 0.35, 1) infinite",
            }}
          />

          {/* Inner Pulsing Dot */}
          <div
            style={{
              position: "absolute",
              width: `${dot}px`,
              height: `${dot}px`,
              backgroundColor: "#000000",
              borderRadius: "50%",
              animation: "vibbePulse 1.4s ease-in-out infinite",
            }}
          />
        </div>

        {/* Optional Text Label */}
        {text && (
          <span className={`font-semibold uppercase tracking-widest text-[#555555] ${textClass}`}>
            {text}
          </span>
        )}

        {/* Global Keyframes without styled-jsx scoping bugs */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes vibbeMorph {
              0% {
                transform: rotate(0deg) scale(1);
                border-radius: 4px;
                border-color: #000000;
              }
              50% {
                transform: rotate(180deg) scale(0.72);
                border-radius: 50%;
                border-color: #666666;
              }
              100% {
                transform: rotate(360deg) scale(1);
                border-radius: 4px;
                border-color: #000000;
              }
            }
            @keyframes vibbePulse {
              0%, 100% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(1.6);
                opacity: 0.35;
              }
            }
          `
        }} />
      </div>
    </div>
  );
}