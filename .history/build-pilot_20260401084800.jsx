import { useState, useEffect, useRef, useCallback } from "react";

// ─── TEMPLATES ───────────────────────────────────────────────────────────────
const TEMPLATES = {
  Book: {
    icon: "📖",
    sections: [
      { key: "book_concept", title: "Book Concept", sort_order: 0, content_json: { type: "simple", text: "" } },
      { key: "purpose", title: "Purpose", sort_order: 1, content_json: { type: "simple", text: "" } },
      { key: "chapter_1", title: "Chapter 1", sort_order: 2, content_json: { type: "chapter", goal: "", key_points: [], content: "" } },
      { key: "chapter_2", title: "Chapter 2", sort_order: 3, content_json: { type: "chapter", goal: "", key_points: [], content: "" } },
      { key: "chapter_3", title: "Chapter 3", sort_order: 4, content_json: { type: "chapter", goal: "", key_points: [], content: "" } },
    ],
  },
  App: {
    icon: "⚡",
    sections: [
      { key: "concept", title: "Concept", sort_order: 0, content_json: { type: "simple", text: "" } },
      { key: "problem", title: "Problem", sort_order: 1, content_json: { type: "simple", text: "" } },
      { key: "solution", title: "Solution", sort_order: 2, content_json: { type: "simple", text: "" } },
      { key: "features", title: "Features", sort_order: 3, content_json: { type: "bullets", items: [] } },
      { key: "mvp_scope", title: "MVP Scope", sort_order: 4, content_json: { type: "simple", text: "" } },
    ],
  },
  Business: {
    icon: "🏢",
    sections: [
      { key: "concept", title: "Concept", sort_order: 0, content_json: { type: "simple", text: "" } },
      { key: "audience", title: "Audience", sort_order: 1, content_json: { type: "simple", text: "" } },
      { key: "offer", title: "Offer", sort_order: 2, content_json: { type: "simple", text: "" } },
      { key: "marketing", title: "Marketing", sort_order: 3, content_json: { type: "simple", text: "" } },
      { key: "operations", title: "Operations", sort_order: 4, content_json: { type: "simple", text: "" } },
    ],
  },
  Marketing: {
    icon: "📣",
    sections: [
      { key: "goal", title: "Goal", sort_order: 0, content_json: { type: "simple", text: "" } },
      { key: "audience", title: "Audience", sort_order: 1, content_json: { type: "simple", text: "" } },
      { key: "message", title: "Message", sort_order: 2, content_json: { type: "simple", text: "" } },
      { key: "channels", title: "Channels", sort_order: 3, content_json: { type: "bullets", items: [] } },
      { key: "plan", title: "Plan", sort_order: 4, content_json: { type: "simple", text: "" } },
    ],
  },
  Custom: {
    icon: "✦",
    sections: [
      { key: "concept", title: "Concept", sort_order: 0, content_json: { type: "simple", text: "" } },
      { key: "notes", title: "Notes", sort_order: 1, content_json: { type: "simple", text: "" } },
    ],
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const storage = {
  get: (key) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};

function genId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return isMobile;
}

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  bg: "#0d0d0f", border: "#1e1e22", borderSub: "#161618",
  text: "#e8e6e0", muted: "#555", faint: "#2e2e33",
  accent: "#c8f078", accentBg: "#c8f07812",
  panelBg: "#111115", cardBg: "#141418",
  font: "'DM Mono', monospace",
};

// ─── AI ──────────────────────────────────────────────────────────────────────
async function callAI(systemPrompt, messages) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: systemPrompt, messages }),
  });
  const data = await res.json();
  const text = data.content?.map(b => b.text || "").join("") || "";
  const match = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
  if (match) { try { return JSON.parse(match[1]); } catch {} }
  return { text, actions: [] };
}

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
  const [view, setView] = useState("dashboard");
  const [projects, setProjects] = useState(() => storage.get("bp_projects") || []);
  const [activeProject, setActiveProject] = useState(null);
  const [sections, setSections] = useState([]);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [mobileTab, setMobileTab] = useState("brain");
  const [form, setForm] = useState({ name: "", type: "App", description: "" });
  const chatEndRef = useRef(null);
  const isMobile = useIsMobile();

  const saveProjects = (ps) => { setProjects(ps); storage.set("bp_projects", ps); };

  const openProject = (project) => {
    const secs = storage.get(`bp_sections_${project.id}`) || [];
    const msgs = storage.get(`bp_messages_${project.id}`) || [];
    setSections(secs);
    setMessages(msgs);
    setActiveSectionId(project.current_target_section_id || secs[0]?.id || null);
    setActiveProject(project);
    setMobileTab("brain");
    setView("workspace");
  };

  const saveMessages = useCallback((msgs, pid) => { setMessages(msgs); storage.set(`bp_messages_${pid}`, msgs); }, []);

  const updateProject = useCallback((updates) => {
    setActiveProject(p => {
      const u = { ...p, ...updates, updated_at: new Date().toISOString() };
      setProjects(ps => { const n = ps.map(x => x.id === u.id ? u : x); storage.set("bp_projects", n); return n; });
      return u;
    });
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleCreate = () => {
    const id = genId();
    const newSections = TEMPLATES[form.type].sections.map(s => ({ ...s, id: genId(), project_id: id, content_json: JSON.parse(JSON.stringify(s.content_json)) }));
    const project = { id, name: form.name || "Untitled", type: form.type, description: form.description, last_summary: "", current_target_section_id: newSections[0]?.id, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    saveProjects([...projects, project]);
    storage.set(`bp_sections_${id}`, newSections);
    storage.set(`bp_messages_${id}`, []);
    setForm({ name: "", type: "App", description: "" });
    openProject(project);
  };

  const handleAction = useCallback((action) => {
    const target = action.target_section === "current" ? activeSectionId : sections.find(s => s.key === action.target_section)?.id || activeSectionId;
    setSections(prev => {
      const next = prev.map(s => {
        if (s.id !== target) return s;
        const c = { ...s.content_json };
        if (action.type === "set_content" && action.data?.text) c.text = action.data.text;
        if (action.type === "set_goal" && action.data?.goal) c.goal = action.data.goal;
        if (action.type === "set_key_points" && action.data?.key_points) c.key_points = action.data.key_points;
        if (action.type === "set_bullets" && action.data?.items) c.items = action.data.items;
        return { ...s, content_json: c };
      });
      storage.set(`bp_sections_${activeProject.id}`, next);
      return next;
    });
    if (action.type === "next_section") {
      const idx = sections.findIndex(s => s.id === activeSectionId);
      if (idx < sections.length - 1) { setActiveSectionId(sections[idx + 1].id); }
    }
    if (isMobile && action.type !== "followup") setTimeout(() => setMobileTab("build"), 250);
    const cur = sections.find(s => s.id === target);
    const filled = sections.filter(s => { const c = s.content_json; return c.text?.trim() || c.goal?.trim() || c.items?.length || c.key_points?.length; }).length;
    updateProject({ last_summary: `✓ ${cur?.title || "section"} updated · ${filled}/${sections.length} filled`, current_target_section_id: target });
  }, [activeSectionId, sections, activeProject, updateProject, isMobile]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isThinking) return;
    const userMsg = { id: genId(), role: "user", message: text, created_at: new Date().toISOString() };
    const next = [...messages, userMsg];
    saveMessages(next, activeProject.id);
    setInputVal("");
    setIsThinking(true);
    try {
      const sys = buildSystemPrompt(activeProject, sections, activeSectionId);
      const apiMsgs = next.slice(-18).map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.message }));
      const result = await callAI(sys, apiMsgs);
      saveMessages([...next, { id: genId(), role: "assistant", message: result.text || "Let me help.", actions: result.actions || [], created_at: new Date().toISOString() }], activeProject.id);
    } catch {
      saveMessages([...next, { id: genId(), role: "assistant", message: "Something went wrong. Try again.", actions: [], created_at: new Date().toISOString() }], activeProject.id);
    }
    setIsThinking(false);
  }, [messages, isThinking, activeProject, sections, activeSectionId, saveMessages]);

  const updateSectionContent = (field, value) => {
    setSections(prev => {
      const next = prev.map(s => s.id !== activeSectionId ? s : { ...s, content_json: { ...s.content_json, [field]: value } });
      storage.set(`bp_sections_${activeProject.id}`, next);
      return next;
    });
  };

  const activeSection = sections.find(s => s.id === activeSectionId);

  if (view === "dashboard") return <Dashboard projects={projects} onOpen={openProject} onNew={() => setView("create")} onDelete={(id) => saveProjects(projects.filter(p => p.id !== id))} />;
  if (view === "create") return <CreateProject form={form} setForm={setForm} onCreate={handleCreate} onBack={() => setView("dashboard")} />;

  // ── WORKSPACE ──────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: C.bg, color: C.text, fontFamily: C.font, overflow: "hidden" }}>
      <GlobalStyles />

      {/* TOP BAR */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 14px" : "0 24px", height: isMobile ? 48 : 52, borderBottom: `1px solid ${C.border}`, flexShrink: 0, gap: 8, minWidth: 0 }}>
        <button onClick={() => setView("dashboard")} style={{ background: "none", border: "none", color: C.text, fontFamily: C.font, fontSize: isMobile ? 12 : 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <span style={{ color: C.accent }}>◈</span>
          <span style={{ maxWidth: isMobile ? 90 : 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeProject.name}</span>
        </button>
        {!isMobile && (
          <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.12em", flexShrink: 0 }}>{activeSection?.title || "—"}</div>
        )}
        <div style={{ fontSize: 10, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0, textAlign: "right", maxWidth: isMobile ? 130 : 260 }}>
          {activeProject.last_summary || "Start chatting →"}
        </div>
      </div>

      {/* MOBILE TAB BAR */}
      {isMobile && (
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          {[["brain", "Brain"], ["build", "Build"]].map(([id, label]) => (
            <button key={id} onClick={() => setMobileTab(id)} style={{ flex: 1, padding: "11px 0", fontSize: 11, fontFamily: C.font, letterSpacing: "0.1em", textTransform: "uppercase", background: "none", border: "none", borderBottom: `2px solid ${mobileTab === id ? C.accent : "transparent"}`, color: mobileTab === id ? C.accent : C.muted, cursor: "pointer" }}>
              <span style={{ marginRight: 5, fontSize: 8 }}>●</span>{label}
            </button>
          ))}
        </div>
      )}

      {/* PANELS */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── BRAIN PANEL ── */}
        {(!isMobile || mobileTab === "brain") && (
          <div style={{ width: isMobile ? "100%" : "42%", borderRight: isMobile ? "none" : `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {!isMobile && (
              <PanelHeader label="Brain" />
            )}
            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "14px 14px" : "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              {messages.length === 0 && (
                <div style={{ marginTop: 20, color: "#2e2e33" }}>
                  <div style={{ fontSize: 13, color: "#3a3a3a", marginBottom: 6 }}>
                    Working on <span style={{ color: C.accent }}>{activeSection?.title}</span>?
                  </div>
                  <div style={{ fontSize: 11 }}>Think out loud. AI suggests actions to commit to Build.</div>
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id} style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "90%", fontSize: 13, lineHeight: 1.65, padding: "10px 14px", borderRadius: 10, background: msg.role === "user" ? "#191920" : "#0e1a0e", border: `1px solid ${msg.role === "user" ? "#252530" : "#182418"}`, color: msg.role === "user" ? "#c0bdb5" : "#cce8a0" }}>
                    {msg.message}
                  </div>
                  {msg.actions?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxWidth: "90%" }}>
                      {msg.actions.map((a, i) => (
                        <ActionChip key={i} label={a.label} onClick={() => a.type === "followup" ? sendMessage(a.label) : handleAction(a)} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isThinking && (
                <div style={{ display: "flex", gap: 4, padding: "10px 14px", background: "#0e1a0e", border: "1px solid #182418", borderRadius: 10, width: "fit-content" }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, animation: `pulse 1.2s ${i*0.2}s infinite` }} />)}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            {/* Input */}
            <div style={{ padding: isMobile ? "10px 12px" : "12px 16px", borderTop: `1px solid ${C.borderSub}`, flexShrink: 0 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end", background: C.panelBg, border: "1px solid #1e1e26", borderRadius: 10, padding: "9px 12px" }}>
                <textarea value={inputVal} onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(inputVal); } }}
                  placeholder="Think out loud..." rows={1}
                  style={{ flex: 1, background: "none", border: "none", outline: "none", color: C.text, fontSize: 13, fontFamily: C.font, resize: "none", lineHeight: 1.5, maxHeight: 96 }} />
                <button onClick={() => sendMessage(inputVal)} disabled={isThinking || !inputVal.trim()}
                  style={{ background: C.accent, border: "none", borderRadius: 6, padding: "7px 16px", color: "#0d0d0f", fontSize: 14, fontFamily: C.font, cursor: "pointer", fontWeight: 600, opacity: (!inputVal.trim() || isThinking) ? 0.3 : 1, flexShrink: 0 }}>
                  →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── BUILD PANEL ── */}
        {(!isMobile || mobileTab === "build") && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Section tabs — horizontal scroll on mobile, vertical list on desktop */}
            {isMobile ? (
              <div style={{ flexShrink: 0, overflowX: "auto", display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderBottom: `1px solid ${C.border}`, scrollbarWidth: "none" }}>
                {sections.map(s => {
                  const has = hasContent(s.content_json);
                  const active = s.id === activeSectionId;
                  return (
                    <button key={s.id} onClick={() => setActiveSectionId(s.id)} style={{ flexShrink: 0, fontSize: 11, padding: "5px 12px", borderRadius: 20, border: `1px solid ${active ? C.accent : C.border}`, background: active ? C.accentBg : "transparent", color: active ? C.accent : C.muted, fontFamily: C.font, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 6, color: has ? C.accent : C.faint }}>●</span>{s.title}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Desktop: side column + editor row */
              null
            )}

            {/* Desktop: side column layout */}
            {!isMobile ? (
              <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                <div style={{ width: 172, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "10px 0", flexShrink: 0 }}>
                  <PanelHeader label="Build" />
                  {sections.map(s => {
                    const has = hasContent(s.content_json);
                    const active = s.id === activeSectionId;
                    return (
                      <button key={s.id} onClick={() => setActiveSectionId(s.id)} style={{ textAlign: "left", padding: "8px 16px", background: active ? C.cardBg : "none", border: "none", borderLeft: `2px solid ${active ? C.accent : "transparent"}`, color: active ? C.text : C.muted, fontSize: 12, fontFamily: C.font, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "color 0.1s" }}>
                        <span style={{ fontSize: 7, color: has ? C.accent : C.faint }}>●</span>{s.title}
                      </button>
                    );
                  })}
                </div>
                <div style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>
                  {activeSection ? <SectionEditor section={activeSection} onChange={updateSectionContent} isMobile={false} /> : <div style={{ color: C.faint, fontSize: 13 }}>Select a section</div>}
                </div>
              </div>
            ) : (
              /* Mobile: editor fills remaining space */
              <div style={{ flex: 1, padding: "18px 16px", overflowY: "auto" }}>
                {activeSection ? <SectionEditor section={activeSection} onChange={updateSectionContent} isMobile={true} /> : <div style={{ color: C.faint, fontSize: 13 }}>Select a section above</div>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500;600&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      ::-webkit-scrollbar { width: 3px; height: 3px; }
      ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
      textarea { min-height: 20px; }
      @keyframes pulse { 0%,100%{opacity:0.25;transform:scale(0.75)} 50%{opacity:1;transform:scale(1)} }
    `}</style>
  );
}

function PanelHeader({ label }) {
  return (
    <div style={{ padding: "0 16px 8px", fontSize: 10, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", borderBottom: `1px solid ${C.borderSub}`, marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ color: C.accent, fontSize: 8 }}>●</span>{label}
    </div>
  );
}

function ActionChip({ label, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ fontSize: 11, padding: "6px 13px", borderRadius: 20, border: `1px solid ${C.accent}`, background: hovered ? C.accent : "transparent", color: hovered ? "#0d0d0f" : C.accent, cursor: "pointer", fontFamily: C.font, letterSpacing: "0.04em", transition: "all 0.12s" }}>
      {label}
    </button>
  );
}

function hasContent(c) {
  return !!(c.text?.trim() || c.goal?.trim() || c.content?.trim() || c.items?.length || c.key_points?.length);
}

// ─── SECTION EDITOR ───────────────────────────────────────────────────────────
function SectionEditor({ section, onChange, isMobile }) {
  const c = section.content_json;
  const iStyle = { width: "100%", background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, fontFamily: C.font, padding: "10px 14px", outline: "none", lineHeight: 1.6 };
  const lStyle = { fontSize: 10, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 7, display: "block" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 600, color: C.text, marginBottom: 5 }}>{section.title}</div>
        <div style={{ width: 28, height: 2, background: C.accent, borderRadius: 1 }} />
      </div>
      {c.type === "chapter" && (<>
        <div>
          <label style={lStyle}>Goal</label>
          <input value={c.goal || ""} onChange={e => onChange("goal", e.target.value)} placeholder="What is this chapter about?" style={iStyle} />
        </div>
        <div>
          <label style={lStyle}>Key Points</label>
          <BulletEditor items={c.key_points || []} onChange={v => onChange("key_points", v)} />
        </div>
        <div>
          <label style={lStyle}>Content</label>
          <textarea value={c.content || ""} onChange={e => onChange("content", e.target.value)} placeholder="Write the chapter content..." rows={isMobile ? 6 : 8} style={{ ...iStyle, resize: "vertical" }} />
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
          <textarea value={c.text || ""} onChange={e => onChange("text", e.target.value)} placeholder="Start writing..." rows={isMobile ? 9 : 12} style={{ ...iStyle, resize: "vertical" }} />
        </div>
      )}
    </div>
  );
}

function BulletEditor({ items, onChange }) {
  const [newItem, setNewItem] = useState("");
  const add = () => { if (newItem.trim()) { onChange([...items, newItem.trim()]); setNewItem(""); } };
  const base = { background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 12, fontFamily: C.font, padding: "7px 10px", outline: "none" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ color: C.accent, fontSize: 10, flexShrink: 0 }}>▸</span>
          <input value={item} onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n); }} style={{ ...base, flex: 1 }} />
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "0 4px", flexShrink: 0 }}>×</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 6 }}>
        <input value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="Add item…" style={{ ...base, flex: 1, background: "#0a0a0d", border: "1px dashed #1e1e22", color: "#555" }} />
        <button onClick={add} style={{ background: C.accent, border: "none", borderRadius: 6, padding: "7px 14px", color: "#0d0d0f", fontSize: 13, fontFamily: C.font, cursor: "pointer", fontWeight: 600 }}>+</button>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ projects, onOpen, onNew, onDelete }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: C.font }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0}"}</style>
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
          <button onClick={onNew} style={{ background: C.accent, border: "none", borderRadius: 8, padding: isMobile ? "11px 22px" : "10px 20px", color: "#0d0d0f", fontSize: 12, fontFamily: C.font, fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em" }}>
            + New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div style={{ color: "#2a2a30", fontSize: 13, paddingTop: 28 }}>No projects yet. Start your first →</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {projects.map(p => (
              <div key={p.id} style={{ padding: "16px 0", borderBottom: `1px solid ${C.borderSub}`, display: "flex", alignItems: isMobile ? "flex-start" : "center", gap: 12, flexDirection: isMobile ? "column" : "row" }}>
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
                  <button onClick={() => onOpen(p)} style={{ background: C.cardBg, border: `1px solid #252530`, borderRadius: 6, padding: isMobile ? "8px 22px" : "6px 16px", color: C.text, fontSize: 11, fontFamily: C.font, cursor: "pointer" }}>Open</button>
                  <button onClick={() => onDelete(p.id)} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 6, padding: isMobile ? "8px 12px" : "6px 12px", color: C.muted, fontSize: 13, fontFamily: C.font, cursor: "pointer" }}>×</button>
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
  const iStyle = { width: "100%", background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, fontFamily: C.font, padding: "12px 14px", outline: "none" };
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: C.font }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0}"}</style>
      <div style={{ maxWidth: 500, margin: "0 auto", padding: isMobile ? "30px 18px" : "60px 24px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, fontFamily: C.font, fontSize: 12, cursor: "pointer", marginBottom: 30, display: "flex", alignItems: "center", gap: 6 }}>← Back</button>
        <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 600, marginBottom: 28, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: C.accent }}>◈</span> New Project
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div>
            <label style={{ fontSize: 10, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>Project Type</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.keys(TEMPLATES).map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                  style={{ padding: "7px 14px", borderRadius: 20, border: `1px solid ${form.type === t ? C.accent : C.border}`, background: form.type === t ? C.accentBg : "transparent", color: form.type === t ? C.accent : C.muted, fontSize: 12, fontFamily: C.font, cursor: "pointer" }}>
                  {TEMPLATES[t].icon} {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 10, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Project Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="My Amazing Project" style={iStyle} onKeyDown={e => e.key === "Enter" && form.name.trim() && onCreate()} />
          </div>
          <div>
            <label style={{ fontSize: 10, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Description <span style={{ color: C.faint }}>(optional)</span></label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What is this project about?" rows={3} style={{ ...iStyle, resize: "none" }} />
          </div>
          <button onClick={onCreate} disabled={!form.name.trim()}
            style={{ background: form.name.trim() ? C.accent : "#161618", border: "none", borderRadius: 8, padding: "13px", color: form.name.trim() ? "#0d0d0f" : C.faint, fontSize: 13, fontFamily: C.font, fontWeight: 600, cursor: form.name.trim() ? "pointer" : "not-allowed", letterSpacing: "0.06em", transition: "all 0.15s" }}>
            Create Project →
          </button>
        </div>
      </div>
    </div>
  );
}
