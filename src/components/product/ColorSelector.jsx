import React from "react";
import { motion } from "framer-motion";

export default function ColorSelector({ variants, selectedColor, onChange }) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[9px] tracking-[0.25em] uppercase text-foreground/30 font-light">
          Color
          {selectedColor && (
            <span className="ml-2 text-foreground/55 normal-case tracking-normal">
              — {selectedColor.name}
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {variants.map((variant, i) => {
          const isSelected = selectedColor?.name === variant.name;
          const isUnavailable = variant.in_stock === false;

          return (
            <motion.button
              key={i}
              type="button"
              whileHover={!isUnavailable ? { scale: 1.1 } : {}}
              whileTap={!isUnavailable ? { scale: 0.95 } : {}}
              onClick={() => !isUnavailable && onChange(variant)}
              disabled={isUnavailable}
              title={variant.name}
              className={`relative w-8 h-8 transition-all duration-250 focus:outline-none group ${
                isUnavailable ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {/* Color circle */}
              <span
                className={`block w-full h-full rounded-full border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-foreground/80 scale-90"
                    : "border-transparent hover:border-foreground/30"
                }`}
                style={{ backgroundColor: variant.hex || "#ccc" }}
              />

              {/* Selection ring */}
              {isSelected && (
                <motion.span
                  layoutId="color-ring"
                  className="absolute inset-[-3px] rounded-full border border-foreground/60"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {/* Strikethrough for unavailable */}
              {isUnavailable && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-[130%] h-px bg-foreground/40 rotate-45 block" />
                </span>
              )}

              {/* Tooltip */}
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] tracking-wide whitespace-nowrap text-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {variant.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}