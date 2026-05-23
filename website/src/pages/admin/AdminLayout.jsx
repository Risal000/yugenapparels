import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Menu, X, Tag } from "lucide-react";

import AdminGate from "@/components/admin/AdminGate";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
  { label: "Products", icon: Package, to: "/admin/products" },
  { label: "Orders", icon: ShoppingBag, to: "/admin/orders" },
  { label: "Categories", icon: Tag, to: "/admin/categories" },
  { label: "Settings", icon: Settings, to: "/admin/settings" },
];

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminGate>
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-56 bg-card border-r border-border/30 flex flex-col
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="px-6 py-6 border-b border-border/20 flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground">
            Yūgen
          </Link>
          <span className="text-[8px] tracking-[0.2em] uppercase text-foreground/30 border border-foreground/15 px-1.5 py-0.5">
            Admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-0.5">
          {NAV.map(({ label, icon: Icon, to }) => {
            const active = location.pathname === to || (to !== "/admin" && location.pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.08em] uppercase transition-colors duration-200 ${
                  active
                    ? "bg-foreground/8 text-foreground"
                    : "text-foreground/35 hover:text-foreground/70 hover:bg-foreground/4"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-6 space-y-0.5">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.08em] uppercase text-foreground/25 hover:text-foreground/55 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-14 border-b border-border/20 flex items-center px-6 gap-4 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-foreground/40 hover:text-foreground transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xs tracking-[0.1em] uppercase text-foreground/30 font-light">
            Admin Panel
          </span>
        </div>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
    </AdminGate>
  );
}