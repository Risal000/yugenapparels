import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "How do I place an order?",
    a: "Browse our collection, select your size, and click 'Buy Now' to order directly via WhatsApp. Our team will confirm availability and payment details.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI, bank transfer, and cash on delivery (COD) for select pincodes. Payment details are shared via WhatsApp upon order confirmation.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 5–7 business days across India. Orders are dispatched within 2–4 business days of confirmation.",
  },
  {
    q: "Can I exchange my size?",
    a: "Yes! Size exchanges are accepted within 7 days of delivery for unused items with tags intact. Contact us via WhatsApp to initiate.",
  },
  {
    q: "Are the products authentic / original?",
    a: "All Yūgen Apparels products are original and in-house designed. Thrift/Surplus items are carefully sourced and quality-checked.",
  },
];

const INFO_CONTENT = {
  "About Us": "Yūgen Apparels is a premium streetwear brand born from the philosophy of minimalism and depth. We craft clothing for those who find beauty in the understated — pieces that speak without shouting.",
  "Size Guide": "XS: Chest 34–36\" | S: Chest 36–38\" | M: Chest 38–40\" | L: Chest 40–42\" | XL: Chest 42–44\" | XXL: Chest 44–46\". All measurements in inches. When in doubt, size up.",
  "Shipping": "Orders are dispatched within 2–4 business days. Standard delivery: 5–7 business days across India. Express delivery available at checkout. Free shipping on orders above ₹2,999.",
  "Returns": "We accept returns within 7 days of delivery for unused, unwashed items with original tags. Sale and limited-drop items are final sale. Raise a return request via WhatsApp or email.",
};

const CONNECT_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/yugen_apparels?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
  { label: "WhatsApp", href: "https://wa.me/917356642955" },
  { label: "Gmail", href: "mailto:yugen7953@gmail.com" },
];

const SHOP_LINKS = [
  { label: "New Arrivals", to: "/shop/tops" },
  { label: "Essentials", to: "/shop/essentials" },
  { label: "Anime", to: "/shop/anime" },
  { label: "Accessories", to: "/shop/accessories" },
];

export default function Footer() {
  const [openInfo, setOpenInfo] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <footer className="border-t border-border/30 bg-background">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        {/* Main columns */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <span className="text-lg font-semibold tracking-[0.15em] uppercase text-foreground">
                Yūgen
              </span>
              <p className="mt-4 text-xs leading-relaxed text-foreground/30 tracking-wide max-w-[240px]">
                Minimal. Meaningful. Streetwear that speaks in silence.
              </p>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-[10px] font-medium tracking-[0.2em] uppercase text-foreground/40 mb-5">Shop</h4>
              <ul className="space-y-3">
                {SHOP_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-xs tracking-wide text-foreground/30 hover:text-foreground transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info */}
            <div>
              <h4 className="text-[10px] font-medium tracking-[0.2em] uppercase text-foreground/40 mb-5">Info</h4>
              <ul className="space-y-3">
                {Object.entries(INFO_CONTENT).map(([label, content]) => (
                  <li key={label}>
                    <button
                      onClick={() => setOpenInfo(openInfo === label ? null : label)}
                      className="text-xs tracking-wide text-foreground/30 hover:text-foreground transition-colors duration-300 text-left"
                    >
                      {label}
                    </button>
                    {openInfo === label && (
                      <p className="mt-2 text-[10px] leading-relaxed text-foreground/20 max-w-[220px]">
                        {content}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-[10px] font-medium tracking-[0.2em] uppercase text-foreground/40 mb-5">Connect</h4>
              <ul className="space-y-3">
                {CONNECT_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs tracking-wide text-foreground/30 hover:text-foreground transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="border-t border-border/20 py-12 lg:py-16">
          <h3 className="text-[10px] font-medium tracking-[0.3em] uppercase text-foreground/40 mb-8">
            Frequently Asked Questions
          </h3>
          <div className="max-w-2xl space-y-0 divide-y divide-border/15">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex items-center justify-between w-full py-4 text-left group"
                >
                  <span className="text-xs tracking-wide text-foreground/50 group-hover:text-foreground/80 transition-colors pr-6">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-foreground/25 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <p className="pb-4 text-[11px] leading-relaxed text-foreground/30 font-light">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/20 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] tracking-[0.1em] text-foreground/20 uppercase">
            © 2026 Yūgen Apparels. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] tracking-[0.1em] text-foreground/20 uppercase">Privacy Policy</span>
            <span className="text-[10px] tracking-[0.1em] text-foreground/20 uppercase">Terms of Service</span>
            <Link to="/admin" className="text-[10px] tracking-[0.1em] text-foreground/15 uppercase hover:text-foreground/35 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}