"use client";
import { C, TEMPLATES } from "../lib/constants";
import GlobalStyles from "./GlobalStyles";

type TemplateType = keyof typeof TEMPLATES;

interface CreateProjectProps {
  form: { name: string; type: TemplateType; description: string };
  setForm: React.Dispatch<React.SetStateAction<{ name: string; type: TemplateType; description: string }>>;
  onCreate: () => void;
  onBack: () => void;
  creating?: boolean;
  error?: string | null;
}

const fieldStyle: React.CSSProperties = {
  fontSize: 14,
  padding: "11px 14px",
  borderRadius: 10,
  border: `1px solid ${C.border}`,
  background: C.cardBg,
  color: C.text,
  fontFamily: "inherit",
  outline: "none",
  width: "100%",
  transition: "border 0.15s, box-shadow 0.15s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: C.muted,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  marginBottom: 7,
};

export default function CreateProject({ form, setForm, onCreate, onBack, creating = false, error = null }: CreateProjectProps) {
  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      color: C.text,
      fontFamily: C.font,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
    }}>
      <GlobalStyles />

      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.025em" }}>New Project</div>
        <div style={{ fontSize: 14, color: C.textSub, marginTop: 6 }}>Set up your workspace in seconds.</div>
      </div>

      <div style={{
        width: 420,
        maxWidth: "100%",
        background: C.panelBg,
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        padding: "36px 32px",
        boxShadow: C.shadowMd,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={labelStyle}>Project name</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="My new project"
              style={fieldStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Template</label>
            <select
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value as TemplateType }))}
              style={{ ...fieldStyle, cursor: "pointer" }}
            >
              {Object.keys(TEMPLATES).map(t => (
                <option key={t} value={t} style={{ background: C.panelBg, color: C.text }}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>
              Description <span style={{ color: C.muted, fontWeight: 400, textTransform: "none", letterSpacing: 0, opacity: 0.6 }}>(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="What are you building?"
              rows={3}
              style={{ ...fieldStyle, resize: "none", lineHeight: 1.65 }}
            />
          </div>
        </div>

        {error && (
          <div style={{
            marginTop: 18, padding: "11px 14px", borderRadius: 10,
            background: C.errorBg, border: `1px solid rgba(217,95,95,0.2)`,
            color: C.error, fontSize: 13,
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
          <button
            onClick={onBack}
            disabled={creating}
            style={{
              flex: 1, background: "none", border: `1px solid ${C.border}`,
              borderRadius: 12, padding: "12px 0", fontWeight: 500,
              fontSize: 14, cursor: creating ? "not-allowed" : "pointer",
              color: C.textSub, fontFamily: C.font, opacity: creating ? 0.5 : 1,
              transition: "border-color 0.15s",
            }}
          >Back</button>
          <button
            onClick={onCreate}
            disabled={creating}
            style={{
              flex: 2, background: C.accent, color: "#fff", border: "none",
              borderRadius: 12, padding: "12px 0", fontWeight: 600,
              fontSize: 14, cursor: creating ? "not-allowed" : "pointer",
              opacity: creating ? 0.65 : 1, fontFamily: C.font,
              letterSpacing: "0.01em",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => !creating && (e.currentTarget.style.background = C.accentHover)}
            onMouseLeave={e => !creating && (e.currentTarget.style.background = C.accent)}
          >
            {creating ? "Creating…" : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
