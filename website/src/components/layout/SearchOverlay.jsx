import db from '@/api/base44Client';

import React, { useState, useEffect, useRef } from "react";
import { X, Search, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Link } from "react-router-dom";

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      const all = await db.entities.Product.list();
      const filtered = all.filter(
        (p) =>
          p.name?.toLowerCase().includes(query.toLowerCase()) ||
          p.category?.toLowerCase().includes(query.toLowerCase()) ||
          p.subcategory?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 8));
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-background/98 backdrop-blur-xl"
        >
          <div className="max-w-[700px] mx-auto px-6 pt-24">
            <div className="flex items-center justify-between mb-12">
              <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/30">
                Search
              </span>
              <button
                onClick={onClose}
                className="text-foreground/40 hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative border-b border-foreground/20 pb-3">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent pl-8 text-lg font-light tracking-wide text-foreground placeholder:text-foreground/20 focus:outline-none"
              />
            </div>

            <div className="mt-8 space-y-1">
              {loading && (
                <p className="text-xs tracking-[0.1em] text-foreground/30 uppercase py-4">
                  Searching...
                </p>
              )}
              {!loading && results.length === 0 && query.trim() && (
                <p className="text-xs tracking-[0.1em] text-foreground/30 uppercase py-4">
                  No results found
                </p>
              )}
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  className="flex items-center gap-4 py-3 group hover:bg-card/50 px-2 transition-colors"
                >
                  {product.image_url && (
                    <div className="w-12 h-14 bg-card flex-shrink-0 overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm tracking-wide text-foreground/70 group-hover:text-foreground transition-colors">
                      {product.name}
                    </p>
                    <p className="text-xs text-foreground/30 mt-0.5">
                      ₹{product.price?.toLocaleString()}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-foreground/10 group-hover:text-foreground/40 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}