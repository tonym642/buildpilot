
"use client";

import { useState, useRef, useEffect } from "react";
import { TEMPLATES } from "./lib/constants";
import type { Project, Section, Message } from "./lib/types";
import { useIsMobile } from "./lib/utils";
import CreateProject from "./components/CreateProject";
import Dashboard from "./components/Dashboard";
import Workspace from "./components/Workspace";

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




