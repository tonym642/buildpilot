"use client";
import PanelHeader from "./PanelHeader";
import SectionEditor from "./SectionEditor";
import { C } from "../lib/constants";
import type { Section } from "../lib/types";

interface BuildPanelProps {
  isMobile: boolean;
  sections: Section[];
  activeSection: Section | null;
  activeSectionId: string | null;
  setActiveSectionId: (id: string) => void;
  updateSectionContent: (section: Section) => void;
  sectionFadeRef: React.RefObject<HTMLDivElement | null>;
}

function hasContent(content_json: any) {
  if (!content_json) return false;
  if (content_json.type === "simple" && content_json.text) return !!content_json.text.trim();
  if (content_json.type === "chapter" && (content_json.goal || (content_json.key_points && content_json.key_points.length > 0))) return true;
  if (content_json.type === "bullets" && content_json.items && content_json.items.length > 0) return true;
  return false;
}

export default function BuildPanel({ isMobile, sections, activeSection, activeSectionId, setActiveSectionId, updateSectionContent, sectionFadeRef }: BuildPanelProps) {
  return (
    <div className="panel-fade" style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      background: C.cardBg,
      boxShadow: "0 0 0 1px rgba(0,0,0,0.02)"
    }}>
      {isMobile ? (
        <div style={{ flexShrink: 0, overflowX: "auto", display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderBottom: `1px solid ${C.borderSub}`, scrollbarWidth: "none" }}>
          {sections.map((s: Section) => {
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
        <div style={{ width: 172, borderRight: `1px solid ${C.borderSub}`, display: "flex", flexDirection: "column", padding: "10px 0", flexShrink: 0 }}>
          <PanelHeader label="Build" />
          {sections.map((s: Section) => {
            const has = hasContent(s.content_json);
            const active = s.id === activeSectionId;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSectionId(s.id)}
                style={{
                  textAlign: "left",
                  padding: "10px 16px",
                  background: active ? "rgba(255,255,255,0.72)" : "transparent",
                  border: "none",
                  borderLeft: `2px solid ${active ? "#2a2a2a" : "transparent"}`,
                  color: active ? C.text : C.muted,
                  fontSize: 13,
                  fontFamily: C.font,
                  fontWeight: active ? 500 : 400,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.15s ease"
                }}
              >
                <span style={{ fontSize: 7, color: has ? C.accent : C.faint }}>●</span>{s.title}
              </button>
            );
          })}
        </div>
      )}
      <div style={{ flex: 1, padding: isMobile ? "18px 16px" : "24px 28px", overflowY: "auto" }}>
        {activeSection ? (
          <div ref={sectionFadeRef} className="fade-in">
            <SectionEditor section={activeSection} onChange={updateSectionContent} isMobile={isMobile} />
          </div>
        ) : <div style={{ color: C.faint, fontSize: 13 }}>{isMobile ? "Select a section above" : "Select a section"}</div>}
      </div>
    </div>
  );
}
