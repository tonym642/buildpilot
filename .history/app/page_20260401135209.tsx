
export default function Page() {
  // Navigation handlers
  const handleOpenProject = (project: Project) => {
    setActiveProject(project);
    setView("workspace");
  };
  const handleNewProject = () => setView("create");
  const handleBackToDashboard = () => setView("dashboard");

  // If in fallback mode, skip AuthPanel and treat as always signed in
  const isFallback = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (authLoading) {
    return <div style={{ padding: 48, textAlign: "center", color: "#888", fontSize: 16 }}>Loading...</div>;
  }

  if (!session && !isFallback) return <AuthPanel onSignedIn={() => setSession({ user: { id: "local-fake" } })} />;
  if (showOnboarding) {
    return <OnboardingPanel onDone={() => { localStorage.setItem("bp_onboarded", "1"); setShowOnboarding(false); }} />;
  }

  // Signed-in UI
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "18px 24px 0 0" }}>
        <button onClick={handleSignOut} style={{ background: "none", border: "none", color: "#888", fontSize: 14, cursor: "pointer", fontWeight: 500, borderRadius: 8, padding: "6px 14px" }}>Sign out</button>
      </div>
      {view === "dashboard" && (
        <Dashboard projects={projects} onOpen={handleOpenProject} onNew={handleNewProject} onDelete={() => {}} />
      )}
      {view === "create" && (
        <CreateProject form={form} setForm={setForm} onCreate={() => setView("dashboard")} onBack={handleBackToDashboard} />
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
          updateSectionContent={() => {}}
          sectionFadeRef={sectionFadeRef}
          onDashboard={handleBackToDashboard}
        />
      )}
    </div>
  );
}
// ...existing code for useFadeIn hook...




