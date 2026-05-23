import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { X, Heart } from "lucide-react";
import { WishlistItems } from "@/lib/db";

export default function Wishlist() {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["wishlistItems"],
    queryFn: () => WishlistItems.list(),
  });

  const removeItem = async (item) => {
    await WishlistItems.delete(item.id);
    queryClient.invalidateQueries({ queryKey: ["wishlistItems"] });
  };

  return (
    <div className="pt-20 lg:pt-24 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12 lg:py-20">
        <h1 className="text-xl lg:text-2xl font-light tracking-[-0.01em] text-foreground/80 mb-12">Wishlist</h1>
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-foreground/10 border-t-foreground/40 rounded-full animate-spin mx-auto mt-20" />
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <Heart className="w-8 h-8 text-foreground/10 mx-auto mb-4" />
            <p className="text-xs tracking-[0.1em] uppercase text-foreground/20 mb-6">Your wishlist is empty</p>
            <Link to="/shop/tops" className="inline-block text-[10px] tracking-[0.2em] uppercase text-foreground/40 border border-foreground/20 px-6 py-3 hover:bg-foreground hover:text-background transition-all duration-500">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {items.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="group">
                <Link to={`/product/${item.product_id}`}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-card mb-4">
                    {item.product_image && (
                      <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    )}
                    <button onClick={(e) => { e.preventDefault(); removeItem(item); }} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-foreground/60 hover:text-foreground">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="text-xs tracking-wide text-foreground/60">{item.product_name}</h3>
                  <p className="text-xs text-foreground/40 mt-1">₹{item.price?.toLocaleString()}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
