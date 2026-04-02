"use client";
import { useState, useRef, useEffect } from "react";
import { C } from "../lib/constants";
import GlobalStyles from "./GlobalStyles";
import type { Project } from "../lib/types";

interface DashboardProps {
  projects: Project[];
  onOpen: (p: Project) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export default function Dashboard({ projects, onOpen, onNew, onDelete, onRename }: DashboardProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId) inputRef.current?.focus();
  }, [editingId]);

  function startEdit(p: Project, e: React.MouseEvent) {
    e.stopPropagation();
    setEditingId(p.id);
    setEditValue(p.name);
  }

  function commitEdit(id: string) {
    const trimmed = editValue.trim();
    if (trimmed) onRename(id, trimmed);
    setEditingId(null);
  }

  function handleKeyDown(e: React.KeyboardEvent, id: string) {
    if (e.key === "Enter") { e.preventDefault(); commitEdit(id); }
    if (e.key === "Escape") setEditingId(null);
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: C.bg,
      color: C.text,
      fontFamily: C.font,
      padding: "64px 24px",
    }}>
      <GlobalStyles />

      {/* Logo + heading */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: C.accent,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
          fontSize: 20, color: "#fff", fontWeight: 700,
          boxShadow: `0 0 0 1px ${C.accentBorder}, ${C.shadow}`,
        }}>â—ˆ</div>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", color: C.text, marginBottom: 8 }}>
          Build Pilot
        </div>
        <div style={{ fontSize: 14, color: C.textSub, fontWeight: 400 }}>
          Your projects, organized and ready.
        </div>
      </div>

      {/* Project card */}
      <div style={{
        width: 420,
        maxWidth: "100%",
        background: C.panelBg,
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: C.shadowMd,
      }}>
        {projects.length === 0 ? (
          <div style={{
            padding: "52px 36px",
            textAlign: "center",
            color: C.muted,
            fontSize: 14,
            lineHeight: 1.8,
          }}>
            No projects yet.<br />
            <span style={{ color: C.faint === C.muted ? C.muted : C.muted, opacity: 0.6 }}>Create your first to get started.</span>
          </div>
        ) : (
          <div style={{ padding: "8px 0" }}>
            {projects.map((p, idx) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 20px",
                  height: 56,
                  borderBottom: idx < projects.length - 1 ? `1px solid ${C.borderSub}` : "none",
                  gap: 10,
                  transition: "background 0.12s",
                  cursor: "pointer",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = C.surface)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {editingId === p.id ? (
                  <input
                    ref={inputRef}
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={() => commitEdit(p.id)}
                    onKeyDown={e => handleKeyDown(e, p.id)}
                    style={{
                      flex: 1, fontSize: 14, fontWeight: 500, color: C.text,
                      fontFamily: C.font, background: C.cardBg,
                      border: `1px solid ${C.accent}`, borderRadius: 8,
                      padding: "5px 10px", outline: "none",
                      boxShadow: `0 0 0 3px ${C.accentBg}`,
                    }}
                  />
                ) : (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <span
                      onClick={() => onOpen(p)}
                      style={{
                        fontWeight: 500, fontSize: 14, color: C.text,
                        cursor: "pointer", overflow: "hidden",
                        textOverflow: "ellipsis", whiteSpace: "nowrap",
                        flex: 1,
                      }}
                    >
                      {p.name}
                    </span>
                    <span style={{ fontSize: 11, color: C.muted, flexShrink: 0, marginRight: 2 }}>{p.type}</span>
                    <button
                      onClick={e => startEdit(p, e)}
                      title="Rename"
                      style={{
                        background: "none", border: "none", color: C.muted,
                        cursor: "pointer", fontSize: 13, padding: "3px 5px",
                        flexShrink: 0, lineHeight: 1, opacity: 0,
                        transition: "opacity 0.15s",
                        borderRadius: 4,
                      }}
                      className="edit-btn"
                    >âœŽ</button>
                  </div>
                )}
                {confirmDeleteId === p.id ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, color: C.muted }}>Delete?</span>
                    <button
                      onClick={() => { onDelete(p.id); setConfirmDeleteId(null); }}
                      style={{
                        background: C.errorBg, border: `1px solid rgba(217,95,95,0.25)`,
                        borderRadius: 8, color: C.error, fontSize: 12, fontWeight: 600,
                        padding: "3px 10px", cursor: "pointer", fontFamily: C.font,
                      }}
                    >Yes</button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      style={{
                        background: "none", border: `1px solid ${C.border}`,
                        borderRadius: 8, color: C.muted, fontSize: 12,
                        padding: "3px 10px", cursor: "pointer", fontFamily: C.font,
                      }}
                    >No</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(p.id)}
                    style={{
                      background: "none", border: "none", color: C.muted,
                      fontSize: 18, cursor: "pointer", flexShrink: 0,
                      opacity: 0.3, lineHeight: 1, padding: "0 5px",
                      transition: "opacity 0.15s",
                    }}
                  >Ã—</button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* New project button */}
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.border}` }}>
          <button
            onClick={onNew}
            style={{
              width: "100%",
              background: C.accent,
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "13px 0",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              letterSpacing: "0.01em",
              transition: "background 0.15s, opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
            onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
          >+ New Project</button>
        </div>
      </div>
    </div>
  );
}

