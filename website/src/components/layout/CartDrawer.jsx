const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React from "react";
import { X, Minus, Plus, ShoppingBag, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useQueryClient } from "@tanstack/react-query";
import { buildWhatsAppURL, cartOrderMessage } from "@/lib/whatsapp";

export default function CartDrawer({ isOpen, onClose, cartItems = [] }) {
  const queryClient = useQueryClient();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateQuantity = async (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      await db.entities.CartItem.delete(item.id);
    } else {
      await db.entities.CartItem.update(item.id, { quantity: newQty });
    }
    queryClient.invalidateQueries({ queryKey: ["cartItems"] });
  };

  const removeItem = async (item) => {
    await db.entities.CartItem.delete(item.id);
    queryClient.invalidateQueries({ queryKey: ["cartItems"] });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-background border-l border-border/30 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/20">
              <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-foreground/60">
                Cart ({cartItems.length})
              </span>
              <button
                onClick={onClose}
                className="text-foreground/40 hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-10 h-10 text-foreground/10 mb-4" />
                  <p className="text-xs tracking-[0.1em] uppercase text-foreground/30">
                    Your cart is empty
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4"
                    >
                      {item.product_image && (
                        <div className="w-20 h-24 bg-card flex-shrink-0 overflow-hidden">
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium tracking-wide text-foreground/80 truncate">
                          {item.product_name}
                        </h4>
                        {item.size && (
                          <p className="text-[10px] tracking-[0.1em] uppercase text-foreground/30 mt-1">
                            Size: {item.size}
                          </p>
                        )}
                        <p className="text-xs font-medium text-foreground/60 mt-1">
                          ₹{item.price?.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => updateQuantity(item, -1)}
                            className="w-6 h-6 border border-border/40 flex items-center justify-center text-foreground/40 hover:text-foreground hover:border-foreground/40 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs text-foreground/60 w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item, 1)}
                            className="w-6 h-6 border border-border/40 flex items-center justify-center text-foreground/40 hover:text-foreground hover:border-foreground/40 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item)}
                            className="ml-auto text-foreground/20 hover:text-foreground/60 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-border/20 px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-[0.15em] uppercase text-foreground/40">
                    Total
                  </span>
                  <span className="text-sm font-medium tracking-wide text-foreground">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
                <button className="w-full py-4 bg-foreground text-background text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-foreground/90 transition-colors duration-300">
                  Checkout
                </button>
                <a
                  href={buildWhatsAppURL(cartOrderMessage(cartItems))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 border border-green-500/25 text-green-400/70 text-[10px] font-light tracking-[0.15em] uppercase hover:border-green-500/45 hover:text-green-400/90 hover:bg-green-500/5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Order via WhatsApp
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}