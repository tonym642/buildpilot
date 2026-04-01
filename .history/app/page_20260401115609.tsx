"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { callAI, AIMessage } from "../lib/ai/aiClient";
import { C, TEMPLATES } from "./lib/constants";
import { persistence } from "./lib/persistence";
import type { Project, Section, Message } from "./lib/types";
import { genId, useIsMobile } from "./lib/utils";
"use client";
          <BulletEditor items={c.key_points || []} onChange={v => onChange("key_points", v)} />
import { useState, useRef, useEffect } from "react";
import { TEMPLATES } from "./lib/constants";
import type { Project, Section, Message } from "./lib/types";
import { useIsMobile } from "./lib/utils";
import CreateProject from "./components/CreateProject";
import Dashboard from "./components/Dashboard";
import Workspace from "./components/Workspace";
        </div>
export default function BuildPilot() {
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
  const sectionFadeRef = useFadeIn(activeSectionId);

  // Navigation handlers
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
    return <CreateProject form={form} setForm={setForm} onCreate={() => setView("dashboard")} onBack={handleBackToDashboard} />;
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
}

function useFadeIn(dep: any) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.classList.remove("fade-in");
      void ref.current.offsetWidth;
      ref.current.classList.add("fade-in");
    }
  }, [dep]);
  return ref;
}
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




