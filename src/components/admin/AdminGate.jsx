import React, { useState } from "react";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "yugen2024";

export default function AdminGate({ children }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("yugen_admin") === "1");
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  if (authed) return children;

  const handleLogin = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("yugen_admin", "1");
      setAuthed(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-sm px-8">
        <div className="mb-10 text-center">
          <span className="text-lg font-semibold tracking-[0.2em] uppercase text-foreground">Yūgen</span>
          <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/30 mt-2">Admin Access</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Enter password"
            autoFocus
            className="w-full bg-card border border-border/30 px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-foreground/40 transition-colors"
          />
          {error && <p className="text-[10px] tracking-[0.1em] uppercase text-red-400/70">Incorrect password</p>}
          <button type="submit" className="w-full py-3 bg-foreground text-background text-[10px] tracking-[0.2em] uppercase hover:bg-foreground/85 transition-colors">
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
