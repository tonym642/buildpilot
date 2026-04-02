"use client";
import { C } from "../lib/constants";

export default function GlobalStyles() {
  return (
    <style>{`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: ${C.bg}; color: ${C.text}; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 999px; }
  ::-webkit-scrollbar-thumb:hover { background: ${C.muted}; }
  ::-webkit-scrollbar-track { background: transparent; }
  textarea, input, button, select { font: inherit; }
  textarea { min-height: 20px; resize: none; }
  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: ${C.accent} !important;
    box-shadow: 0 0 0 3px ${C.accentBg} !important;
  }
  button:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; }
  .fade-in { animation: fadeInUp 0.24s cubic-bezier(.4,.8,.4,1) both; }
  .fade-in-fast { animation: fadeInUp 0.14s cubic-bezier(.4,.8,.4,1) both; }
  .panel-fade { animation: fadeIn 0.28s ease both; }
  @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: none; } }
  @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
  @keyframes pulse { 0%, 100% { opacity: 0.25; transform: scale(0.75); } 50% { opacity: 1; transform: scale(1); } }
  `}</style>
  );
}
