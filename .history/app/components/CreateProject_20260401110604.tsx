"use client";
import { C, TEMPLATES } from "../lib/constants";

export default function CreateProject({ form, setForm, onCreate, onBack }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: C.bg, color: C.text, fontFamily: C.font }}>
      <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 18 }}>New Project</div>
      <div style={{ width: 340, maxWidth: "90vw", background: C.panelBg, border: `1px solid ${C.borderSub}`, borderRadius: 18, boxShadow: "0 8px 30px rgba(0,0,0,0.04)", padding: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Project name" style={{ fontSize: 15, padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.border}`, background: "#fff", color: C.text }} />
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ fontSize: 15, padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.border}`, background: "#fff", color: C.text }}>
            {Object.keys(TEMPLATES).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description (optional)" rows={2} style={{ fontSize: 15, padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.border}`, background: "#fff", color: C.text, resize: "none" }} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={onBack} style={{ flex: 1, background: C.faint, color: "#fff", border: "none", borderRadius: 10, padding: "10px 0", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>Back</button>
          <button onClick={onCreate} style={{ flex: 2, background: C.accent, color: "#fff", border: "none", borderRadius: 10, padding: "10px 0", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>Create</button>
        </div>
      </div>
    </div>
  );
}
