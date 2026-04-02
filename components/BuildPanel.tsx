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
  if (content_json.type === "simple") return !!content_json.text?.trim();
  if (content_json.type === "chapter") return !!(content_json.goal || content_json.key_points?.length);
  if (content_json.type === "bullets") return content_json.items?.length > 0;
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
    }}>
      {isMobile ? (
        /* Mobile: horizontal scrolling section tabs */
        <div style={{
          flexShrink: 0,
          overflowX: "auto",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          borderBottom: `1px solid ${C.borderSub}`,
          scrollbarWidth: "none",
          background: C.panelBg,
        }}>
          {sections.map((s: Section) => {
            const has = hasContent(s.content_json);
            const active = s.id === activeSectionId;
            return (
              <button key={s.id} onClick={() => setActiveSectionId(s.id)} style={{
                flexShrink: 0,
                fontSize: 12,
                padding: "5px 14px",
                borderRadius: 20,
                border: `1px solid ${active ? C.accent : C.border}`,
                background: active ? C.accentBg : "transparent",
                color: active ? C.accent : C.muted,
                fontFamily: C.font,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                whiteSpace: "nowrap",
              }}>
                <span style={{ fontSize: 6, color: has ? C.accent : C.faint }}>●</span>
                {s.title}
              </button>
            );
          })}
        </div>
      ) : (
        /* Desktop: sidebar + editor */
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Section list sidebar */}
          <div style={{
            width: 180,
            borderRight: `1px solid ${C.borderSub}`,
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            background: C.panelBg,
          }}>
            <PanelHeader label="Build" />
            <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
              {sections.map((s: Section) => {
                const has = hasContent(s.content_json);
                const active = s.id === activeSectionId;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSectionId(s.id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "9px 16px",
                      background: active ? C.accentBg : "transparent",
                      border: "none",
                      borderLeft: `2px solid ${active ? C.accent : "transparent"}`,
                      color: active ? C.accent : C.muted,
                      fontSize: 13,
                      fontFamily: C.font,
                      fontWeight: active ? 600 : 400,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "color 0.12s, background 0.12s",
                    }}
                  >
                    <span style={{ fontSize: 6, color: has ? C.accent : C.faint, flexShrink: 0 }}>●</span>
                    {s.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editor area */}
          <div ref={sectionFadeRef} style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
            {activeSection
              ? <SectionEditor section={activeSection} onChange={updateSectionContent} isMobile={false} />
              : (
                <div style={{ color: C.faint, fontSize: 13, marginTop: 8 }}>
                  Select a section to start writing.
                </div>
              )
            }
          </div>
        </div>
      )}

      {/* Mobile editor area */}
      {isMobile && (
        <div ref={sectionFadeRef} style={{ flex: 1, padding: "18px 16px", overflowY: "auto" }}>
          {activeSection
            ? <SectionEditor section={activeSection} onChange={updateSectionContent} isMobile={true} />
            : <div style={{ color: C.faint, fontSize: 13 }}>Select a section above.</div>
          }
        </div>
      )}
    </div>
  );
}
