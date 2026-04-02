"use client";
import { C } from "../lib/constants";

interface PanelHeaderProps {
  label: string;
}

export default function PanelHeader({ label }: PanelHeaderProps) {
  return (
    <div style={{
      fontSize: 11,
      fontWeight: 600,
      color: C.muted,
      letterSpacing: "0.09em",
      textTransform: "uppercase",
      padding: "20px 18px 10px",
      marginBottom: 2,
      borderBottom: `1px solid ${C.borderSub}`,
    }}>{label}</div>
  );
}
