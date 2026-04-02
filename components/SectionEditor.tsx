"use client";
import { useState } from "react";
import type { Section } from "../lib/types";
import { C } from "../lib/constants";

interface SectionEditorProps {
  section: Section;
  onChange: (section: Section) => void;
  isMobile: boolean;
}

interface BulletEditorProps {
  items: string[];
  onChange: (items: string[]) => void;
}

function BulletEditor({ items, onChange }: BulletEditorProps) {
  const [newItem, setNewItem] = useState("");

  function add() {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem("");
    }
  }

  const inputBase: React.CSSProperties = {
    width: "100%",
    background: C.panelBg,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    color: C.text,
    fontSize: 13,
    fontFamily: C.font,
    padding: "8px 12px",
    outline: "none",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ color: C.accent, fontSize: 10, flexShrink: 0 }}>▸</span>
          <input
            value={item}
            onChange={e => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            style={{ ...inputBase, flex: 1 }}
          />
          <button
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 4px", flexShrink: 0 }}
          >×</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === "Enter" && add()}
          placeholder="Add item…"
          style={{ ...inputBase, flex: 1, border: `1px dashed ${C.border}`, color: C.muted }}
        />
        <button
          onClick={add}
          style={{ background: C.accent, border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", fontSize: 13, fontFamily: C.font, cursor: "pointer", fontWeight: 600, flexShrink: 0 }}
        >+</button>
      </div>
    </div>
  );
}

export default function SectionEditor({ section, onChange, isMobile }: SectionEditorProps) {
  const c = section.content_json;

  function patch(fields: Record<string, any>) {
    onChange({ ...section, content_json: { ...c, ...fields } });
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: C.panelBg,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    color: C.text,
    fontSize: 13,
    fontFamily: C.font,
    padding: "10px 14px",
    outline: "none",
    lineHeight: 1.6,
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: C.muted,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 7,
    display: "block",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Section title + accent bar */}
      <div>
        <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 700, color: C.text, marginBottom: 6 }}>
          {section.title}
        </div>
        <div style={{ width: 28, height: 2, background: C.accent, borderRadius: 1 }} />
      </div>

      {c.type === "chapter" && (
        <>
          <div>
            <label style={labelStyle}>Goal</label>
            <input
              value={c.goal || ""}
              onChange={e => patch({ goal: e.target.value })}
              placeholder="What is this chapter about?"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Key Points</label>
            <BulletEditor
              items={c.key_points || []}
              onChange={items => patch({ key_points: items })}
            />
          </div>
          <div>
            <label style={labelStyle}>Content</label>
            <textarea
              value={c.content || ""}
              onChange={e => patch({ content: e.target.value })}
              placeholder="Write the chapter content…"
              rows={isMobile ? 6 : 9}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
        </>
      )}

      {c.type === "bullets" && (
        <div>
          <label style={labelStyle}>Items</label>
          <BulletEditor
            items={c.items || []}
            onChange={items => patch({ items })}
          />
        </div>
      )}

      {c.type === "simple" && (
        <div>
          <label style={labelStyle}>Content</label>
          <textarea
            value={c.text || ""}
            onChange={e => patch({ text: e.target.value })}
            placeholder="Start writing…"
            rows={isMobile ? 9 : 13}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>
      )}
    </div>
  );
}
