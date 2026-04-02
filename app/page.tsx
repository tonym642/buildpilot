"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Project, Section, Message } from "../lib/types";
import AuthPanel from "../components/AuthPanel";
import OnboardingPanel from "../components/OnboardingPanel";
import Dashboard from "../components/Dashboard";
import CreateProject from "../components/CreateProject";
import Workspace from "../components/Workspace";
import AvatarMenu from "../components/AvatarMenu";
import { TEMPLATES } from "../lib/constants";
import { genId } from "../lib/utils";
import { persistence } from "../lib/persistence";

  export default function Page() {
    const [session, setSession] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [view, setView] = useState<"dashboard" | "create" | "workspace">("dashboard");
    const [projects, setProjects] = useState<Project[]>([]);
    type TemplateType = "Book" | "App" | "Business" | "Marketing" | "Custom";
    const [form, setForm] = useState<{ name: string; type: TemplateType; description: string }>({ name: "", type: "Book", description: "" });
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
    const [createError, setCreateError] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const [inputVal, setInputVal] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [mobileTab, setMobileTab] = useState("brain");
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const sectionFadeRef = useRef<HTMLDivElement | null>(null);

    // --- Effects ---
    useEffect(() => {
      // Mobile detection
      setIsMobile(window.innerWidth <= 600);
      const handleResize = () => setIsMobile(window.innerWidth <= 600);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
      // Supabase auth session
      const getSession = async () => {
        setAuthLoading(true);
        const { data, error } = await (supabase! as SupabaseClient)?.auth.getSession?.() ?? { data: null, error: null };
        if (data?.session) setSession(data.session);
        setAuthLoading(false);
      };
      getSession();
      const { data: listener } = (supabase! as SupabaseClient)?.auth.onAuthStateChange?.((event: string, session: any) => {
        setSession(session);
      }) ?? { data: { subscription: null } };
      return () => {
        listener?.subscription?.unsubscribe?.();
      };
    }, []);

    useEffect(() => {
      // Onboarding check
      if (typeof window !== "undefined" && !localStorage.getItem("bp_onboarded")) {
        setShowOnboarding(true);
      }
    }, []);

    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
      // Load projects whenever session is available
      const userId = session?.user?.id;
      if (!userId) return;
      persistence.getProjects(userId)
        .then(setProjects)
        .catch(() => setProjects([]));
    }, [session]);

    // --- Handlers ---
    const handleSignOut = async () => {
      await (supabase as SupabaseClient)?.auth.signOut?.();
      setSession(null);
      setView("dashboard");
    };
    // Navigation handlers
    const handleOpenProject = (project: Project) => {
      setActiveProject(project);
      persistence.getSections(project.id)
        .then(secs => {
          setSections(secs);
          setActiveSectionId(project.current_target_section_id || secs[0]?.id || null);
          setView("workspace");
        })
        .catch(() => {
          setSections([]);
          setView("workspace");
        });
    };
    const handleNewProject = () => setView("create");
    const handleBackToDashboard = () => setView("dashboard");

    // ── AI helpers ────────────────────────────────────────────────────────────
    function buildSystemPrompt(project: Project, secs: Section[], currentId: string | null) {
      const cur = secs.find(s => s.id === currentId);
      const summaries = secs.map(s => {
        const c = s.content_json;
        const preview = c.type === "chapter"
          ? `goal:${c.goal || "empty"} points:${(c.key_points || []).slice(0, 2).join(",") || "none"}`
          : c.type === "bullets" ? (c.items || []).slice(0, 3).join(", ") || "empty"
          : (c.text || "empty").slice(0, 80);
        return `[${s.title}]: ${preview}`;
      }).join("\n");
      return `You are Build Pilot AI for a ${project.type} project called "${project.name}". Description: ${project.description || "none"}.
Current section: ${cur?.title || "none"}. Content: ${cur ? JSON.stringify(cur.content_json) : "none"}.
Other sections:\n${summaries}

Respond ONLY with valid JSON (no markdown, no extra text):
{"text":"2-4 sentence response","actions":[{"label":"Short label","type":"action_type","target_section":"current","data":{}}]}
Action types: set_content(data:{text}), set_goal(data:{goal}), set_key_points(data:{key_points:[]}), set_bullets(data:{items:[]}), followup, next_section. Max 3 actions.`;
    }

    const handleAction = useCallback((action: any) => {
      const targetId = action.target_section === "current"
        ? activeSectionId
        : sections.find((s: Section) => s.key === action.target_section)?.id ?? activeSectionId;
      setSections((prev: Section[]) => prev.map(s => {
        if (s.id !== targetId) return s;
        const c = { ...s.content_json };
        if (action.type === "set_content" && action.data?.text) c.text = action.data.text;
        if (action.type === "set_goal" && action.data?.goal) c.goal = action.data.goal;
        if (action.type === "set_key_points" && action.data?.key_points) c.key_points = action.data.key_points;
        if (action.type === "set_bullets" && action.data?.items) c.items = action.data.items;
        return { ...s, content_json: c };
      }));
      if (action.type === "next_section") {
        const idx = sections.findIndex((s: Section) => s.id === activeSectionId);
        if (idx >= 0 && idx < sections.length - 1) setActiveSectionId(sections[idx + 1].id);
      }
      if (isMobile && action.type !== "followup") {
        setTimeout(() => setMobileTab("build"), 250);
      }
    }, [activeSectionId, sections, isMobile]);

    const sendMessage = useCallback(async (text: string) => {
      if (!text.trim() || isThinking || !activeProject) return;
      const userMsg: Message = { id: genId(), project_id: activeProject.id, role: "user", message: text, createdAt: Date.now() };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setInputVal("");
      setIsThinking(true);
      try {
        const sys = buildSystemPrompt(activeProject, sections, activeSectionId);
        const apiMsgs = nextMessages.slice(-18).map(m => ({ role: m.role, content: m.message }));
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ system: sys, messages: apiMsgs }),
        });
        const data = await res.json();
        const aiMsg: Message = {
          id: genId(),
          project_id: activeProject.id,
          role: "assistant",
          message: data.text || "Let me help you with that.",
          actions: data.actions || [],
          createdAt: Date.now(),
        };
        setMessages([...nextMessages, aiMsg]);
      } catch {
        setMessages([...nextMessages, {
          id: genId(), project_id: activeProject.id, role: "assistant",
          message: "Something went wrong. Please try again.", actions: [], createdAt: Date.now(),
        }]);
      }
      setIsThinking(false);
    }, [messages, isThinking, activeProject, sections, activeSectionId]);

    // Project creation handler
    const handleCreateProject = async () => {
      setCreateError(null);
      const userId = session?.user?.id;
      if (!userId) {
        setCreateError("Not signed in. Please sign in and try again.");
        return;
      }
      setCreating(true);
      try {
        const id = genId();
        const now = new Date().toISOString();
        const template = TEMPLATES[form.type];
        const newSections: Section[] = template.sections.map((s: any) => ({
          ...s,
          id: genId(),
          project_id: id,
          content_json: JSON.parse(JSON.stringify(s.content_json)),
        }));
        const project: Project = {
          id,
          name: form.name || "Untitled",
          type: form.type,
          description: form.description,
          last_summary: "",
          current_target_section_id: newSections[0]?.id,
          created_at: now,
          updated_at: now,
        };
        // Insert new project, then its sections — await both before navigating
        await persistence.createProject(project, userId);
        await persistence.saveSections(id, newSections);
        setProjects(prev => [project, ...prev]);
        setActiveProject(project);
        setSections(newSections);
        setActiveSectionId(newSections[0]?.id || null);
        setForm({ name: "", type: "Book", description: "" });
        setCreating(false);
        setView("workspace");
      } catch (err: any) {
        setCreating(false);
        setCreateError(err?.message ?? "Failed to create project. Please try again.");
      }
    };

    // If in fallback mode, skip AuthPanel and treat as always signed in
    const isFallback = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (authLoading) {
      return <div style={{ padding: 48, textAlign: "center", color: "#888", fontSize: 16 }}>Loading...</div>;
    }

    if (!session) return <AuthPanel onSignedIn={() => setSession({ user: { id: "local-fake" } })} />;
    if (showOnboarding) {
      return <OnboardingPanel onDone={() => { localStorage.setItem("bp_onboarded", "1"); setShowOnboarding(false); }} />;
    }

    // Signed-in UI
    return (
      <div>
        <div style={{ position: "fixed", top: 16, right: 20, zIndex: 200 }}>
          <AvatarMenu session={session} onSignOut={handleSignOut} />
        </div>
        {view === "dashboard" && (
          <Dashboard projects={projects} onOpen={handleOpenProject} onNew={handleNewProject} onDelete={() => {}} />
        )}
        {view === "create" && (
          <CreateProject form={form} setForm={setForm} onCreate={handleCreateProject} onBack={handleBackToDashboard} creating={creating} error={createError} />
        )}
        {view === "workspace" && activeProject && (
          <Workspace
            isMobile={isMobile}
            mobileTab={mobileTab}
            setMobileTab={setMobileTab}
            activeProject={activeProject}
            activeSection={sections.find(s => s.id === activeSectionId) || null}
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
            updateSectionContent={(updated) => setSections(prev => prev.map(s => s.id === updated.id ? updated : s))}
            sectionFadeRef={sectionFadeRef}
            onDashboard={handleBackToDashboard}
          />
        )}
      </div>
    );
  }




