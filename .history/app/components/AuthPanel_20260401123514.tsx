"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthPanel({ onSignedIn }: { onSignedIn?: () => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <div style={{ maxWidth: 340, margin: "0 auto", padding: "48px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 18, letterSpacing: "-0.01em" }}>Sign in</div>
      {sent ? (
        <div style={{ color: "#444", fontSize: 15, textAlign: "center", lineHeight: 1.7 }}>
          Check your email for a magic link.<br />
          <span style={{ color: "#888", fontSize: 13 }}>You may close this tab after signing in.</span>
        </div>
      ) : (
        <form onSubmit={handleSignIn} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              fontSize: 15,
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #e0e0e0",
              outline: "none",
              fontFamily: "inherit",
              background: "#fafafa"
            }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !email}
            style={{
              background: "#222",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "12px 0",
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </button>
          {error && <div style={{ color: "#c00", fontSize: 13, marginTop: 4 }}>{error}</div>}
        </form>
      )}
    </div>
  );
}