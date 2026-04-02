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
        color: C.accentText,
        border: `1px solid ${C.accentBorder}`,
        borderRadius: 10,
        padding: "5px 13px",
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        marginRight: 4,
        marginBottom: 4,
        transition: "background 0.15s",
        fontFamily: C.font,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = `rgba(78, 121, 245, 0.14)`)}
      onMouseLeave={e => (e.currentTarget.style.background = C.accentBg)}
    >
      {label}
    </button>
  );
}