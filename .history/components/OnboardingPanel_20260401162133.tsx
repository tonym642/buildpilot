"use client";
import { useState } from "react";

export default function OnboardingPanel({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: "Welcome to Build Pilot",
      body: (
        <>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 10 }}>Your calm workspace for building ideas.</div>
          <div style={{ color: "#555", fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>
            Build Pilot helps you think, commit, and buildfaster and with clarity.
          </div>
        </>
      )
    },
    {
      title: "How it works",
      body: (
        <>
          <div style={{ fontWeight: 500, marginBottom: 6 }}>Brain</div>
          <div style={{ color: "#555", fontSize: 14, marginBottom: 12 }}>Think out loud. Jot ideas, questions, or plans. The AI helps you organize.</div>
          <div style={{ fontWeight: 500, marginBottom: 6 }}>Build</div>
          <div style={{ color: "#555", fontSize: 14, marginBottom: 12 }}>Commit your best thoughts. Build turns them into structure and action.</div>
          <div style={{ color: "#888", fontSize: 13 }}>Think  Commit  Build</div>
        </>
      )
    },
    {
      title: "Get started",
      body: (
        <>
          <div style={{ color: "#555", fontSize: 14, marginBottom: 12 }}>Create your first project. Choose a template or start from scratch. You can always change it later.</div>
          <div style={{ color: "#888", fontSize: 13 }}>Youre in control. Calm, clear, and ready to build.</div>
        </>
      )
    }
  ];

  return (
    <div style={{ maxWidth: 360, margin: "0 auto", padding: "56px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 18, letterSpacing: "-0.01em" }}>{steps[step].title}</div>
      <div style={{ marginBottom: 28, width: "100%" }}>{steps[step].body}</div>
      <div style={{ display: "flex", gap: 10 }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{ background: "none", border: "none", color: "#888", fontSize: 14, cursor: "pointer", borderRadius: 8, padding: "7px 18px" }}>Back</button>
        )}
        {step < steps.length - 1 ? (
          <button onClick={() => setStep(s => s + 1)} style={{ background: "#222", color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 15, fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>Next</button>
        ) : (
          <button onClick={onDone} style={{ background: "#222", color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 15, fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>Start</button>
        )}
      </div>
    </div>
  );
}