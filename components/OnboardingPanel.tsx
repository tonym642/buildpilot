"use client";
import { useState } from "react";
import { C } from "../lib/constants";
import GlobalStyles from "./GlobalStyles";

export default function OnboardingPanel({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Build Pilot",
      body: (
        <>
          <p style={{ color: C.text, fontSize: 15, fontWeight: 500, marginBottom: 12, lineHeight: 1.6 }}>
            Your calm workspace for building ideas.
          </p>
          <p style={{ color: C.textSub, fontSize: 14, lineHeight: 1.8 }}>
            Build Pilot helps you think, commit, and build â€” faster and with clarity.
          </p>
        </>
      ),
    },
    {
      title: "How it works",
      body: (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: "16px 20px", background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.accentText, marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Brain</div>
              <div style={{ color: C.textSub, fontSize: 14, lineHeight: 1.7 }}>Think out loud. Jot ideas, questions, or plans. The AI helps you organize.</div>
            </div>
            <div style={{ padding: "16px 20px", background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.accentText, marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Build</div>
              <div style={{ color: C.textSub, fontSize: 14, lineHeight: 1.7 }}>Commit your best thoughts. Build turns them into structure and action.</div>
            </div>
          </div>
          <div style={{ marginTop: 20, color: C.muted, fontSize: 12, textAlign: "center", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Think â†’ Commit â†’ Build
          </div>
        </>
      ),
    },
    {
      title: "Get started",
      body: (
        <>
          <p style={{ color: C.textSub, fontSize: 14, lineHeight: 1.8, marginBottom: 12 }}>
            Create your first project. Choose a template or start from scratch. You can always change it later.
          </p>
          <p style={{ color: C.muted, fontSize: 13 }}>You're in control. Calm, clear, and ready to build.</p>
        </>
      ),
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      color: C.text,
      fontFamily: C.font,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
    }}>
      <GlobalStyles />

      <div style={{ width: 420, maxWidth: "100%" }}>
        {/* Step indicators */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 44 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 24 : 6,
              height: 6,
              borderRadius: 999,
              background: i === step ? C.accent : C.border,
              transition: "width 0.25s ease, background 0.25s ease",
            }} />
          ))}
        </div>

        <div style={{
          background: C.panelBg,
          border: `1px solid ${C.border}`,
          borderRadius: 18,
          padding: "40px 36px",
          boxShadow: C.shadowMd,
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 20 }}>
            {steps[step].title}
          </div>
          <div style={{ marginBottom: 36 }}>
            {steps[step].body}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {step > 0 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{
                  background: "none", border: `1px solid ${C.border}`,
                  borderRadius: 10, padding: "10px 20px",
                  color: C.textSub, fontSize: 14, cursor: "pointer",
                  fontFamily: C.font, fontWeight: 500,
                  transition: "border-color 0.15s",
                }}
              >Back</button>
            ) : <div />}

            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                style={{
                  background: C.accent, color: "#fff", border: "none",
                  borderRadius: 12, padding: "11px 28px",
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                  fontFamily: C.font, letterSpacing: "0.01em",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
                onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
              >Continue</button>
            ) : (
              <button
                onClick={onDone}
                style={{
                  background: C.accent, color: "#fff", border: "none",
                  borderRadius: 12, padding: "11px 28px",
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                  fontFamily: C.font, letterSpacing: "0.01em",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
                onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
              >Get Started</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
  const [step, setStep] = useState(0);
