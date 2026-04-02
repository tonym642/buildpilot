"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { C } from "../lib/constants";
import GlobalStyles from "./GlobalStyles";

const inputStyle: React.CSSProperties = {
  fontSize: 14,
  padding: "11px 14px",
  borderRadius: 10,
  border: `1px solid ${C.border}`,
  outline: "none",
  fontFamily: "inherit",
  background: C.cardBg,
  color: C.text,
  width: "100%",
  transition: "border 0.15s, box-shadow 0.15s",
};

const primaryBtn: React.CSSProperties = {
  background: C.accent,
  color: "#fff",
  border: "none",
  borderRadius: 12,
  padding: "12px 0",
  fontSize: 14,
  fontWeight: 600,
  fontFamily: "inherit",
  cursor: "pointer",
  width: "100%",
  letterSpacing: "0.01em",
  transition: "background 0.15s",
};

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
    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else if (onSignedIn) onSignedIn();
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

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      color: C.text,
      fontFamily: C.font,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
    }}>
      <GlobalStyles />

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: C.accent,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 18px",
          fontSize: 20, color: "#fff", fontWeight: 700,
          boxShadow: `0 0 0 1px ${C.accentBorder}, ${C.shadow}`,
        }}>â—ˆ</div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em" }}>Build Pilot</div>
        <div style={{ fontSize: 13, color: C.textSub, marginTop: 4 }}>Your calm workspace for building ideas.</div>
      </div>

      <div style={{
        width: 380,
        maxWidth: "100%",
        background: C.panelBg,
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        padding: "32px 28px",
        boxShadow: C.shadowMd,
      }}>
        {!supabase ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div style={{ color: C.textSub, fontSize: 14, textAlign: "center", lineHeight: 1.7 }}>
              No account required in this mode.
            </div>
            <button onClick={() => onSignedIn?.()} style={{ ...primaryBtn, width: "auto", padding: "12px 32px" }}>
              Continue
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 0, marginBottom: 28, borderBottom: `1px solid ${C.border}` }}>
              {(["signin", "signup"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(null); setSent(false); }}
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    borderBottom: `2px solid ${tab === t ? C.accent : "transparent"}`,
                    color: tab === t ? C.text : C.muted,
                    fontSize: 14,
                    fontWeight: tab === t ? 600 : 400,
                    cursor: "pointer",
                    padding: "0 0 14px",
                    marginBottom: -1,
                    transition: "color 0.15s",
                    letterSpacing: "0.01em",
                  }}
                >
                  {t === "signin" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>

            {tab === "signup" && sent ? (
              <div style={{ color: C.textSub, fontSize: 14, textAlign: "center", lineHeight: 1.8 }}>
                Check your email to confirm your account.
                <br />
                <span style={{ color: C.muted, fontSize: 13 }}>You may close this tab after confirming.</span>
              </div>
            ) : tab === "forgot" && sent ? (
              <div style={{ color: C.textSub, fontSize: 14, textAlign: "center", lineHeight: 1.8 }}>
                Check your email for a reset link.
              </div>
            ) : (
              <form
                onSubmit={tab === "signin" ? handleSignIn : tab === "signup" ? handleSignUp : handleForgotPassword}
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                  disabled={loading}
                />
                {tab !== "forgot" && (
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={inputStyle}
                    disabled={loading}
                  />
                )}
                <button
                  type="submit"
                  disabled={loading || !email || (tab !== "forgot" && !password)}
                  style={{ ...primaryBtn, marginTop: 6, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.background = C.accentHover)}
                  onMouseLeave={e => !loading && (e.currentTarget.style.background = C.accent)}
                >
                  {loading
                    ? (tab === "signin" ? "Signing inâ€¦" : tab === "signup" ? "Signing upâ€¦" : "Sendingâ€¦")
                    : (tab === "signin" ? "Sign In" : tab === "signup" ? "Sign Up" : "Send Reset Link")}
                </button>

                {tab === "signin" && (
                  <button
                    type="button"
                    onClick={() => { setTab("forgot"); setError(null); setSent(false); }}
                    style={{ background: "none", border: "none", color: C.muted, fontSize: 13, cursor: "pointer", textAlign: "left", padding: 0, marginTop: 2 }}
                  >
                    Forgot password?
                  </button>
                )}
                {(tab === "forgot" || tab === "signup") && (
                  <button
                    type="button"
                    onClick={() => { setTab("signin"); setError(null); setSent(false); }}
                    style={{ background: "none", border: "none", color: C.muted, fontSize: 13, cursor: "pointer", textAlign: "left", padding: 0, marginTop: 2 }}
                  >
                    â† Back to sign in
                  </button>
                )}
                {error && (
                  <div style={{
                    color: C.error, fontSize: 13, marginTop: 4,
                    padding: "10px 12px", borderRadius: 10,
                    background: C.errorBg,
                    border: `1px solid rgba(217,95,95,0.2)`,
                  }}>
                    {error}
                  </div>
                )}
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
