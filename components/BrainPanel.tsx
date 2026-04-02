"use client";
import { C } from "../lib/constants";
import type { Message } from "../lib/types";

interface BrainPanelProps {
  isMobile: boolean;
  messages: Message[];
  isThinking: boolean;
  inputVal: string;
  setInputVal: (val: string) => void;
  sendMessage: (msg: string) => void;
  handleAction: (action: any) => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function BrainPanel({ isMobile, messages, isThinking, inputVal, setInputVal, sendMessage, handleAction, chatEndRef }: BrainPanelProps) {
  return (
    <div className="panel-fade" style={{
      width: isMobile ? "100%" : "45%",
      borderRight: isMobile ? "none" : `1px solid ${C.border}`,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      background: C.panelBg,
      flexShrink: 0,
    }}>
      {/* Message list */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: isMobile ? "24px 16px 12px" : "28px 24px 16px",
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 16 : 14,
      }}>
        {messages.length === 0 && (
          <div style={{
            marginTop: 48,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            textAlign: "center",
          }}>
            <div style={{ fontSize: 28, marginBottom: 4, opacity: 0.25, color: C.accent }}>â—ˆ</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text, letterSpacing: "-0.01em" }}>
              Welcome to Brain
            </div>
            <div style={{ fontSize: 13, color: C.textSub, maxWidth: 280, lineHeight: 1.85 }}>
              Think out loud. Jot ideas, questions, or plans â€” the AI will help you organize and commit them to Build.
            </div>
          </div>
        )}

        {messages.map((msg: Message) => (
          <div key={msg.id} style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: msg.role === "user" ? "flex-end" : "flex-start",
          }}>
            <div style={{
              maxWidth: isMobile ? "90%" : "86%",
              fontSize: isMobile ? 15 : 14,
              lineHeight: 1.75,
              padding: isMobile ? "12px 16px" : "10px 14px",
              borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              background: msg.role === "user" ? C.accent : C.cardBg,
              border: msg.role === "user" ? "none" : `1px solid ${C.border}`,
              color: msg.role === "user" ? "#fff" : C.text,
              boxShadow: msg.role === "user" ? "none" : C.shadow,
            }}>
              {msg.message}
            </div>

            {Array.isArray(msg.actions) && msg.actions.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxWidth: "86%" }}>
                {msg.actions.map((a: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => a.type === "followup" ? sendMessage(a.label) : handleAction(a)}
                    style={{
                      background: C.accentBg,
                      color: C.accentText,
                      border: `1px solid ${C.accentBorder}`,
                      borderRadius: 8,
                      padding: "5px 12px",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "background 0.15s",
                      fontFamily: C.font,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = `rgba(78, 121, 245, 0.14)`)}
                    onMouseLeave={e => (e.currentTarget.style.background = C.accentBg)}
                  >{a.label}</button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div style={{
            display: "flex",
            gap: 5,
            padding: "11px 16px",
            background: C.cardBg,
            border: `1px solid ${C.border}`,
            borderRadius: "14px 14px 14px 4px",
            width: "fit-content",
            alignItems: "center",
            boxShadow: C.shadow,
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%",
                background: C.accent,
                animation: `pulse 1.2s ${i * 0.22}s infinite`,
              }} />
            ))}
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div style={{
        padding: isMobile ? "12px 16px 20px" : "12px 20px 16px",
        borderTop: `1px solid ${C.border}`,
        flexShrink: 0,
        background: C.panelBg,
      }}>
        <div style={{
          display: "flex",
          gap: 8,
          alignItems: "flex-end",
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "10px 14px",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}>
          <textarea
            value={inputVal}
            onChange={e => {
              setInputVal(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(inputVal);
              }
            }}
            placeholder="Think out loudâ€¦"
            rows={1}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: C.text,
              fontSize: 14,
              fontFamily: C.font,
              resize: "none",
              lineHeight: 1.6,
              maxHeight: 120,
              overflowY: "auto",
              overflowX: "hidden",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              width: 0,
            }}
          />
          <button
            onClick={() => sendMessage(inputVal)}
            disabled={isThinking || !inputVal.trim()}
            style={{
              background: C.accent,
              border: "none",
              borderRadius: 9,
              width: 34,
              height: 34,
              color: "#fff",
              fontSize: 16,
              fontFamily: C.font,
              cursor: "pointer",
              fontWeight: 600,
              opacity: (!inputVal.trim() || isThinking) ? 0.25 : 1,
              flexShrink: 0,
              transition: "opacity 0.15s, background 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={e => !isThinking && inputVal.trim() && (e.currentTarget.style.background = C.accentHover)}
            onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
          >â†‘</button>
        </div>
      </div>
    </div>
  );
}
