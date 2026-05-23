import React from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import { Link } from "react-router-dom";

export default function ProductSection({ title, subtitle, products, viewAllLink }) {
  return (
    <section className="py-8 lg:py-12 px-6 lg:px-16 max-w-[1500px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between mb-6"
      >
        <div>
          {subtitle && (
            <p className="text-[9px] tracking-[0.3em] uppercase text-foreground/30 mb-1">{subtitle}</p>
          )}
          <h2 className="text-xl font-bold text-foreground/85">{title}</h2>
        </div>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-[10px] tracking-[0.15em] uppercase text-foreground/35 hover:text-foreground/70 transition-colors"
          >
            All New →
          </Link>
        )}
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}