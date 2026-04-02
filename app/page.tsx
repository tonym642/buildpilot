"use client";

import React, { useState, useEffect, useRef } from "react";
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
            sendMessage={() => {}}
            handleAction={() => {}}
            chatEndRef={chatEndRef}
            updateSectionContent={(updated) => setSections(prev => prev.map(s => s.id === updated.id ? updated : s))}
            sectionFadeRef={sectionFadeRef}
            onDashboard={handleBackToDashboard}
          />
        )}
      </div>
    );
  }




