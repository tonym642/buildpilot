"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthPanel({ onSignedIn }: { onSignedIn?: () => void }) {
  const [tab, setTab] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!supabase) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }
    const { error } = await supabase!.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else if (onSignedIn) {
      onSignedIn();
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase!.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase!.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  if (!supabase) {
    return (
      <div style={{ maxWidth: 340, margin: "0 auto", padding: "48px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ color: "#444", fontSize: 15, textAlign: "center", lineHeight: 1.7 }}>
          No account required in this mode.
        </div>
        <button
          onClick={() => onSignedIn?.()}
          style={{ background: "#222", color: "#fff", border: "none", borderRadius: 10, padding: "12px 32px", fontSize: 15, fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 340, margin: "0 auto", padding: "48px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
        <button onClick={() => setTab("signin")}
          style={{ fontWeight: tab === "signin" ? 700 : 400, fontSize: 18, border: "none", background: "none", color: tab === "signin" ? "#111" : "#888", cursor: "pointer", padding: 0, borderBottom: tab === "signin" ? "2px solid #222" : "2px solid transparent" }}>
          Sign in
        </button>
        <button onClick={() => setTab("signup")}
          style={{ fontWeight: tab === "signup" ? 700 : 400, fontSize: 18, border: "none", background: "none", color: tab === "signup" ? "#111" : "#888", cursor: "pointer", padding: 0, borderBottom: tab === "signup" ? "2px solid #222" : "2px solid transparent" }}>
          Sign up
        </button>
      </div>
      {tab === "signup" && sent ? (
        <div style={{ color: "#444", fontSize: 15, textAlign: "center", lineHeight: 1.7 }}>
          Check your email to confirm your account.<br />
          <span style={{ color: "#888", fontSize: 13 }}>You may close this tab after confirming.</span>
        </div>
      ) : tab === "forgot" && sent ? (
        <div style={{ color: "#444", fontSize: 15, textAlign: "center", lineHeight: 1.7 }}>
          Check your email for a password reset link.<br />
          <span style={{ color: "#888", fontSize: 13 }}>Follow the instructions to reset your password.</span>
        </div>
      ) : (
        <form onSubmit={tab === "signin" ? handleSignIn : tab === "signup" ? handleSignUp : handleForgotPassword} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
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
          {tab !== "forgot" && (
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
          )}
          <button
            type="submit"
            disabled={loading || !email || (tab !== "forgot" && !password)}
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
            {loading
              ? (tab === "signin" ? "Signing in..." : tab === "signup" ? "Signing up..." : "Sending...")
              : (tab === "signin" ? "Sign In" : tab === "signup" ? "Sign Up" : "Send Reset Link")}
          </button>
          {tab === "signin" && (
            <button type="button" onClick={() => { setTab("forgot"); setError(null); setSent(false); }} style={{ background: "none", border: "none", color: "#888", fontSize: 13, marginTop: 2, cursor: "pointer", textAlign: "left", padding: 0, alignSelf: "flex-start" }}>
              Forgot password?
            </button>
          )}
          {(tab === "forgot" || tab === "signup") && (
            <button type="button" onClick={() => { setTab("signin"); setError(null); setSent(false); }} style={{ background: "none", border: "none", color: "#888", fontSize: 13, marginTop: 2, cursor: "pointer", textAlign: "left", padding: 0, alignSelf: "flex-start" }}>
              Back to sign in
            </button>
          )}
          {error && <div style={{ color: "#c00", fontSize: 13, marginTop: 4 }}>{error}</div>}
        </form>
      )}
    </div>
  );
}