const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React from "react";
import { useQuery } from "@tanstack/react-query";

import { motion } from "framer-motion";
import { Package, ShoppingBag, Heart, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => db.entities.Product.list(),
  });
  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () => db.entities.Order.list("-created_date", 20),
  });
  const { data: wishlistItems = [] } = useQuery({
    queryKey: ["wishlistItems"],
    queryFn: () => db.entities.WishlistItem.list(),
  });

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + (o.total || 0), 0);

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, to: "/admin/products" },
    { label: "Total Orders", value: orders.length, icon: ShoppingBag, to: "/admin/orders" },
    { label: "Wishlist Saves", value: wishlistItems.length, icon: Heart, to: "#" },
    { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, to: "#" },
  ];

  const recentOrders = orders.slice(0, 5);

  const statusColors = {
    pending: "text-yellow-500/70 border-yellow-500/30",
    confirmed: "text-blue-400/70 border-blue-400/30",
    shipped: "text-purple-400/70 border-purple-400/30",
    delivered: "text-green-400/70 border-green-400/30",
    cancelled: "text-red-400/70 border-red-400/30",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-[-0.01em] text-foreground/85">Dashboard</h1>
        <p className="text-xs text-foreground/30 mt-1 tracking-wide font-light">Welcome back, here's what's happening.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, to }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link to={to} className="block bg-card border border-border/30 p-5 hover:border-border/60 transition-colors duration-300">
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-4 h-4 text-foreground/30" />
              </div>
              <p className="text-2xl font-light text-foreground/80 mb-1">{value}</p>
              <p className="text-[10px] tracking-[0.1em] uppercase text-foreground/30 font-light">{label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[10px] tracking-[0.25em] uppercase text-foreground/40 font-light">Recent Orders</h2>
          <Link to="/admin/orders" className="text-[10px] tracking-[0.15em] uppercase text-foreground/25 hover:text-foreground/55 transition-colors">
            View All →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="bg-card border border-border/20 p-10 text-center">
            <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/20">No orders yet</p>
          </div>
        ) : (
          <div className="bg-card border border-border/20 divide-y divide-border/15">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-xs text-foreground/70 font-medium">{order.customer_name}</p>
                  <p className="text-[10px] text-foreground/30 mt-0.5">
                    {order.customer_phone || order.customer_email || "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-foreground/60 font-light">₹{order.total?.toLocaleString()}</p>
                  <span className={`text-[9px] tracking-[0.1em] uppercase border px-2 py-0.5 mt-1 inline-block ${statusColors[order.status] || "text-foreground/30 border-border/30"}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}