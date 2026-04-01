"use client";
import { C } from "../lib/constants";

import type { Project } from "../lib/types";

interface DashboardProps {
  projects: Project[];
  onOpen: (p: Project) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export default function Dashboard({ projects, onOpen, onNew, onDelete }: DashboardProps) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: C.bg, color: C.text, fontFamily: C.font
    }}>
      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 18 }}>Build Pilot</div>
      <div style={{ fontSize: 15, color: C.muted, marginBottom: 32 }}>Your projects, organized and actionable.</div>
      <div style={{ width: 340, maxWidth: "90vw", background: C.panelBg, border: `1px solid ${C.borderSub}`, borderRadius: 18, boxShadow: "0 8px 30px rgba(0,0,0,0.04)", padding: 28, marginBottom: 32 }}>
        {projects.length === 0 ? (
          <div style={{ color: C.faint, fontSize: 14, textAlign: "center", marginBottom: 18 }}>
            No projects yet.<br />Create your first project to get started.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {projects.map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.borderSub}` }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: C.text, cursor: "pointer" }} onClick={() => onOpen(p)}>{p.name}</div>
                <button onClick={() => onDelete(p.id)} style={{ background: "none", border: "none", color: C.faint, fontSize: 16, cursor: "pointer" }}>✕</button>
              </div>
            ))}
          </div>
        )}
        <button onClick={onNew} style={{ marginTop: 24, width: "100%", background: C.accent, color: "#fff", border: "none", borderRadius: 12, padding: "12px 0", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>+ New Project</button>
      </div>
    </div>
  );
}
