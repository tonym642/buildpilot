"use client";
import type { Section, Message, Project } from "../lib/types";
import BrainPanel from "./BrainPanel";
import BuildPanel from "./BuildPanel";
import GlobalStyles from "./GlobalStyles";
import { C } from "../lib/constants";

interface WorkspaceProps {
  isMobile: boolean;
  mobileTab: string;
  setMobileTab: (tab: string) => void;
  activeProject: Project;
  activeSection: Section | null;
  activeSectionId: string | null;
  setActiveSectionId: (id: string) => void;
  sections: Section[];
  messages: Message[];
  isThinking: boolean;
  inputVal: string;
  setInputVal: (val: string) => void;
  sendMessage: (msg: string) => void;
  handleAction: (action: any) => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  updateSectionContent: (section: Section) => void;
  sectionFadeRef: React.RefObject<HTMLDivElement | null>;
  onDashboard: () => void;
}

export default function Workspace(props: WorkspaceProps) {
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
    onDashboard,
  } = props;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: C.bg,
      color: C.text,
      fontFamily: C.font,
      overflow: "hidden",
    }}>
      <GlobalStyles />

      {/* TOP BAR */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "0 16px" : "0 24px",
        height: isMobile ? 48 : 56,
        borderBottom: `1px solid ${C.border}`,
        flexShrink: 0,
        gap: 12,
        minWidth: 0,
        background: C.panelBg,
      }}>
        {/* Left: logo + project name */}
        <button
          onClick={onDashboard}
          style={{
            background: "none",
            border: "none",
            color: C.text,
            fontFamily: C.font,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
            padding: "6px 10px",
            borderRadius: 10,
            transition: "background 0.15s",
            marginLeft: -10,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = C.surface)}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <span style={{
            width: 24, height: 24, borderRadius: 7,
            background: C.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, color: "#fff", fontWeight: 700, flexShrink: 0,
          }}>◈</span>
          <span style={{ maxWidth: isMobile ? 100 : 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
            {activeProject.name}
          </span>
        </button>

        {/* Center: active section label */}
        {!isMobile && (
          <div style={{
            fontSize: 12,
            color: C.muted,
            letterSpacing: "0.06em",
            fontWeight: 500,
            flexShrink: 0,
            textTransform: "uppercase",
          }}>
            {activeSection?.title || "—"}
          </div>
        )}

        {/* Right: summary preview */}
        <div style={{
          fontSize: 12,
          color: C.muted,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          minWidth: 0,
          textAlign: "right",
          maxWidth: isMobile ? 120 : 240,
          flex: isMobile ? 1 : "none",
        }}>
          {activeProject.last_summary || ""}
        </div>
      </div>

      {/* MOBILE TAB BAR */}
      {isMobile && (
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, flexShrink: 0, background: C.panelBg }}>
          {(["brain", "build"] as const).map(id => (
            <button
              key={id}
              onClick={() => setMobileTab(id)}
              style={{
                flex: 1,
                padding: "13px 0",
                fontSize: 12,
                fontFamily: C.font,
                fontWeight: 600,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${mobileTab === id ? C.accent : "transparent"}`,
                color: mobileTab === id ? C.accentText : C.muted,
                cursor: "pointer",
                transition: "color 0.15s",
              }}
            >
              {id === "brain" ? "Brain" : "Build"}
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
