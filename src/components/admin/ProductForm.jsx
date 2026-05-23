import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Products } from "@/lib/db";
import { supabase } from "@/lib/supabase";

const CATEGORIES = ["tops", "bottoms", "activewear", "footwear", "accessories", "essentials", "anime", "thrift-surplus"];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
const TAG_OPTIONS = ["new_arrival", "trending", "limited_drop", "featured"];

const EMPTY = {
  name: "", price: "", original_price: "", category: "tops", subcategory: "",
  description: "", image_url: "", hover_image_url: "", sizes: [], tags: [], in_stock: true,
};

async function uploadImage(file) {
  const ext = file.name.split(".").pop();
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

function ImageUploadField({ label, url, onUrl }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploadedUrl = await uploadImage(file);
      onUrl(uploadedUrl);
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
    setUploading(false);
  };

  return (
    <div>
      <label className="block text-[9px] tracking-[0.2em] uppercase text-foreground/30 mb-2 font-light">{label}</label>
      <div className="space-y-2">
        {url && <img src={url} alt="" className="w-24 h-28 object-cover border border-border/30" />}
        <div className="flex gap-2 items-center">
          <input
            value={url}
            onChange={(e) => onUrl(e.target.value)}
            placeholder="Paste image URL..."
            className={inputCls + " flex-1"}
          />
          <label className="cursor-pointer px-3 py-2.5 border border-border/30 text-[10px] text-foreground/40 hover:border-foreground/40 hover:text-foreground/60 transition-colors whitespace-nowrap">
            {uploading ? "Uploading..." : "Upload"}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
          </label>
        </div>
      </div>
    </div>
  );
}

export default function ProductForm({ product, onClose, onSaved }) {
  const [form, setForm] = useState(product ? {
    ...product,
    price: product.price ?? "",
    original_price: product.original_price ?? "",
  } : { ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [colorVariants, setColorVariants] = useState(product?.color_variants || []);
  const [colorsOpen, setColorsOpen] = useState(false);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const toggleArr = (key, val) => {
    setForm((f) => ({
      ...f,
      [key]: f[key]?.includes(val) ? f[key].filter((v) => v !== val) : [...(f[key] || []), val],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const data = {
      ...form,
      price: parseFloat(form.price) || 0,
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      color_variants: colorVariants,
    };
    if (product?.id) {
      await Products.update(product.id, data);
    } else {
      await Products.create(data);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
        className="w-full sm:w-[520px] h-full bg-background border-l border-border/30 flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/20">
          <h2 className="text-xs tracking-[0.15em] uppercase text-foreground/60 font-medium">
            {product ? "Edit Product" : "New Product"}
          </h2>
          <button onClick={onClose} className="text-foreground/30 hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <Field label="Product Name *">
            <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Oversized Drop Tee" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (₹) *">
              <input className={inputCls} type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="999" />
            </Field>
            <Field label="Original Price (₹)">
              <input className={inputCls} type="number" value={form.original_price} onChange={(e) => set("original_price", e.target.value)} placeholder="1499" />
            </Field>
          </div>
          <Field label="Category *">
            <select className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </Field>
          <Field label="Subcategory">
            <input className={inputCls} value={form.subcategory} onChange={(e) => set("subcategory", e.target.value)} placeholder="e.g. Oversized T-Shirts" />
          </Field>
          <Field label="Description">
            <textarea className={`${inputCls} h-24 resize-none`} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Short product description..." />
          </Field>
          <ImageUploadField label="Main Image" url={form.image_url} onUrl={(url) => set("image_url", url)} />
          <ImageUploadField label="Hover Image (optional)" url={form.hover_image_url} onUrl={(url) => set("hover_image_url", url)} />
          <Field label="Sizes">
            <div className="flex flex-wrap gap-2 mt-1">
              {SIZE_OPTIONS.map((s) => (
                <button key={s} type="button" onClick={() => toggleArr("sizes", s)} className={`px-3 py-1.5 text-[10px] tracking-wide border transition-colors ${form.sizes?.includes(s) ? "border-foreground/50 text-foreground bg-foreground/8" : "border-border/30 text-foreground/30 hover:border-foreground/30"}`}>{s}</button>
              ))}
            </div>
          </Field>
          <Field label="Tags">
            <div className="flex flex-wrap gap-2 mt-1">
              {TAG_OPTIONS.map((t) => (
                <button key={t} type="button" onClick={() => toggleArr("tags", t)} className={`px-3 py-1.5 text-[10px] tracking-wide border transition-colors ${form.tags?.includes(t) ? "border-foreground/50 text-foreground bg-foreground/8" : "border-border/30 text-foreground/30 hover:border-foreground/30"}`}>{t.replace("_", " ")}</button>
              ))}
            </div>
          </Field>

          {/* Color Variants */}
          <div>
            <button type="button" onClick={() => setColorsOpen(!colorsOpen)} className="flex items-center justify-between w-full text-[9px] tracking-[0.2em] uppercase text-foreground/30 mb-2 font-light hover:text-foreground/50 transition-colors">
              <span>Color Variants ({colorVariants.length})</span>
              {colorsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <AnimatePresence>
              {colorsOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="space-y-3 mb-3">
                    {colorVariants.map((v, i) => (
                      <div key={i} className="bg-card border border-border/20 p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input className={inputCls} placeholder="Color name" value={v.name || ""} onChange={(e) => { const u = [...colorVariants]; u[i] = { ...u[i], name: e.target.value }; setColorVariants(u); }} />
                          <div className="flex items-center gap-2">
                            <input type="color" value={v.hex || "#ffffff"} onChange={(e) => { const u = [...colorVariants]; u[i] = { ...u[i], hex: e.target.value }; setColorVariants(u); }} className="w-10 h-[38px] bg-card border border-border/30 cursor-pointer p-0.5" />
                            <input className={`${inputCls} flex-1`} placeholder="#hex" value={v.hex || ""} onChange={(e) => { const u = [...colorVariants]; u[i] = { ...u[i], hex: e.target.value }; setColorVariants(u); }} />
                          </div>
                        </div>
                        <div>
                          <p className="text-[9px] tracking-[0.15em] uppercase text-foreground/25 mb-1.5">Color Image URL</p>
                          <input className={inputCls} placeholder="Image URL for this color..." value={v.image_url || ""} onChange={(e) => { const u = [...colorVariants]; u[i] = { ...u[i], image_url: e.target.value }; setColorVariants(u); }} />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <button type="button" onClick={() => { const u = [...colorVariants]; u[i] = { ...u[i], in_stock: !(v.in_stock !== false) }; setColorVariants(u); }} className={`w-8 h-4 relative transition-colors ${v.in_stock !== false ? "bg-foreground/40" : "bg-border/40"}`}>
                              <span className={`absolute top-0.5 w-3 h-3 bg-foreground transition-transform ${v.in_stock !== false ? "translate-x-4" : "translate-x-0.5"}`} />
                            </button>
                            <span className="text-[9px] text-foreground/35">{v.in_stock !== false ? "In Stock" : "Out of Stock"}</span>
                          </label>
                          <button type="button" onClick={() => setColorVariants(colorVariants.filter((_, idx) => idx !== i))} className="text-foreground/25 hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => setColorVariants([...colorVariants, { name: "", hex: "#ffffff", image_url: "", in_stock: true }])} className="w-full py-2 border border-dashed border-border/30 text-[9px] tracking-[0.15em] uppercase text-foreground/30 hover:border-foreground/30 hover:text-foreground/50 transition-colors flex items-center justify-center gap-1.5">
                    <Plus className="w-3 h-3" /> Add Color
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Field label="Stock Status">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => set("in_stock", !form.in_stock)} className={`w-10 h-5 transition-colors duration-300 relative ${form.in_stock ? "bg-foreground/40" : "bg-border/40"}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-foreground transition-transform duration-300 ${form.in_stock ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
              <span className="text-xs text-foreground/50">{form.in_stock ? "In Stock" : "Out of Stock"}</span>
            </div>
          </Field>
        </div>

        <div className="border-t border-border/20 px-6 py-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-border/30 text-foreground/40 text-[10px] tracking-[0.15em] uppercase hover:border-foreground/30 hover:text-foreground/60 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.name || !form.price} className="flex-1 py-3 bg-foreground text-background text-[10px] tracking-[0.15em] uppercase hover:bg-foreground/85 transition-colors disabled:opacity-40">
            {saving ? "Saving..." : product ? "Update" : "Create"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[9px] tracking-[0.2em] uppercase text-foreground/30 mb-2 font-light">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-card border border-border/30 px-3 py-2.5 text-xs text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-foreground/40 transition-colors";
