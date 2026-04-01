"use client";
import { C } from "../lib/constants";

export default function PanelHeader({ label }) {
  return (
    <div style={{
      fontSize: 13,
      fontWeight: 700,
      color: C.muted,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      padding: "18px 0 8px 0",
      marginLeft: 18,
      marginBottom: 2
    }}>{label}</div>
  );
}
