"use client";
import { useRef } from "react";
import BrainPanel from "./BrainPanel";
import BuildPanel from "./BuildPanel";
import PanelHeader from "./PanelHeader";
import GlobalStyles from "./GlobalStyles";
import { C } from "../lib/constants";

export default function Workspace(props) {
  const {
    isMobile,
    mobileTab,
    setMobileTab,
    activeProject,
    activeSection,
    activeSectionId,
    setActiveSectionId,
    sections,
    messages,
    isThinking,
    inputVal,
    setInputVal,
    sendMessage,
    handleAction,
    chatEndRef,
    updateSectionContent,
    sectionFadeRef,
  } = props;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: C.bg,
      color: C.text,
      fontFamily: C.font,
      overflow: "hidden"
    }}>
      <GlobalStyles />
      {/* TOP BAR */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "0 18px" : "0 32px",
        height: isMobile ? 56 : 64,
        borderBottom: `1px solid ${C.borderSub}`,
        background: "rgba(247,247,245,0.78)",
        backdropFilter: "blur(18px)",
        flexShrink: 0,
        gap: 8,
        minWidth: 0
      }}>
        <button onClick={props.onDashboard} style={{ background: "none", border: "none", color: C.text, fontFamily: C.font, fontSize: isMobile ? 12 : 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
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
            {( [ ["brain", "Brain"], ["build", "Build"] ] as const ).map(([id, label]) => (
              <button key={id} onClick={() => setMobileTab(id)} style={{ flex: 1, padding: "11px 0", fontSize: 11, fontFamily: C.font, letterSpacing: "0.1em", textTransform: "uppercase", background: "none", border: "none", borderBottom: `2px solid ${mobileTab === id ? C.accent : "transparent"}`, color: mobileTab === id ? C.accent : C.muted, cursor: "pointer" }}>
                <span style={{ marginRight: 5, fontSize: 8 }}>●</span>{label}
              </button>
            ))}
        </div>
      )}
      {/* PANELS */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {(!isMobile || mobileTab === "brain") && (
          <BrainPanel
            isMobile={isMobile}
            messages={messages}
            isThinking={isThinking}
            inputVal={inputVal}
            setInputVal={setInputVal}
            sendMessage={sendMessage}
            handleAction={handleAction}
            chatEndRef={chatEndRef}
          />
        )}
        {(!isMobile || mobileTab === "build") && (
          <BuildPanel
            isMobile={isMobile}
            sections={sections}
            activeSection={activeSection}
            activeSectionId={activeSectionId}
            setActiveSectionId={setActiveSectionId}
            updateSectionContent={updateSectionContent}
            sectionFadeRef={sectionFadeRef}
          />
        )}
      </div>
    </div>
  );
}
