const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppURL } from "@/lib/whatsapp";

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const statusColors = {
  pending: "text-yellow-500/70 border-yellow-500/30 bg-yellow-500/5",
  confirmed: "text-blue-400/70 border-blue-400/30 bg-blue-400/5",
  shipped: "text-purple-400/70 border-purple-400/30 bg-purple-400/5",
  delivered: "text-green-400/70 border-green-400/30 bg-green-400/5",
  cancelled: "text-red-400/70 border-red-400/30 bg-red-400/5",
};

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => db.entities.Order.list("-created_date", 200),
  });

  const filtered = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus);

  const updateStatus = async (id, status) => {
    await db.entities.Order.update(id, { status });
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  };

  const openWhatsApp = (order) => {
    const phone = order.customer_phone?.replace(/\D/g, "");
    if (!phone) return;
    const items = order.items?.map((i) => `• ${i.product_name} (${i.size || "N/A"}) x${i.quantity}`).join("\n") || "";
    const msg = `Hi ${order.customer_name}! 👋\n\nYour Yūgen order has been *${order.status}*.\n\nOrder Summary:\n${items}\n\nTotal: ₹${order.total?.toLocaleString()}\n\nThank you for shopping with Yūgen! 🖤`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-[-0.01em] text-foreground/85">Orders</h1>
        <p className="text-xs text-foreground/30 mt-1 font-light">{orders.length} total orders</p>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`text-[9px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors ${
              filterStatus === s
                ? "border-foreground/50 text-foreground"
                : "border-border/25 text-foreground/30 hover:border-foreground/25 hover:text-foreground/60"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-20 bg-card animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border/20 p-16 text-center">
          <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/20">No orders found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border/20 px-5 py-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-sm text-foreground/75 font-medium">{order.customer_name}</p>
                    <span className={`text-[9px] tracking-[0.08em] uppercase border px-2 py-0.5 ${statusColors[order.status] || ""}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-foreground/35 mb-2">
                    {order.customer_phone && <span className="mr-3">{order.customer_phone}</span>}
                    {order.customer_email && <span>{order.customer_email}</span>}
                  </p>
                  {/* Items */}
                  {order.items?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-1">
                      {order.items.map((item, j) => (
                        <span key={j} className="text-[10px] text-foreground/30 border border-border/20 px-2 py-0.5">
                          {item.product_name} {item.size ? `· ${item.size}` : ""} × {item.quantity}
                        </span>
                      ))}
                    </div>
                  )}
                  {order.notes && (
                    <p className="text-[10px] text-foreground/25 italic mt-1">{order.notes}</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <p className="text-sm font-light text-foreground/70">₹{order.total?.toLocaleString()}</p>

                  <div className="flex items-center gap-2">
                    {/* WhatsApp button */}
                    {order.customer_phone && (
                      <button
                        onClick={() => openWhatsApp(order)}
                        className="flex items-center gap-1.5 text-[9px] tracking-[0.1em] uppercase text-green-400/60 border border-green-400/20 hover:border-green-400/50 hover:text-green-400/90 px-2.5 py-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />
                        WhatsApp
                      </button>
                    )}

                    {/* Status updater */}
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="bg-background border border-border/30 text-foreground/50 text-[10px] tracking-wide px-2 py-1.5 focus:outline-none focus:border-foreground/40"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}