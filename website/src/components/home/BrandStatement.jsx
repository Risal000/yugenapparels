import React from "react";
import { motion } from "framer-motion";

export default function BrandStatement() {
  return (
    <section className="py-28 lg:py-44 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Top rule */}
          <div className="flex items-center justify-center gap-6 mb-12">
            <div className="h-px w-12 bg-foreground/15" />
            <span className="text-[9px] tracking-[0.5em] uppercase text-foreground/25 font-light">
              Est. 2024
            </span>
            <div className="h-px w-12 bg-foreground/15" />
          </div>

          <p className="text-xl sm:text-2xl lg:text-3xl font-light leading-[1.5] tracking-[-0.01em] text-foreground/55">
            Yūgen Apparels represents{" "}
            <span className="text-foreground/85 italic">minimalism</span>,{" "}
            <span className="text-foreground/85 italic">depth</span>, and{" "}
            <span className="text-foreground/85 italic">modern streetwear</span>.
          </p>

          <p className="mt-8 text-xs tracking-[0.1em] leading-[2] text-foreground/25 max-w-sm mx-auto font-light">
            Clothing that speaks in silence. Worn by those who understand that less, when done right, is everything.
          </p>

          {/* Bottom rule */}
          <div className="mt-12 flex items-center justify-center">
            <div className="h-px w-8 bg-foreground/10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}