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
      background: C.bg,
      minWidth: 0,
    }}>
      {isMobile ? (
        /* Mobile: horizontal scrolling section pills */
        <div style={{
          flexShrink: 0,
          overflowX: "auto",
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "12px 16px",
          borderBottom: `1px solid ${C.border}`,
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
                fontWeight: active ? 600 : 500,
                padding: "6px 14px",
                borderRadius: 20,
                border: `1px solid ${active ? C.accentBorder : C.border}`,
                background: active ? C.accentBg : "transparent",
                color: active ? C.accentText : C.textSub,
                fontFamily: C.font,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 5, color: has ? C.accent : C.muted, opacity: has ? 1 : 0.4 }}>●</span>
                {s.title}
              </button>
            );
          })}
        </div>
      ) : (
        /* Desktop: sidebar + editor */
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Section sidebar */}
          <div style={{
            width: 176,
            borderRight: `1px solid ${C.border}`,
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            background: C.panelBg,
          }}>
            <PanelHeader label="Build" />
            <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}>
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
                      padding: "9px 10px",
                      background: active ? C.accentBg : "transparent",
                      border: "none",
                      borderRadius: 8,
                      color: active ? C.accentText : C.muted,
                      fontSize: 13,
                      fontFamily: C.font,
                      fontWeight: active ? 600 : 400,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "all 0.12s",
                      marginBottom: 2,
                    }}
                  >
                    <span style={{ fontSize: 5, color: has ? C.accent : C.faint, flexShrink: 0 }}>●</span>
                    {s.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editor area */}
          <div ref={sectionFadeRef} style={{
            flex: 1,
            padding: "32px 36px",
            overflowY: "auto",
            minWidth: 0,
          }}>
            {activeSection
              ? <SectionEditor section={activeSection} onChange={updateSectionContent} isMobile={false} />
              : (
                <div style={{ color: C.muted, fontSize: 14, marginTop: 8, opacity: 0.6 }}>
                  Select a section to start writing.
                </div>
              )
            }
          </div>
        </div>
      )}

      {/* Mobile editor area */}
      {isMobile && (
        <div ref={sectionFadeRef} style={{ flex: 1, padding: "24px 20px", overflowY: "auto", background: C.bg }}>
          {activeSection
            ? <SectionEditor section={activeSection} onChange={updateSectionContent} isMobile={true} />
            : <div style={{ color: C.muted, fontSize: 13, opacity: 0.6 }}>Select a section above.</div>
          }
        </div>
      )}
    </div>
  );
}
