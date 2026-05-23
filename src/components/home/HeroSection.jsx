import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HeroSection({ imageUrl }) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute inset-0"
      >
        <img src={imageUrl} alt="Yūgen" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
      </motion.div>

      {/* Top label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="absolute top-24 right-8 lg:right-16"
      >
        <span className="text-[9px] tracking-[0.4em] uppercase text-white/30 border border-white/15 px-3 py-1.5">
          SS26 Collection
        </span>
      </motion.div>

      {/* Main content */}
      <div className="relative h-full flex flex-col justify-end px-8 lg:px-16 pb-16 lg:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3">
            New Collection / SS26
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white mb-8">
            Essentials,<br />refined.
          </h1>

          <div className="flex items-center gap-3">
            <Link
              to="/shop/tops"
              className="bg-white text-black text-[10px] font-semibold tracking-[0.15em] uppercase px-6 py-3 hover:bg-white/90 transition-colors duration-300"
            >
              Shop Now
            </Link>
            <a
              href="#categories"
              className="border border-white/30 text-white text-[10px] font-medium tracking-[0.15em] uppercase px-6 py-3 hover:border-white/60 hover:bg-white/10 transition-all duration-300"
            >
              Categories
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}