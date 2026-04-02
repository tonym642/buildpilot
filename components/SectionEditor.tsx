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
    background: C.cardBg,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    color: C.text,
    fontSize: 14,
    fontFamily: C.font,
    padding: "10px 13px",
    outline: "none",
    lineHeight: 1.55,
    transition: "border 0.15s, box-shadow 0.15s",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ color: C.accent, fontSize: 9, flexShrink: 0, opacity: 0.7 }}>▸</span>
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
            style={{
              background: "none", border: "none", color: C.muted,
              cursor: "pointer", fontSize: 18, lineHeight: 1,
              padding: "0 4px", flexShrink: 0, opacity: 0.4,
              transition: "opacity 0.15s",
            }}
          >×</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === "Enter" && add()}
          placeholder="Add item…"
          style={{ ...inputBase, flex: 1, border: `1px dashed ${C.border}`, color: C.textSub }}
        />
        <button
          onClick={add}
          style={{
            background: C.accentBg, border: `1px solid ${C.accentBorder}`,
            borderRadius: 10, padding: "10px 18px",
            color: C.accentText, fontSize: 14, fontFamily: C.font,
            cursor: "pointer", fontWeight: 600, flexShrink: 0,
            transition: "background 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = `rgba(78, 121, 245, 0.14)`)}
          onMouseLeave={e => (e.currentTarget.style.background = C.accentBg)}
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
    background: C.cardBg,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    color: C.text,
    fontSize: 14,
    fontFamily: C.font,
    padding: "11px 14px",
    outline: "none",
    lineHeight: 1.65,
    boxSizing: "border-box",
    transition: "border 0.15s, box-shadow 0.15s",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: C.muted,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 8,
    display: "block",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Section title */}
      <div>
        <div style={{
          fontSize: isMobile ? 17 : 20,
          fontWeight: 700,
          color: C.text,
          letterSpacing: "-0.025em",
          marginBottom: 10,
        }}>
          {section.title}
        </div>
        <div style={{ width: 28, height: 2, background: C.accent, borderRadius: 1, opacity: 0.7 }} />
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
              rows={isMobile ? 7 : 10}
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
            rows={isMobile ? 10 : 14}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>
      )}
    </div>
  );
}
