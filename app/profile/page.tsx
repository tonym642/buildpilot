"use client";
import { useRouter } from "next/navigation";
import { C } from "../../lib/constants";

export default function ProfilePage() {
  const router = useRouter();
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: C.bg,
      fontFamily: C.font,
      color: C.text,
    }}>
      <div style={{
        background: C.panelBg,
        border: `1px solid ${C.borderSub}`,
        borderRadius: 18,
        padding: "36px 40px",
        width: 340,
        maxWidth: "90vw",
        boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
      }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Profile</div>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 28 }}>Account settings coming soon.</div>
        <button
          onClick={() => router.back()}
          style={{
            background: C.accent,
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "10px 24px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: C.font,
          }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
