"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { callAI, AIMessage } from "../lib/ai/aiClient";
import { C, TEMPLATES } from "./lib/constants";
import { persistence } from "./lib/persistence";
import type { Project, Section, Message } from "./lib/types";
import { genId, useIsMobile } from "./lib/utils";
import CreateProject from "./components/CreateProject";
import Dashboard from "./components/Dashboard";
import Workspace from "./components/Workspace";


// ─── AI SYSTEM PROMPT BUILDER ──
function buildSystemPrompt(
  project: Project,
  sectionList: Section[],
  currentSectionId: string | null
): string {
  const cur = sectionList.find((s: Section) => s.id === currentSectionId);
  const summaries = sectionList.map((s: Section) => {
    const c = s.content_json;
    const preview = c.type === "chapter"
      ? `goal:${c.goal || "empty"} points:${(c.key_points || []).slice(0,2).join(",") || "none"}`
      : c.type === "bullets"
        ? (c.items || []).slice(0,3).join(", ") || "empty"
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
  // ...state declarations...
  const [view, setView] = useState("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [mobileTab, setMobileTab] = useState("brain");
  const [form, setForm] = useState<{ name: string; type: keyof typeof TEMPLATES; description: string }>({ name: "", type: "App", description: "" });
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  // sectionFadeRef must be after activeSectionId
  const sectionFadeRef = useFadeIn(activeSectionId);

  // Example handlers for navigation
  const handleOpenProject = (project: Project) => {
    setActiveProject(project);
    setView("workspace");
  };
  const handleNewProject = () => setView("create");
  const handleBackToDashboard = () => setView("dashboard");

  // Render logic
  if (view === "dashboard") {
    return <Dashboard projects={projects} onOpen={handleOpenProject} onNew={handleNewProject} onDelete={() => {}} />;
  }
  if (view === "create") {
    return <CreateProject form={form} setForm={setForm} onCreate={() => setView("dashboard") } onBack={handleBackToDashboard} />;
  }
  if (view === "workspace" && activeProject) {
    return (
      <Workspace
        isMobile={isMobile}
        mobileTab={mobileTab}
        setMobileTab={setMobileTab}
        activeProject={activeProject}
        activeSectionId={activeSectionId}
        setActiveSectionId={setActiveSectionId}
        sections={sections}
        messages={messages}
        isThinking={isThinking}
        inputVal={inputVal}
        setInputVal={setInputVal}
        chatEndRef={chatEndRef}
        updateSectionContent={() => {}}
        sectionFadeRef={sectionFadeRef}
        onDashboard={handleBackToDashboard}
      />
    );
  }
  return null;
  // Simple fade-in hook
  function useFadeIn(dep: any) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (ref.current) {
        ref.current.classList.remove("fade-in");
        void ref.current.offsetWidth;
        ref.current.classList.add("fade-in");
      }
      // eslint-disable-next-line
    }, [dep]);
    return ref;
  }
  // ...existing code...

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




