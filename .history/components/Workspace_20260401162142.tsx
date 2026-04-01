"use client";
import { useRef } from "react";
import type { Section, Message, Project } from "../lib/types";

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
import BrainPanel from "./BrainPanel";
import BuildPanel from "./BuildPanel";
import PanelHeader from "./PanelHeader";
import GlobalStyles from "./GlobalStyles";
import { C } from "../lib/constants";

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
      {/* ...rest of Workspace UI... */}
    </div>
  );
}