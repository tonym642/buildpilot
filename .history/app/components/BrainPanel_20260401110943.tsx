"use client";
import ActionChip from "./ActionChip";
import PanelHeader from "./PanelHeader";
import { C } from "../lib/constants";

export default function BrainPanel({ isMobile, messages, isThinking, inputVal, setInputVal, sendMessage, handleAction, chatEndRef }) {
  return (
    <div className="panel-fade" style={{
      width: isMobile ? "100%" : "45%",
      borderRight: isMobile ? "none" : `1px solid ${C.borderSub}`,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      background: C.panelBg,
      boxShadow: isMobile ? undefined : "inset -1px 0 0 rgba(0,0,0,0.03)"
    }}>
      {!isMobile && <PanelHeader label="Brain" />}
      <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "14px 14px" : "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.length === 0 && (
          <div style={{ marginTop: 32, color: C.text, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 17, fontWeight: 600, color: C.text, marginBottom: 4, letterSpacing: "-0.01em" }}>Welcome to Brain</div>
            <div style={{ fontSize: 13, color: C.muted, maxWidth: 340, textAlign: "center", lineHeight: 1.7 }}>
              This is your thinking space. Jot down ideas, questions, or plans.<br />
              <span style={{ color: C.text, fontWeight: 500 }}>Tip:</span> Start with a question, a goal, or a rough outline. The AI will help you organize.<br /><br />
              When you're ready, commit them to Build for structure.
            </div>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "90%",
              fontSize: 13,
              lineHeight: 1.65,
              padding: "10px 14px",
              borderRadius: 12,
              background: msg.role === "user" ? "rgba(255,255,255,0.82)" : "rgba(247,247,245,0.82)",
              border: `1px solid ${C.borderSub}`,
              color: msg.role === "user" ? C.text : C.accent
            }}>
              {msg.message}
            </div>
            {msg.actions?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxWidth: "90%" }}>
                {msg.actions.map((a, i) => (
                  <ActionChip key={i} label={a.label} onClick={() => a.type === "followup" ? sendMessage(a.label) : handleAction(a)} />
                ))}
              </div>
            )}
          </div>
        ))}
        {isThinking && (
          <div style={{ display: "flex", gap: 4, padding: "10px 14px", background: "rgba(247,247,245,0.82)", border: `1px solid ${C.borderSub}` , borderRadius: 12, width: "fit-content" }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, animation: `pulse 1.2s ${i*0.2}s infinite` }} />)}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div style={{
        padding: isMobile ? "14px" : "18px",
        borderTop: `1px solid ${C.borderSub}`,
        background: "rgba(247,247,245,0.82)",
        backdropFilter: "blur(18px)",
        flexShrink: 0
      }}>
        <div style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-end",
          background: "rgba(255,255,255,0.72)",
          border: `1px solid ${C.border}`,
          borderRadius: 18,
          padding: "10px 12px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.04)"
        }}>
          <textarea value={inputVal} onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(inputVal); } }}
            placeholder="Think out loud..." rows={1}
            style={{ flex: 1, background: "none", border: "none", outline: "none", color: C.text, fontSize: 13, fontFamily: C.font, resize: "none", lineHeight: 1.5, maxHeight: 96 }} />
          <button onClick={() => sendMessage(inputVal)} disabled={isThinking || !inputVal.trim()}
            style={{
              background: inputVal.trim() && !isThinking ? "#111111" : "#d8d6cf",
              border: "none",
              borderRadius: 12,
              padding: "8px 16px",
              color: "#ffffff",
              fontSize: 14,
              fontFamily: C.font,
              cursor: "pointer",
              fontWeight: 600,
              opacity: 1,
              flexShrink: 0,
              transition: "all 0.15s ease"
            }}>
            →
          </button>
        </div>
      </div>
    </div>
  );
}
