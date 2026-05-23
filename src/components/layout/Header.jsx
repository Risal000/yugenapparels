import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Heart, Menu, X, ChevronDown } from "lucide-react";
import { NAVIGATION } from "@/lib/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({ cartCount = 0, onCartOpen, onSearchOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const timeoutRef = useRef(null);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const tapCount = React.useRef(0);
  const tapTimer = React.useRef(null);

  const handleLogoTap = (e) => {
    tapCount.current += 1;
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 600);
    if (tapCount.current >= 3) {
      tapCount.current = 0;
      window.location.href = "/admin";
    }
  };

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (slug) => {
    clearTimeout(timeoutRef.current);
    setActiveDropdown(slug);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 180);
  };

  const headerBg = scrolled
    ? "bg-background/90 backdrop-blur-2xl border-b border-white/5"
    : isHome
    ? "bg-transparent"
    : "bg-background/90 backdrop-blur-2xl border-b border-white/5";

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${headerBg}`}>
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
          <div className="flex items-center h-16 lg:h-[72px]">

            {/* Left: mobile hamburger / desktop nav */}
            <div className="flex-1 flex items-center">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden text-foreground/70 hover:text-foreground transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Desktop nav — left of logo */}
              <nav className="hidden lg:flex items-center gap-7">
                {NAVIGATION.slice(0, 4).map((item) => (
                  <NavItem
                    key={item.slug}
                    item={item}
                    active={activeDropdown === item.slug}
                    onEnter={handleMouseEnter}
                    onLeave={handleMouseLeave}
                    onClose={() => setActiveDropdown(null)}
                  />
                ))}
              </nav>
            </div>

            {/* Center: Logo */}
            <Link
              to="/"
              className="flex-shrink-0 mx-6 lg:mx-10"
              onClick={handleLogoTap}
            >
              <span className="text-base lg:text-lg font-semibold tracking-[0.2em] uppercase text-foreground">
                Yūgen
              </span>
            </Link>

            {/* Right: remaining nav + icons */}
            <div className="flex-1 flex items-center justify-end gap-7">
              {/* Right desktop nav */}
              <nav className="hidden lg:flex items-center gap-7 mr-6">
                {NAVIGATION.slice(4).map((item) => (
                  <NavItem
                    key={item.slug}
                    item={item}
                    active={activeDropdown === item.slug}
                    onEnter={handleMouseEnter}
                    onLeave={handleMouseLeave}
                    onClose={() => setActiveDropdown(null)}
                  />
                ))}
              </nav>

              {/* Icons */}
              <button
                onClick={onSearchOpen}
                className="text-foreground/50 hover:text-foreground transition-colors duration-300"
                aria-label="Search"
              >
                <Search className="w-[17px] h-[17px]" />
              </button>
              <Link
                to="/wishlist"
                className="text-foreground/50 hover:text-foreground transition-colors duration-300 hidden sm:block"
                aria-label="Wishlist"
              >
                <Heart className="w-[17px] h-[17px]" />
              </Link>
              <button
                onClick={onCartOpen}
                className="text-foreground/50 hover:text-foreground transition-colors duration-300 relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-[17px] h-[17px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-foreground text-background text-[8px] font-semibold flex items-center justify-center rounded-none">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-40 bg-background lg:hidden overflow-y-auto"
          >
            {/* Mobile header bar */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-border/20">
              <Link to="/" onClick={() => setMobileOpen(false)}>
                <span className="text-base font-semibold tracking-[0.2em] uppercase text-foreground">
                  Yūgen
                </span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="text-foreground/50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-6">
              {NAVIGATION.map((item, i) => (
                <motion.div
                  key={item.slug}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="border-b border-border/15"
                >
                  <button
                    onClick={() =>
                      setMobileExpanded(mobileExpanded === item.slug ? null : item.slug)
                    }
                    className="flex items-center justify-between w-full py-4"
                  >
                    <span className="text-sm font-light tracking-[0.12em] uppercase text-foreground/75">
                      {item.label}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-foreground/30 transition-transform duration-300 ${
                        mobileExpanded === item.slug ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileExpanded === item.slug && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 pl-3 space-y-3">
                          {item.subcategories.map((sub) => (
                            <Link
                              key={sub.slug}
                              to={`/shop/${item.slug}/${sub.slug}`}
                              className="block text-[11px] tracking-[0.1em] uppercase text-foreground/35 hover:text-foreground/70 transition-colors"
                              onClick={() => setMobileOpen(false)}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              <div className="mt-8 pt-4 flex items-center gap-6">
                <Link
                  to="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-foreground/40 hover:text-foreground/70 transition-colors"
                >
                  <Heart className="w-4 h-4" /> Wishlist
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({ item, active, onEnter, onLeave, onClose }) {
  return (
    <div
      className="relative"
      onMouseEnter={() => onEnter(item.slug)}
      onMouseLeave={onLeave}
    >
      <Link
        to={`/shop/${item.slug}`}
        className={`text-[10px] font-light tracking-[0.15em] uppercase transition-colors duration-300 py-7 block ${
          active ? "text-foreground" : "text-foreground/45 hover:text-foreground/80"
        }`}
      >
        {item.label}
      </Link>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-0"
            onMouseEnter={() => onEnter(item.slug)}
            onMouseLeave={onLeave}
          >
            <div className="bg-background/98 backdrop-blur-2xl border border-white/8 shadow-2xl py-5 px-5 min-w-[190px]">
              {item.subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  to={`/shop/${item.slug}/${sub.slug}`}
                  className="block py-1.5 text-[10px] tracking-[0.1em] uppercase text-foreground/40 hover:text-foreground/85 transition-colors duration-200"
                  onClick={onClose}
                >
                  {sub.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}