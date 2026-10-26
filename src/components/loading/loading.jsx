"use client";

import React from "react";

/**
 * Universal Loading Spinner for Vibbe Storefront.
 *
 * @param {string} [text="Loading..."] - Caption underneath the spinner. Pass `null` or `""` for icon-only.
 * @param {'sm'|'md'|'lg'} [size='md'] - Scale presets ('sm' for cards/dropdowns, 'md' default, 'lg' hero/screens).
 * @param {boolean} [fullScreen=false] - When true, forces `h-screen` viewport centering.
 * @param {string} [className=""] - Additional container classes (e.g., "py-16", "min-h-[300px]").
 */
export default function LoadingSpinner({
  text = "Loading...",
  size = "md",
  fullScreen = false,
  className = "",
}) {
  // Dimension maps based on size
  const sizeConfig = {
    sm: {
      container: "w-8 h-8",
      box: 24,
      dot: 4.5,
      border: 1.5,
      text: "text-[10px]",
    },
    md: {
      container: "w-12 h-12",
      box: 38,
      dot: 7,
      border: 2,
      text: "text-xs",
    },
    lg: {
      container: "w-16 h-16",
      box: 52,
      dot: 9,
      border: 2.5,
      text: "text-sm",
    },
  };

  const config = sizeConfig[size] || sizeConfig.md;

  const containerLayout = fullScreen
    ? "min-h-screen w-full flex items-center justify-center"
    : `w-full flex items-center justify-center py-12 ${className}`;

  return (
    <div className={containerLayout}>
      <div className="flex flex-col items-center justify-center gap-3.5 select-none">
        <div className={`relative ${config.container} flex items-center justify-center`}>
          {/* Morphing Outer Diamond */}
          <div
            className="loader-box"
            style={{
              width: `${config.box}px`,
              height: `${config.box}px`,
              borderWidth: `${config.border}px`,
            }}
          />

          {/* Inner Orbital Dot */}
          <div
            className="loader-dot"
            style={{
              width: `${config.dot}px`,
              height: `${config.dot}px`,
            }}
          />
        </div>

        {text && (
          <span
            className={`font-semibold uppercase tracking-widest text-[#555555] ${config.text}`}
          >
            {text}
          </span>
        )}

        <style jsx>{`
          .loader-box {
            border-style: solid;
            border-color: #000000;
            border-radius: 4px;
            animation: morph-spin 1.4s cubic-bezier(0.65, 0, 0.35, 1) infinite;
          }

          .loader-dot {
            position: absolute;
            background-color: #000000;
            border-radius: 50%;
            animation: dot-pulse 1.4s ease-in-out infinite;
          }

          @keyframes morph-spin {
            0% {
              transform: rotate(0deg) scale(1);
              border-radius: 4px;
              border-color: #000000;
            }
            50% {
              transform: rotate(180deg) scale(0.75);
              border-radius: 50%;
              border-color: #777777;
            }
            100% {
              transform: rotate(360deg) scale(1);
              border-radius: 4px;
              border-color: #000000;
            }
          }

          @keyframes dot-pulse {
            0%,
            100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.6);
              opacity: 0.4;
            }
          }
        `}</style>
      </div>
    </div>
  );
}