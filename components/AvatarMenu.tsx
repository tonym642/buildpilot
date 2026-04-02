"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { C } from "../lib/constants";

interface AvatarMenuProps {
  session: any;
  onSignOut: () => void;
}

export default function AvatarMenu({ session, onSignOut }: AvatarMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const email: string = session?.user?.email ?? "";
  const userId: string = session?.user?.id ?? "";

  const [fullName, setFullName] = useState<string>(session?.user?.user_metadata?.full_name ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(session?.user?.user_metadata?.avatar_url ?? null);

  // Fetch fresh profile data from profiles table so photo + name reflect latest saves
  useEffect(() => {
    if (!supabase || !userId) return;
    supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", userId)
      .single()
      .then(({ data }) => {
        if (data?.full_name) setFullName(data.full_name);
        if (data?.avatar_url) setAvatarUrl(data.avatar_url);
      });
  }, [userId]);

  // Re-fetch when user navigates back to this page (focus event)
  useEffect(() => {
    if (!supabase || !userId) return;
    function refresh() {
      supabase!
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", userId)
        .single()
        .then(({ data }) => {
          if (data?.full_name) setFullName(data.full_name);
          if (data?.avatar_url) setAvatarUrl(data.avatar_url);
        });
    }
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [userId]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const displayName = fullName || email;
  const initial = displayName ? displayName[0].toUpperCase() : "U";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="User menu"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: avatarUrl ? "transparent" : C.accent,
          color: "#fff",
          border: avatarUrl ? `2px solid ${C.border}` : "none",
          fontSize: 15,
          fontWeight: 700,
          fontFamily: C.font,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          overflow: "hidden",
          padding: 0,
        }}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: 46,
          right: 0,
          background: C.panelBg,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          boxShadow: C.shadowMd,
          minWidth: 196,
          zIndex: 100,
          overflow: "hidden",
        }}>
          <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${C.borderSub}` }}>
            {fullName && (
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>{fullName}</div>
            )}
            {email && (
              <div style={{ fontSize: 12, color: C.muted }}>{email}</div>
            )}
          </div>
          <button
            onClick={() => { setOpen(false); router.push("/profile"); }}
            style={menuItemStyle}
            onMouseEnter={e => (e.currentTarget.style.background = C.surface)}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            Profile
          </button>
          <button
            onClick={() => { setOpen(false); onSignOut(); }}
            style={{ ...menuItemStyle, color: C.error }}
            onMouseEnter={e => (e.currentTarget.style.background = C.errorBg)}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

const menuItemStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  background: "transparent",
  border: "none",
  textAlign: "left",
  padding: "11px 16px",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  color: C.text,
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  transition: "background 0.15s",
};
