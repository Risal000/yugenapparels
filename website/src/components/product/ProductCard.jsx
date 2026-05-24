import db from '@/api/base44Client';

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import { useQueryClient } from "@tanstack/react-query";

export default function ProductCard({ product, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const queryClient = useQueryClient();

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!wishlisted) {
      await db.entities.WishlistItem.create({
        product_id: product.id,
        product_name: product.name,
        product_image: product.image_url,
        price: product.price,
      });
      setWishlisted(true);
    }
    queryClient.invalidateQueries({ queryKey: ["wishlistItems"] });
  };

  const quickAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    await db.entities.CartItem.create({
      product_id: product.id,
      product_name: product.name,
      product_image: product.image_url,
      price: product.price,
      size: product.sizes?.[0] || "",
      quantity: 1,
    });
    queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    setTimeout(() => setAdding(false), 800);
  };

  const showAltImage = hovered && product.hover_image_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: index * 0.09, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-card mb-4">

          {/* Primary image */}
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
              showAltImage ? "opacity-0 scale-[1.04]" : "opacity-100 scale-100 group-hover:scale-[1.04]"
            }`}
          />

          {/* Hover / alternate image */}
          {product.hover_image_url && (
            <img
              src={product.hover_image_url}
              alt={product.name}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                showAltImage ? "opacity-100 scale-[1.02]" : "opacity-0 scale-[1.06]"
              }`}
            />
          )}

          {/* Top left tag */}
          {(product.tags?.includes("limited_drop") || product.tags?.includes("new_arrival")) && (
            <div className="absolute top-3 left-3 z-10">
              <span className="text-[8px] tracking-[0.2em] uppercase bg-white text-black px-2.5 py-1 font-medium">
                {product.tags.includes("limited_drop") ? "Limited" : "New"}
              </span>
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/50"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                wishlisted ? "fill-white text-white" : "text-white/80"
              }`}
            />
          </button>

          {/* Bottom action bar */}
          <div
            className={`absolute bottom-0 left-0 right-0 z-10 transition-all duration-400 ease-out ${
              hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            }`}
          >
            <button
              onClick={quickAddToCart}
              className="w-full py-3.5 bg-white/95 backdrop-blur-sm text-black text-[9px] font-medium tracking-[0.2em] uppercase hover:bg-white transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {adding ? (
                <span className="text-black/50">Added ✓</span>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3" />
                  Quick Add
                </>
              )}
            </button>
          </div>

          {/* Subtle dark gradient at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        </div>

        {/* Product info */}
        <div className="px-0.5 space-y-1.5">
          <h3 className="text-[11px] font-medium tracking-[0.06em] text-foreground/60 group-hover:text-foreground/90 transition-colors duration-400 leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-medium text-foreground/50">
              ₹{product.price?.toLocaleString()}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-[10px] text-foreground/20 line-through">
                ₹{product.original_price?.toLocaleString()}
              </span>
            )}
          </div>

          {/* Color dots */}
          {product.color_variants?.length > 0 && (
            <div className="flex items-center gap-1.5 pt-0.5">
              {product.color_variants.slice(0, 6).map((v, i) => (
                <span
                  key={i}
                  title={v.name}
                  className="w-3 h-3 rounded-full border border-white/10 flex-shrink-0"
                  style={{ backgroundColor: v.hex || "#ccc" }}
                />
              ))}
              {product.color_variants.length > 6 && (
                <span className="text-[8px] text-foreground/25 ml-0.5">+{product.color_variants.length - 6}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}