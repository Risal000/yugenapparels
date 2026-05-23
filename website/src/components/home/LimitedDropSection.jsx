import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function LimitedDropSection({ bgImage }) {
  return (
    <section className="relative overflow-hidden my-4">
      {/* Full-bleed image */}
      <div className="relative h-[70vh] lg:h-[80vh]">
        <img
          src={bgImage}
          alt="Limited drop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

        {/* Content - left aligned editorial style */}
        <div className="absolute inset-0 flex items-center px-8 lg:px-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-xl"
          >
            {/* Drop badge */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
              <span className="text-[9px] tracking-[0.4em] uppercase text-white/40 font-light">
                Limited Release · 2026
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05] tracking-[-0.02em] text-white/95 mb-6">
              The Void<br />
              <span className="italic text-white/50">Collection</span>
            </h2>

            <p className="text-xs leading-[2] text-white/30 max-w-xs mb-10 font-light">
              A capsule exploring the beauty of emptiness. Crafted in silence, worn with intent. Once gone, gone forever.
            </p>

            <div className="flex items-center gap-6">
              <Link
                to="/shop/essentials"
                className="group inline-flex items-center gap-4 text-[10px] tracking-[0.25em] uppercase text-white/80 hover:text-white transition-colors duration-400"
              >
                Shop the Drop
                <span className="w-10 h-px bg-white/30 group-hover:w-16 group-hover:bg-white/60 transition-all duration-500" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right side editorial text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute right-8 lg:right-16 bottom-10 hidden lg:block text-right"
        >
          <p className="text-[9px] tracking-[0.3em] uppercase text-white/15 font-light">
            Limited Units
          </p>
          <p className="text-[9px] tracking-[0.3em] uppercase text-white/15 font-light mt-1">
            Ships Worldwide
          </p>
        </motion.div>
      </div>
    </section>
  );
}