"use client";
import { C } from "../lib/constants";

interface ActionChipProps {
  label: string;
  onClick: () => void;
}

export default function ActionChip({ label, onClick }: ActionChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: C.accentBg,
        color: C.accent,
        border: `1px solid ${C.accent}`,
        borderRadius: 10,
        padding: "4px 12px",
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        marginRight: 4,
        marginBottom: 4,
        transition: "background 0.15s"
      }}
    >
      {label}
    </button>
  );
}