import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function FeaturedCategories({ categories }) {
  return (
    <section id="categories" className="py-12 lg:py-16 px-6 lg:px-16 max-w-[1500px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-base font-semibold text-foreground/80">Shop by Category</h2>
        <Link
          to="/shop/tops"
          className="text-[10px] tracking-[0.15em] uppercase text-foreground/40 hover:text-foreground/70 transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* Responsive grid: 2 cols mobile → 4 cols desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <Link to={`/shop/${cat.slug}`} className="group block relative">
              <div className="aspect-[3/4] overflow-hidden bg-card relative">
                <img
                  src={cat.image}
                  alt={cat.label}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                  <span className="text-sm font-medium text-white">{cat.label}</span>
                  <span className="text-[9px] tracking-[0.15em] uppercase text-white/60 group-hover:text-white transition-colors">
                    Shop →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}