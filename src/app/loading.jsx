"use client";

import React from "react";

export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4 select-none">
        <div className="relative w-12 h-12 flex items-center justify-center">
          {/* Morphing Outer Diamond */}
          <div className="loader-box" />

          {/* Inner Orbital Dot */}
          <div className="loader-dot" />
        </div>

        {text && (
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
            {text}
          </span>
        )}

        <style jsx>
          {`
        .loader-box 
        {
          width: 38px;
          height: 38px;
          border: 2px solid #000000;
          border-radius: 4px;
          animation: morph-spin 1.4s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }

        .loader-dot 
        {
          position: absolute;
          width: 7px;
          height: 7px;
          background-color: #000000;
          border-radius: 50%;
          animation: dot-pulse 1.4s ease-in-out infinite;
        }

        @keyframes morph-spin {
          0% {
            transform: rotate(0deg) scale(1);
            border-radius: 4px;
          }
          50% {
            transform: rotate(180deg) scale(0.75);
            border-radius: 50%;
            border-color: #555555;
          }
          100% {
            transform: rotate(360deg) scale(1);
            border-radius: 4px;
            border-color: #000000;
          }
        }

        @keyframes dot-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.6);
            opacity: 0.4;
          }
        }
      `}
        </style>
      </div>
    </div>
  );
}
