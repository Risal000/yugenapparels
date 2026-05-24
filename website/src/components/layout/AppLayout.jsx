import db from '@/api/base44Client';

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Header from "./Header";
import Footer from "./Footer.jsx";
import CartDrawer from "./CartDrawer";
import SearchOverlay from "./SearchOverlay";

export default function AppLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { data: cartItems = [] } = useQuery({
    queryKey: ["cartItems"],
    queryFn: () => db.entities.CartItem.list(),
  });

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartCount={cartItems.reduce((sum, i) => sum + (i.quantity || 1), 0)}
        onCartOpen={() => setCartOpen(true)}
        onSearchOpen={() => setSearchOpen(true)}
      />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
      />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}