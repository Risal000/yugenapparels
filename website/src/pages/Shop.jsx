const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { NAVIGATION } from "@/lib/navigation";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

export default function Shop() {
  const { category, subcategory } = useParams();
  const [sizeFilter, setSizeFilter] = useState(null);
  const [priceSort, setPriceSort] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => db.entities.Product.list("-created_date", 100),
  });

  const currentNav = NAVIGATION.find((n) => n.slug === category);
  const currentSub = currentNav?.subcategories.find((s) => s.slug === subcategory);

  const filtered = useMemo(() => {
    let result = products;
    if (category) result = result.filter((p) => p.category === category);
    if (subcategory && !subcategory.startsWith("all-")) {
      result = result.filter(
        (p) => p.subcategory?.toLowerCase().replace(/\s+/g, "-") === subcategory
      );
    }
    if (sizeFilter) result = result.filter((p) => p.sizes?.includes(sizeFilter));
    if (priceSort === "low") result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (priceSort === "high") result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    return result;
  }, [products, category, subcategory, sizeFilter, priceSort]);

  const pageTitle = currentSub?.label || currentNav?.label || "All Products";
  const hasActiveFilters = sizeFilter || priceSort;

  return (
    <div className="min-h-screen bg-background pt-[60px] lg:pt-[72px]">

      {/* Page hero banner */}
      <div className="border-b border-border/15 py-14 lg:py-20 px-6 lg:px-12">
        <div className="max-w-[1500px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Link to="/" className="text-[9px] tracking-[0.2em] uppercase text-foreground/20 hover:text-foreground/45 transition-colors">
              Home
            </Link>
            <span className="text-foreground/12 text-[10px]">/</span>
            {currentNav && (
              <>
                <Link to={`/shop/${category}`} className="text-[9px] tracking-[0.2em] uppercase text-foreground/20 hover:text-foreground/45 transition-colors">
                  {currentNav.label}
                </Link>
                {currentSub && (
                  <>
                    <span className="text-foreground/12 text-[10px]">/</span>
                    <span className="text-[9px] tracking-[0.2em] uppercase text-foreground/40">
                      {currentSub.label}
                    </span>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex items-end justify-between">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h1 className="text-3xl lg:text-5xl font-light tracking-[-0.02em] text-foreground/85">
                {pageTitle}
              </h1>
              {!isLoading && (
                <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/25 mt-3 font-light">
                  {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
                </p>
              )}
            </motion.div>

            {/* Filter toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2.5 text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                filtersOpen || hasActiveFilters ? "text-foreground/70" : "text-foreground/30 hover:text-foreground/60"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full" />
              )}
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${filtersOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Subcategory tabs */}
      {currentNav && (
        <div className="border-b border-border/15 px-6 lg:px-12 overflow-x-auto">
          <div className="max-w-[1500px] mx-auto flex items-center gap-0 min-w-max">
            {currentNav.subcategories.map((sub) => {
              const isActive = subcategory === sub.slug || (!subcategory && sub.slug.startsWith("all-"));
              return (
                <Link
                  key={sub.slug}
                  to={`/shop/${category}/${sub.slug}`}
                  className={`text-[10px] tracking-[0.15em] uppercase px-5 py-4 border-b-[1.5px] transition-all duration-300 whitespace-nowrap font-light ${
                    isActive
                      ? "border-foreground/60 text-foreground/80"
                      : "border-transparent text-foreground/25 hover:text-foreground/55 hover:border-foreground/20"
                  }`}
                >
                  {sub.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-b border-border/15 bg-card/30"
          >
            <div className="max-w-[1500px] mx-auto px-6 lg:px-12 py-7 flex flex-wrap items-end gap-10">
              {/* Size */}
              <div>
                <p className="text-[9px] tracking-[0.3em] uppercase text-foreground/25 mb-3.5 font-light">
                  Size
                </p>
                <div className="flex gap-2">
                  {SIZE_OPTIONS.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSizeFilter(sizeFilter === size ? null : size)}
                      className={`w-10 h-10 text-[10px] tracking-wider border transition-all duration-200 ${
                        sizeFilter === size
                          ? "border-foreground/60 text-foreground bg-foreground/5"
                          : "border-border/30 text-foreground/30 hover:border-foreground/30 hover:text-foreground/60"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <p className="text-[9px] tracking-[0.3em] uppercase text-foreground/25 mb-3.5 font-light">
                  Sort by Price
                </p>
                <div className="flex gap-2">
                  {[{ label: "Low → High", value: "low" }, { label: "High → Low", value: "high" }].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setPriceSort(priceSort === opt.value ? null : opt.value)}
                      className={`text-[10px] tracking-[0.1em] uppercase px-4 py-2.5 border transition-all duration-200 font-light ${
                        priceSort === opt.value
                          ? "border-foreground/60 text-foreground bg-foreground/5"
                          : "border-border/30 text-foreground/30 hover:border-foreground/30 hover:text-foreground/60"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear */}
              {hasActiveFilters && (
                <button
                  onClick={() => { setSizeFilter(null); setPriceSort(null); }}
                  className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-foreground/25 hover:text-foreground/55 transition-colors pb-0.5"
                >
                  <X className="w-3 h-3" />
                  Clear all
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product grid */}
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-card/60 mb-4" />
                <div className="h-2.5 w-20 bg-card/60 mb-2.5" />
                <div className="h-2.5 w-14 bg-card/60" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/20 font-light mb-6">
              No products found
            </p>
            {hasActiveFilters && (
              <button
                onClick={() => { setSizeFilter(null); setPriceSort(null); }}
                className="text-[9px] tracking-[0.2em] uppercase text-foreground/30 border border-foreground/15 px-5 py-2.5 hover:border-foreground/30 hover:text-foreground/55 transition-all duration-300"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 xl:gap-8">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}