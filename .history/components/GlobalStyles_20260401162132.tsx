"use client";
import { C } from "../lib/constants";

export default function GlobalStyles() {
  return (
    <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: ${C.bg}; color: ${C.text}; }
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-thumb { background: #d6d3cc; border-radius: 999px; }
  ::-webkit-scrollbar-track { background: transparent; }
  textarea, input, button { font: inherit; }
  textarea { min-height: 20px; }
  .fade-in { animation: fadeInUp 0.28s cubic-bezier(.4,.8,.4,1) both; }
  .fade-in-fast { animation: fadeInUp 0.16s cubic-bezier(.4,.8,.4,1) both; }
  .panel-fade { animation: fadeInPanel 0.32s cubic-bezier(.4,.8,.4,1) both; }
  .button-anim { transition: background 0.18s, color 0.18s, box-shadow 0.18s; }
  .input-anim { transition: border 0.18s, box-shadow 0.18s; }
  @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(16px); } 100% { opacity: 1; transform: none; } }
  @keyframes fadeInPanel { 0% { opacity: 0; transform: scale(0.98); } 100% { opacity: 1; transform: none; } }
  @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
  `}</style>
  );
}