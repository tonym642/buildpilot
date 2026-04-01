"use client";
import { useRef } from "react";
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
			borderRight: isMobile ? "none" : `1px solid ${C.borderSub}`,
			display: "flex",
			flexDirection: "column",
			overflow: "hidden",
			background: C.panelBg,
			boxShadow: isMobile ? undefined : "inset -1px 0 0 rgba(0,0,0,0.03)"
		}}>
			<div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "18px 8px 12px 8px" : "16px 20px", display: "flex", flexDirection: "column", gap: isMobile ? 18 : 14, WebkitOverflowScrolling: isMobile ? "touch" : undefined }}>
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
				{messages.map((msg: Message) => (
					<div key={msg.id} style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
						<div style={{
							maxWidth: isMobile ? "98%" : "90%",
							fontSize: isMobile ? 16 : 13,
							lineHeight: 1.7,
							padding: isMobile ? "15px 14px 15px 14px" : "10px 14px",
							borderRadius: isMobile ? 15 : 12,
							background: msg.role === "user" ? "rgba(255,255,255,0.82)" : "rgba(247,247,245,0.82)",
							border: `1px solid ${C.borderSub}`,
							color: msg.role === "user" ? C.text : C.accent,
							marginBottom: isMobile ? 2 : 0
						}}>
							{msg.message}
						</div>
						{Array.isArray(msg.actions) && msg.actions.length > 0 && (
							<div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxWidth: "90%" }}>
								{msg.actions.map((a: any, i: number) => (
									<button key={i} onClick={() => a.type === "followup" ? sendMessage(a.label) : handleAction(a)} style={{ background: C.accentBg, color: C.accent, border: `1px solid ${C.accent}`, borderRadius: 10, padding: "4px 12px", fontSize: 12, fontWeight: 500, cursor: "pointer", marginRight: 4, marginBottom: 4, transition: "background 0.15s" }}>{a.label}</button>
								))}
							</div>
						)}
					</div>
				))}
				{isThinking && (
					<div style={{ display: "flex", gap: 4, padding: "10px 14px", background: C.accentBg, border: `1px solid ${C.accent}`, borderRadius: 10, width: "fit-content" }}>
						{[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, animation: `pulse 1.2s ${i*0.2}s infinite` }} />)}
					</div>
				)}
				<div ref={chatEndRef} />
			</div>
			<div style={{ padding: isMobile ? "10px 12px" : "12px 16px", borderTop: `1px solid ${C.borderSub}", flexShrink: 0 }}>
				<div style={{ display: "flex", gap: 8, alignItems: "flex-end", background: C.panelBg, border: "1px solid #1e1e26", borderRadius: 10, padding: "9px 12px" }}>
					<textarea value={inputVal} onChange={e => setInputVal(e.target.value)}
						onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(inputVal); } }}
						placeholder="Think out loud..." rows={1}
						style={{ flex: 1, background: "none", border: "none", outline: "none", color: C.text, fontSize: 13, fontFamily: C.font, resize: "none", lineHeight: 1.5, maxHeight: 96 }} />
					<button onClick={() => sendMessage(inputVal)} disabled={isThinking || !inputVal.trim()}
						style={{ background: C.accent, border: "none", borderRadius: 6, padding: "7px 16px", color: "#0d0d0f", fontSize: 14, fontFamily: C.font, cursor: "pointer", fontWeight: 600, opacity: (!inputVal.trim() || isThinking) ? 0.3 : 1, flexShrink: 0 }}>
						→
					</button>
				</div>
			</div>
		</div>
	);
}