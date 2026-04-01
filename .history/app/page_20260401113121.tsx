  // Find the active section
  const activeSection = sections.find(s => s.id === activeSectionId) || null;

  // Stub handlers (replace with real logic as needed)
  const sendMessage = (input: string) => {
    // TODO: Implement AI message sending logic
  };
  const handleAction = (action: any) => {
    // TODO: Implement action handler logic
  };
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { callAI, AIMessage } from "../lib/ai/aiClient";
import { C, TEMPLATES } from "./lib/constants";
import { persistence } from "./lib/persistence";
import type { Project, Section, Message } from "./lib/types";
import { genId, useIsMobile } from "./lib/utils";


// ─── AI SYSTEM PROMPT BUILDER ──
function buildSystemPrompt(project, sections, currentSectionId) {
  const cur = sections.find(s => s.id === currentSectionId);
  const summaries = sections.map(s => {
    const c = s.content_json;
    const preview = c.type === "chapter" ? `goal:${c.goal || "empty"} points:${(c.key_points || []).slice(0,2).join(",") || "none"}`
      : c.type === "bullets" ? (c.items || []).slice(0,3).join(", ") || "empty"
      : (c.text || "empty").slice(0, 70);
    return `[${s.title}]: ${preview}`;
  }).join("\n");
  return `You are Build Pilot AI for a ${project.type} project called "${project.name}". Description: ${project.description || "none"}.
Current section: ${cur?.title || "none"}. Content: ${cur ? JSON.stringify(cur.content_json) : "none"}.
Other sections:\n${summaries}
Respond ONLY with valid JSON (no markdown, no preamble):
{"text":"2-4 sentence response, no markdown","actions":[{"label":"Short label","type":"action_type","target_section":"current","data":{}}]}
Action types: set_content(data:{text}), set_goal(data:{goal}), set_key_points(data:{key_points:[]}), set_bullets(data:{items:[]}), followup, next_section. Max 3 actions.`;
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────
export default function BuildPilot() {
  const sectionFadeRef = useFadeIn(activeSectionId);
  const [view, setView] = useState("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project|null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string|null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [mobileTab, setMobileTab] = useState("brain");
  const [form, setForm] = useState({ name: "", type: "App", description: "" });
  const chatEndRef = useRef(null);
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    persistence.getProjects().then(setProjects);
  }, []);

  const saveProjects = async (ps: Project[]) => {
    setProjects(ps);
    await persistence.saveProjects(ps);
  };

  const openProject = async (project: Project) => {
    const secs = await persistence.getSections(project.id);
    const msgs = await persistence.getMessages(project.id);
    setSections(secs);
    setMessages(msgs);
    setActiveSectionId(project.current_target_section_id || secs[0]?.id || null);
    setActiveProject(project);
    setMobileTab("brain");
    setView("workspace");
  };

  const saveMessages = useCallback(async (msgs: Message[], pid: string) => {
    setMessages(msgs);
    await persistence.saveMessages(pid, msgs);
  }, []);

  const updateProject = useCallback(async (updates) => {
    setActiveProject(p => {
      if (!p) return p;
      const u = { ...p, ...updates, updated_at: new Date().toISOString() };
      setProjects(ps => {
        const n = ps.map(x => x.id === u.id ? u : x);
        persistence.saveProjects(n);
        return n;
      });
      return u;
    });
  }, []);

  const handleCreate = async () => {
    const id = genId();
    const newSections = TEMPLATES[form.type].sections.map(s => ({ ...s, id: genId(), project_id: id, content_json: JSON.parse(JSON.stringify(s.content_json)) }));
    const project: Project = { id, name: form.name || "Untitled", type: form.type, description: form.description, last_summary: "", current_target_section_id: newSections[0]?.id, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    await saveProjects([...projects, project]);
    await persistence.saveSections(id, newSections);
    await persistence.saveMessages(id, []);
    setForm({ name: "", type: "App", description: "" });
    openProject(project);
  };

  const updateSectionContent = (field: string, value: any) => {
    setSections(prev => {
      const next = prev.map(s => s.id !== activeSectionId ? s : { ...s, content_json: { ...s.content_json, [field]: value } });
      if (activeProject) persistence.saveSections(activeProject.id, next);
      return next;
    });
  };

  // ── WORKSPACE ──────────────────────────────────────────────────────────────
  const Workspace = require("./components/Workspace").default;
  return (
    <Workspace
      isMobile={isMobile}
      mobileTab={mobileTab}
      setMobileTab={setMobileTab}
      activeProject={activeProject}
      activeSection={activeSection}
      activeSectionId={activeSectionId}
      setActiveSectionId={setActiveSectionId}
      sections={sections}
      messages={messages}
      isThinking={isThinking}
      inputVal={inputVal}
      setInputVal={setInputVal}
      sendMessage={sendMessage}
      handleAction={handleAction}
      chatEndRef={chatEndRef}
      updateSectionContent={updateSectionContent}
      sectionFadeRef={sectionFadeRef}
      onDashboard={() => setView("dashboard")}
    />
  );
// (removed unreachable duplicate JSX)

// Duplicate BuildPilot removed (migrated above)


  useEffect(() => {
    setMounted(true);
    const savedProjects = storage.get("bp_projects") || [];
    setProjects(savedProjects);
  }, []);

  // ── WORKSPACE ──────────────────────────────────────────────────────────────
  const Workspace = require("./components/Workspace").default;
  return (
    <Workspace
      isMobile={isMobile}
      mobileTab={mobileTab}
      setMobileTab={setMobileTab}
      activeProject={activeProject}
      activeSection={activeSection}
      activeSectionId={activeSectionId}
      setActiveSectionId={setActiveSectionId}
      sections={sections}
      messages={messages}
      isThinking={isThinking}
      inputVal={inputVal}
      setInputVal={setInputVal}
      sendMessage={sendMessage}
      handleAction={handleAction}
      chatEndRef={chatEndRef}
      updateSectionContent={updateSectionContent}
      sectionFadeRef={sectionFadeRef}
      onDashboard={() => setView("dashboard")}
    />
  );
}
    /* Keyframes moved to CSS file or global styles */
  }
  );
// Utility hook for fade-in animation on section switch
function useFadeIn(dep: any) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      if (ref.current) {
        ref.current.classList.remove("fade-in");
        // Force reflow for restart
        void ref.current.offsetWidth;
        ref.current.classList.add("fade-in");
      }
    }
    // eslint-disable-next-line
  }, [dep]);
  return ref;
}
}

function PanelHeader({ label }: { label: string }) {
  return (
    <div style={{ padding: "0 16px 8px", fontSize: 10, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", borderBottom: "1px solid " + C.borderSub, marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ color: C.accent, fontSize: 8 }}>●</span>{label}
    </div>
  );
}

function ActionChip({ label, onClick }: { label: string, onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={e => { setHovered(true); e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { setHovered(false); e.currentTarget.style.transform = "none"; }}
      style={{
        fontSize: 12,
        padding: "8px 14px",
        borderRadius: 999,
        border: "1px solid " + C.border,
        background: hovered ? C.text : "#ffffff",
        color: hovered ? "#ffffff" : "#3d3d3d",
        cursor: "pointer",
        fontFamily: C.font,
        transition: "all 0.15s ease",
        boxShadow: hovered ? "0 8px 20px rgba(0,0,0,0.08)" : "0 1px 2px rgba(0,0,0,0.04)"
      }}
    >
      {label}
    </button>
  );
}

function hasContent(c: any) {
  return !!(c.text?.trim() || c.goal?.trim() || c.content?.trim() || c.items?.length || c.key_points?.length);
}

// ─── SECTION EDITOR ───────────────────────────────────────────────────────────
function SectionEditor({ section, onChange, isMobile }: { section: Section, onChange: (field: string, value: any) => void, isMobile: boolean }) {
  const c = section.content_json;
  const iStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.72)",
    border: "1px solid " + C.border,
    borderRadius: 16,
    color: C.text,
    fontSize: 15,
    fontFamily: C.font,
    padding: "16px 18px",
    outline: "none",
    lineHeight: 1.7,
    boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
    transition: "all 0.15s ease"
  };
  const lStyle = {
    fontSize: 11,
    color: "#8c8a84",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 10,
    display: "block",
    fontWeight: 600
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div>
        <div style={{ fontSize: isMobile ? 18 : 24, fontWeight: 600, color: C.text, marginBottom: 10, letterSpacing: "-0.02em" }}>{section.title}</div>
        <div style={{ width: 28, height: 2, background: C.accent, borderRadius: 1 }} />
      </div>
      {c.type === "chapter" && (<>
        <div>
          <label style={lStyle}>Goal</label>
          <input value={c.goal || ""} onChange={e => onChange("goal", e.target.value)} placeholder="What is this chapter about?" style={iStyle}
            onFocus={e => e.target.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.08)"}
            onBlur={e => e.target.style.boxShadow = iStyle.boxShadow}
          />
        </div>
        <div>
          <label style={lStyle}>Key Points</label>
          <BulletEditor items={c.key_points || []} onChange={v => onChange("key_points", v)} />
        </div>
        <div>
          <label style={lStyle}>Content</label>
          <textarea value={c.content || ""} onChange={e => onChange("content", e.target.value)} placeholder="Write the chapter content..." rows={isMobile ? 6 : 8} style={{ ...iStyle, resize: "vertical" }}
            onFocus={e => e.target.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.08)"}
            onBlur={e => e.target.style.boxShadow = iStyle.boxShadow}
          />
        </div>
      </>)}
      {c.type === "bullets" && (
        <div>
          <label style={lStyle}>Items</label>
          <BulletEditor items={c.items || []} onChange={v => onChange("items", v)} />
        </div>
      )}
      {c.type === "simple" && (
        <div>
          <label style={lStyle}>Content</label>
          <textarea value={c.text || ""} onChange={e => onChange("text", e.target.value)} placeholder="Start writing..." rows={isMobile ? 9 : 12} style={{ ...iStyle, resize: "vertical" }}
            onFocus={e => e.target.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.08)"}
            onBlur={e => e.target.style.boxShadow = iStyle.boxShadow}
          />
        </div>
      )}
    </div>
  );
}

function BulletEditor({ items, onChange }: { items: string[], onChange: (items: string[]) => void }) {
  const [newItem, setNewItem] = useState("");
  const add = () => { if (newItem.trim()) { onChange([...items, newItem.trim()]); setNewItem(""); } };
  const base = {
    background: "rgba(255,255,255,0.78)",
    border: "1px solid " + C.border,
    borderRadius: 12,
    color: C.text,
    fontSize: 14,
    fontFamily: C.font,
    padding: "10px 12px",
    outline: "none",
    boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
    transition: "all 0.15s ease"
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ color: C.accent, fontSize: 10, flexShrink: 0 }}>▸</span>
          <input value={item} onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n); }}
            style={{ ...base, flex: 1 }}
            onFocus={e => e.target.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.08)"}
            onBlur={e => e.target.style.boxShadow = base.boxShadow}
          />
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "0 4px", flexShrink: 0 }}>×</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 6 }}>
        <input value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="Add item…"
          style={{
            ...base,
            flex: 1,
            background: "rgba(255,255,255,0.65)",
            border: "1px dashed " + C.border,
            color: C.muted
          }}
          onFocus={e => e.target.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.08)"}
          onBlur={e => e.target.style.boxShadow = base.boxShadow}
        />
        <button onClick={add} style={{ background: C.accent, border: "none", borderRadius: 6, padding: "7px 14px", color: "#0d0d0f", fontSize: 13, fontFamily: C.font, cursor: "pointer", fontWeight: 600 }}>+</button>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ projects, onOpen, onNew, onDelete }: { projects: Project[], onOpen: (p: Project) => void, onNew: () => void, onDelete: (id: string) => void }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: C.font }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0}"}</style>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: isMobile ? "36px 18px" : "60px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: isMobile ? 36 : 52 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ color: C.accent, fontSize: isMobile ? 19 : 22 }}>◈</span>
            <span style={{ fontSize: isMobile ? 19 : 22, fontWeight: 600, letterSpacing: "0.05em" }}>Build Pilot</span>
          </div>
          <div style={{ fontSize: 10, color: "#333", letterSpacing: "0.2em", textTransform: "uppercase", paddingLeft: 30 }}>Think. Commit. Build.</div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <button
            className="button-anim"
            onClick={onNew}
            style={{
              background: C.text,
              border: "none",
              borderRadius: 12,
              padding: isMobile ? "12px 22px" : "12px 20px",
              color: "#ffffff",
              fontSize: 14,
              fontFamily: C.font,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)"
            }}
          >
            + New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div style={{ color: "#2a2a30", fontSize: 13, paddingTop: 28 }}>No projects yet. Start your first →</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {projects.map(p => (
              <div key={p.id} className="fade-in-list" style={{ padding: "16px 0", borderBottom: "1px solid " + C.borderSub, display: "flex", alignItems: isMobile ? "flex-start" : "center", gap: 12, flexDirection: isMobile ? "column" : "row", transition: "background 0.18s cubic-bezier(.4,.8,.4,1)" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.03)"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 17, flexShrink: 0 }}>{TEMPLATES[p.type]?.icon || "✦"}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "#404040", display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ color: "#484848", textTransform: "uppercase", letterSpacing: "0.07em" }}>{p.type}</span>
                      <span>·</span>
                      <span>{new Date(p.updated_at).toLocaleDateString()}</span>
                    </div>
                    {p.last_summary && <div style={{ fontSize: 10, color: "#2e2e33", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.last_summary}</div>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button className="button-anim" onClick={() => onOpen(p)} style={{
                    background: "#ffffff",
                    border: "1px solid " + C.border,
                    borderRadius: 10,
                    padding: isMobile ? "8px 22px" : "8px 16px",
                    color: C.text,
                    fontSize: 12,
                    fontFamily: C.font,
                    cursor: "pointer"
                  }}>Open</button>
                  <button className="button-anim" onClick={() => onDelete(p.id)} style={{
                    background: "#ffffff",
                    border: "1px solid " + C.border,
                    borderRadius: 10,
                    padding: isMobile ? "8px 12px" : "8px 12px",
                    color: C.muted,
                    fontSize: 12,
                    fontFamily: C.font,
                    cursor: "pointer"
                  }}>×</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CREATE PROJECT ───────────────────────────────────────────────────────────
function CreateProject({ form, setForm, onCreate, onBack }) {
  const isMobile = useIsMobile();
  const iStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.72)",
    border: "1px solid " + C.border,
    borderRadius: 16,
    color: C.text,
    fontSize: 15,
    fontFamily: C.font,
    padding: "16px 18px",
    outline: "none",
    lineHeight: 1.7,
    boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
    transition: "all 0.15s ease"
  };
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: C.font }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0}"}</style>
      <div style={{ maxWidth: 500, margin: "0 auto", padding: isMobile ? "30px 18px" : "60px 24px" }}>
        <button onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: C.muted,
            fontFamily: C.font,
            fontSize: 12,
            cursor: "pointer",
            marginBottom: 30,
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.15s ease"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "none"}
        >← Back</button>
        <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 600, marginBottom: 28, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: C.accent }}>◈</span> New Project
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div>
            <label style={{ fontSize: 10, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>Project Type</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.keys(TEMPLATES).map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 20,
                    border: "1px solid " + (form.type === t ? C.accent : C.border),
                    background: form.type === t ? C.accentBg : "transparent",
                    color: form.type === t ? C.accent : C.muted,
                    fontSize: 12,
                    fontFamily: C.font,
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "none"}
                >
                  {TEMPLATES[t].icon} {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 10, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Project Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="My Amazing Project" style={iStyle} onKeyDown={e => e.key === "Enter" && form.name.trim() && onCreate()}
              onFocus={e => e.target.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.08)"}
              onBlur={e => e.target.style.boxShadow = iStyle.boxShadow}
            />
          </div>
          <div>
            <label style={{ fontSize: 10, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Description <span style={{ color: C.faint }}>(optional)</span></label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What is this project about?" rows={3} style={{ ...iStyle, resize: "none" }}
              onFocus={e => e.target.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.08)"}
              onBlur={e => e.target.style.boxShadow = iStyle.boxShadow}
            />
          </div>
          <button onClick={onCreate} disabled={!form.name.trim()}
            style={{
              background: form.name.trim() ? C.accent : "#161618",
              border: "none",
              borderRadius: 8,
              padding: "13px",
              color: form.name.trim() ? "#0d0d0f" : C.faint,
              fontSize: 13,
              fontFamily: C.font,
              fontWeight: 600,
              cursor: form.name.trim() ? "pointer" : "not-allowed",
              letterSpacing: "0.06em",
              transition: "all 0.15s ease"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "none"}
          >
            Create Project →
          </button>
        </div>
      </div>
    </div>
  );
}
