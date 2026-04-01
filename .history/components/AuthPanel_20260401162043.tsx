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
    const { error } = await supabase!.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <div style={{ maxWidth: 340, margin: "0 auto", padding: "48px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
        <button onClick={() => setTab("signin")}
          style={{ fontWeight: tab === "signin" ? 700 : 400, fontSize: 18, border: "none", background: "none", color: tab === "signin" ? "#111" : "#888", cursor: "pointer", padding: 0, borderBottom: tab === "signin" ? "2px solid #222" : "2px solid transparent" }}>
          Sign in
        </button>