"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  const initial = email ? email[0].toUpperCase() : "U";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="User menu"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: C.accent,
          color: "#fff",
          border: "none",
          fontSize: 15,
          fontWeight: 700,
          fontFamily: C.font,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {initial}
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: 44,
          right: 0,
          background: C.panelBg,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.09)",
          minWidth: 160,
          zIndex: 100,
          overflow: "hidden",
        }}>
          {email && (
            <div style={{ padding: "10px 16px 8px", fontSize: 12, color: C.muted, borderBottom: `1px solid ${C.borderSub}` }}>
              {email}
            </div>
          )}
          <button
            onClick={() => { setOpen(false); router.push("/profile"); }}
            style={menuItemStyle}
          >
            Profile
          </button>
          <button
            onClick={() => { setOpen(false); onSignOut(); }}
            style={{ ...menuItemStyle, color: "#b04040" }}
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
  background: "none",
  border: "none",
  textAlign: "left",
  padding: "10px 16px",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  color: "#111",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};
