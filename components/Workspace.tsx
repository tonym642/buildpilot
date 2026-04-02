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
        padding: isMobile ? "0 14px" : "0 24px",
        height: isMobile ? 48 : 52,
        borderBottom: `1px solid ${C.border}`,
        flexShrink: 0,
        gap: 8,
        minWidth: 0,
      }}>
        <button
          onClick={onDashboard}
          style={{
            background: "none",
            border: "none",
            color: C.text,
            fontFamily: C.font,
            fontSize: isMobile ? 12 : 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
          }}
        >
          <span style={{ color: C.accent }}>◈</span>
          <span style={{ maxWidth: isMobile ? 90 : 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {activeProject.name}
          </span>
        </button>
        {!isMobile && (
          <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", flexShrink: 0 }}>
            {activeSection?.title || "—"}
          </div>
        )}
        <div style={{
          fontSize: 10,
          color: C.muted,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          minWidth: 0,
          textAlign: "right",
          maxWidth: isMobile ? 130 : 260,
        }}>
          {activeProject.last_summary || "Start chatting →"}
        </div>
      </div>

      {/* MOBILE TAB BAR */}
      {isMobile && (
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          {(["brain", "build"] as const).map(id => (
            <button
              key={id}
              onClick={() => setMobileTab(id)}
              style={{
                flex: 1,
                padding: "11px 0",
                fontSize: 11,
                fontFamily: C.font,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${mobileTab === id ? C.accent : "transparent"}`,
                color: mobileTab === id ? C.accent : C.muted,
                cursor: "pointer",
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
