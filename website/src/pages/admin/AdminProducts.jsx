import db from '@/api/base44Client';

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => db.entities.Product.list("-created_date", 200),
  });

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (p) => { setEditing(p); setFormOpen(true); };

  const handleDelete = async (id) => {
    setDeleting(id);
    await db.entities.Product.delete(id);
    queryClient.invalidateQueries({ queryKey: ["products"] });
    setDeleting(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light tracking-[-0.01em] text-foreground/85">Products</h1>
          <p className="text-xs text-foreground/30 mt-1 font-light">{products.length} total products</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-foreground text-background px-4 py-2.5 text-[10px] tracking-[0.15em] uppercase hover:bg-foreground/85 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/25" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-card border border-border/30 pl-10 pr-4 py-3 text-xs text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-foreground/40 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/25 hover:text-foreground/60">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Product table */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-card aspect-[3/4]" />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border/20">
          {/* Table header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-border/20">
            <div className="w-10" />
            <p className="text-[9px] tracking-[0.2em] uppercase text-foreground/25">Product</p>
            <p className="text-[9px] tracking-[0.2em] uppercase text-foreground/25 w-24 text-right">Price</p>
            <p className="text-[9px] tracking-[0.2em] uppercase text-foreground/25 w-20 text-center">Category</p>
            <div className="w-16" />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/20">No products found</p>
            </div>
          ) : (
            <div className="divide-y divide-border/10">
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3.5 items-center hover:bg-foreground/2 transition-colors"
                >
                  {/* Image */}
                  <div className="w-10 h-12 bg-background overflow-hidden flex-shrink-0">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-border/20" />
                    )}
                  </div>

                  {/* Name */}
                  <div className="min-w-0">
                    <p className="text-xs text-foreground/75 font-medium truncate">{product.name}</p>
                    <p className="text-[10px] text-foreground/30 mt-0.5 truncate">
                      {product.subcategory || product.category}
                      {!product.in_stock && (
                        <span className="ml-2 text-red-400/60">· Out of stock</span>
                      )}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="w-24 text-right">
                    <p className="text-xs text-foreground/60 font-light">₹{product.price?.toLocaleString()}</p>
                    {product.original_price > product.price && (
                      <p className="text-[10px] text-foreground/25 line-through">₹{product.original_price?.toLocaleString()}</p>
                    )}
                  </div>

                  {/* Category badge */}
                  <div className="w-20 text-center">
                    <span className="text-[9px] tracking-[0.08em] uppercase text-foreground/30 border border-border/30 px-2 py-0.5">
                      {product.category}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="w-16 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(product)}
                      className="text-foreground/25 hover:text-foreground/70 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deleting === product.id}
                      className="text-foreground/25 hover:text-red-400/70 transition-colors disabled:opacity-40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product form modal */}
      <AnimatePresence>
        {formOpen && (
          <ProductForm
            product={editing}
            onClose={() => { setFormOpen(false); setEditing(null); }}
            onSaved={() => {
              queryClient.invalidateQueries({ queryKey: ["products"] });
              setFormOpen(false);
              setEditing(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}