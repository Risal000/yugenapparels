import React, { useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export default function AdminSettings() {
  const [waNumber, setWaNumber] = useState(
    localStorage.getItem("yugen_wa_number") || WHATSAPP_NUMBER
  );
  const [saved, setSaved] = useState(false);

  const save = () => {
    localStorage.setItem("yugen_wa_number", waNumber);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-[-0.01em] text-foreground/85">Settings</h1>
        <p className="text-xs text-foreground/30 mt-1 font-light">Store configuration</p>
      </div>
      <div className="max-w-lg space-y-8">
        <div className="bg-card border border-border/25 p-6">
          <h2 className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 font-light mb-5">WhatsApp Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[9px] tracking-[0.2em] uppercase text-foreground/30 mb-2">WhatsApp Business Number</label>
              <input value={waNumber} onChange={(e) => setWaNumber(e.target.value)} placeholder="919999999999" className="w-full bg-background border border-border/30 px-3 py-2.5 text-xs text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-foreground/40 transition-colors" />
              <p className="text-[10px] text-foreground/25 mt-2">Include country code without +. Example: 919876543210 for India</p>
            </div>
            <button onClick={save} className="px-6 py-2.5 bg-foreground text-background text-[10px] tracking-[0.15em] uppercase hover:bg-foreground/85 transition-colors">
              {saved ? "Saved ✓" : "Save Settings"}
            </button>
          </div>
        </div>
        <div className="bg-card border border-border/25 p-6">
          <h2 className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 font-light mb-4">Store Info</h2>
          <div className="space-y-2 text-xs text-foreground/40 font-light">
            <p>Brand: <span className="text-foreground/60">Yūgen Apparels</span></p>
            <p>Currency: <span className="text-foreground/60">INR (₹)</span></p>
            <p>Platform: <span className="text-foreground/60">Supabase + Vercel</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
