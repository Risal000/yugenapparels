import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronLeft, Plus, Minus } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import ColorSelector from "@/components/product/ColorSelector";
import { buildWhatsAppURL, productOrderMessage } from "@/lib/whatsapp";
import { Products, CartItems, WishlistItems } from "@/lib/db";

export default function ProductDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [descOpen, setDescOpen] = useState(true);

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => Products.list("-created_at", 100),
  });

  const product = products.find((p) => p.id === id);
  const relatedProducts = products.filter((p) => p.id !== id && p.category === product?.category).slice(0, 4);

  useEffect(() => {
    if (product?.color_variants?.length > 0) {
      const firstAvailable = product.color_variants.find((v) => v.in_stock !== false) || product.color_variants[0];
      setSelectedColor(firstAvailable);
      setActiveImage(0);
    } else {
      setSelectedColor(null);
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="pt-32 text-center min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border border-foreground/10 border-t-foreground/30 rounded-full animate-spin" />
      </div>
    );
  }

  const baseImages = [product.image_url, product.hover_image_url].filter(Boolean);
  const variantImages = selectedColor ? [selectedColor.image_url, selectedColor.hover_image_url].filter(Boolean) : [];
  const images = variantImages.length > 0 ? variantImages : baseImages;

  const handleColorChange = (variant) => { setSelectedColor(variant); setActiveImage(0); };

  const addToCart = async () => {
    setAddingToCart(true);
    await CartItems.create({
      product_id: product.id,
      product_name: product.name + (selectedColor ? ` — ${selectedColor.name}` : ""),
      product_image: (selectedColor?.image_url) || product.image_url,
      price: product.price,
      size: selectedSize || "",
      quantity: 1,
    });
    queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    setAddingToCart(false);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const addToWishlist = async () => {
    await WishlistItems.create({
      product_id: product.id,
      product_name: product.name,
      product_image: product.image_url,
      price: product.price,
    });
    queryClient.invalidateQueries({ queryKey: ["wishlistItems"] });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-16 pt-[80px] pb-6">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-foreground/25 hover:text-foreground/50 transition-colors duration-300 group">
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-300" />Back
        </button>
      </div>

      <div className="max-w-[1500px] mx-auto px-6 lg:px-16 pb-24">
        <div className="lg:grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] lg:gap-16 xl:gap-24">
          <div>
            <div className="aspect-[3/4] lg:aspect-[4/5] overflow-hidden bg-card relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${selectedColor?.name || "base"}-${activeImage}`}
                  src={images[activeImage]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                  className="w-full h-full object-cover absolute inset-0"
                />
              </AnimatePresence>
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} className={`w-16 h-20 lg:w-20 lg:h-24 overflow-hidden transition-all duration-300 ${activeImage === i ? "ring-1 ring-foreground/40 opacity-100" : "opacity-40 hover:opacity-70"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-10 lg:mt-0">
            <div className="lg:sticky lg:top-28">
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}>
                <p className="text-[9px] tracking-[0.35em] uppercase text-foreground/25 mb-5 font-light">{product.category?.replace(/_/g, " ")}</p>
                <h1 className="text-2xl lg:text-3xl font-light tracking-[-0.01em] text-foreground/90 leading-tight mb-5">{product.name}</h1>
                <div className="flex items-center gap-3 mb-10">
                  <span className="text-base font-light text-foreground/70 tracking-wide">₹{product.price?.toLocaleString()}</span>
                  {product.original_price && product.original_price > product.price && (
                    <>
                      <span className="text-sm text-foreground/20 line-through font-light">₹{product.original_price?.toLocaleString()}</span>
                      <span className="text-[9px] tracking-[0.1em] uppercase text-foreground/40 bg-foreground/8 px-2 py-0.5 border border-foreground/10">Sale</span>
                    </>
                  )}
                </div>
                <div className="h-px bg-foreground/8 mb-8" />
                <ColorSelector variants={product.color_variants} selectedColor={selectedColor} onChange={handleColorChange} />
                {product.sizes?.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[9px] tracking-[0.25em] uppercase text-foreground/30 font-light">Select Size</p>
                      <button className="text-[9px] tracking-[0.15em] uppercase text-foreground/20 hover:text-foreground/40 transition-colors underline underline-offset-2">Size Guide</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button key={size} onClick={() => setSelectedSize(size)} className={`min-w-[52px] h-11 px-3 text-[10px] tracking-[0.1em] border transition-all duration-250 ${selectedSize === size ? "border-foreground/60 text-foreground bg-foreground/5" : "border-border/30 text-foreground/30 hover:border-foreground/25 hover:text-foreground/55"}`}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-2.5 mb-10">
                  <button onClick={addToCart} disabled={addingToCart} className={`w-full py-4 text-[10px] font-medium tracking-[0.2em] uppercase transition-all duration-400 ${addedToCart ? "bg-foreground/10 text-foreground/60 border border-foreground/20" : "bg-foreground text-background hover:bg-foreground/85"} disabled:opacity-40`}>
                    {addingToCart ? "Adding..." : addedToCart ? "Added to Cart ✓" : "Add to Cart"}
                  </button>
                  <a href={buildWhatsAppURL(productOrderMessage({ name: product.name, price: product.price, size: selectedSize, id: product.id }))} target="_blank" rel="noopener noreferrer" className="w-full py-4 bg-green-600 hover:bg-green-500 text-white text-[10px] font-medium tracking-[0.2em] uppercase transition-all duration-400 flex items-center justify-center gap-2.5">
                    Buy Now
                  </a>
                  <button onClick={addToWishlist} className="w-full py-4 border border-border/25 text-foreground/35 text-[10px] font-light tracking-[0.2em] uppercase hover:border-foreground/35 hover:text-foreground/60 transition-all duration-400 flex items-center justify-center gap-2.5">
                    <Heart className="w-3.5 h-3.5" />Save to Wishlist
                  </button>
                </div>
                <div className="h-px bg-foreground/8 mb-6" />
                {product.description && (
                  <div>
                    <button onClick={() => setDescOpen(!descOpen)} className="flex items-center justify-between w-full py-2 group">
                      <p className="text-[9px] tracking-[0.25em] uppercase text-foreground/30 font-light group-hover:text-foreground/50 transition-colors duration-300">Description</p>
                      <span className="text-foreground/20 group-hover:text-foreground/40 transition-colors text-sm">
                        {descOpen ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      </span>
                    </button>
                    <AnimatePresence>
                      {descOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                          <p className="text-xs leading-[2] text-foreground/35 font-light pt-4 pb-2">{product.description}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                <div className="mt-8 pt-6 border-t border-foreground/8">
                  <p className="text-[9px] tracking-[0.15em] uppercase text-foreground/20 font-light">Free shipping on orders above ₹2,999</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-28 lg:mt-40 pt-16 border-t border-foreground/8">
            <div className="flex items-center gap-5 mb-12 lg:mb-16">
              <div className="h-px w-8 bg-foreground/20" />
              <h2 className="text-[10px] tracking-[0.35em] uppercase text-foreground/30 font-light">You May Also Like</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
              {relatedProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
