"use client";
import { useState, useRef, useEffect } from "react";
import { C } from "../lib/constants";
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
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "100vh",
      background: C.bg, color: C.text, fontFamily: C.font,
    }}>
      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 18 }}>Build Pilot</div>
      <div style={{ fontSize: 15, color: C.muted, marginBottom: 32 }}>Your projects, organized and actionable.</div>
      <div style={{
        width: 340, maxWidth: "90vw", background: C.panelBg,
        border: `1px solid ${C.borderSub}`, borderRadius: 18,
        boxShadow: "0 8px 30px rgba(0,0,0,0.04)", padding: 28, marginBottom: 32,
      }}>
        {projects.length === 0 ? (
          <div style={{ color: C.faint, fontSize: 14, textAlign: "center", marginBottom: 18 }}>
            No projects yet.<br />Create your first project to get started.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {projects.map(p => (
              <div key={p.id} style={{
                display: "flex", alignItems: "center",
                padding: "9px 0", borderBottom: `1px solid ${C.borderSub}`, gap: 8,
              }}>
                {editingId === p.id ? (
                  <input
                    ref={inputRef}
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={() => commitEdit(p.id)}
                    onKeyDown={e => handleKeyDown(e, p.id)}
                    style={{
                      flex: 1, fontSize: 15, fontWeight: 600, color: C.text,
                      fontFamily: C.font, background: C.bg,
                      border: `1px solid ${C.accent}`, borderRadius: 6,
                      padding: "2px 8px", outline: "none",
                    }}
                  />
                ) : (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                    <span
                      onClick={() => onOpen(p)}
                      style={{
                        fontWeight: 600, fontSize: 15, color: C.text,
                        cursor: "pointer", overflow: "hidden",
                        textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}
                    >
                      {p.name}
                    </span>
                    <button
                      onClick={e => startEdit(p, e)}
                      title="Rename"
                      style={{
                        background: "none", border: "none", color: C.faint,
                        cursor: "pointer", fontSize: 12, padding: "0 2px",
                        flexShrink: 0, lineHeight: 1,
                      }}
                    >✎</button>
                  </div>
                )}
                {confirmDeleteId === p.id ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, color: C.muted }}>Delete?</span>
                    <button
                      onClick={() => { onDelete(p.id); setConfirmDeleteId(null); }}
                      style={{ background: "#b04040", border: "none", borderRadius: 6, color: "#fff", fontSize: 12, fontWeight: 600, padding: "3px 10px", cursor: "pointer", fontFamily: C.font }}
                    >Yes</button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, fontSize: 12, padding: "3px 10px", cursor: "pointer", fontFamily: C.font }}
                    >No</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(p.id)}
                    style={{ background: "none", border: "none", color: C.faint, fontSize: 16, cursor: "pointer", flexShrink: 0 }}
                  >×</button>
                )}
              </div>
            ))}
          </div>
        )}
        <button
          onClick={onNew}
          style={{
            marginTop: 24, width: "100%", background: C.accent, color: "#fff",
            border: "none", borderRadius: 12, padding: "12px 0",
            fontWeight: 600, fontSize: 15, cursor: "pointer",
          }}
        >+ New Project</button>
      </div>
    </div>
  );
}
