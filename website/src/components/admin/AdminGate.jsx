import React, { useState } from "react";

const ADMIN_EMAIL = "yugen7953@gmail.com";
const ADMIN_PASSWORD = "Yugen@Admin2024";
const SESSION_KEY = "yugen_admin_auth";

export default function AdminGate({ children }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "true");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = (e) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setAuthed(true);
    } else {
      setError("Invalid email or password.");
    }
  };

  if (authed) return children;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="text-xl font-semibold tracking-[0.2em] uppercase text-foreground">Yūgen</span>
          <p className="text-[9px] tracking-[0.3em] uppercase text-foreground/30 mt-2">Admin Access</p>
        </div>

        <form onSubmit={login} className="space-y-4">
          <div>
            <label className="block text-[9px] tracking-[0.2em] uppercase text-foreground/30 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@email.com"
              className="w-full bg-card border border-border/30 px-3 py-3 text-xs text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/40 transition-colors"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-[9px] tracking-[0.2em] uppercase text-foreground/30 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-card border border-border/30 px-3 py-3 text-xs text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/40 transition-colors"
            />
          </div>

          {error && (
            <p className="text-[10px] text-destructive/70 tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-foreground text-background text-[10px] font-medium tracking-[0.2em] uppercase hover:bg-foreground/85 transition-colors mt-2"
          >
            Enter
          </button>
        </form>

        <p className="text-center mt-6 text-[9px] text-foreground/15 tracking-wide">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}