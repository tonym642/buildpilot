// Design tokens and templates
export const C = {
  // Backgrounds
  bg:           "#0f1117",
  panelBg:      "#141920",
  cardBg:       "#191f2c",
  surface:      "#1e2436",

  // Borders
  border:       "#222a3a",
  borderSub:    "#1b2132",

  // Text
  text:         "#e0e4f0",
  textSub:      "#9ba5be",
  muted:        "#566070",
  faint:        "#232a3a",

  // Accent — muted blue
  accent:       "#4e79f5",
  accentHover:  "#3b68e4",
  accentText:   "#7a9fff",
  accentBg:     "rgba(78, 121, 245, 0.08)",
  accentBorder: "rgba(78, 121, 245, 0.20)",

  // Semantic
  error:        "#d95f5f",
  errorBg:      "rgba(217, 95, 95, 0.08)",
  success:      "#4aae7f",

  // Shadows
  shadow:       "0 2px 8px rgba(0,0,0,0.35)",
  shadowMd:     "0 4px 24px rgba(0,0,0,0.5)",

  font: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

export const TEMPLATES = {
  Book: {
    icon: "📖",
    sections: [
      { key: "book_concept", title: "Book Concept", sort_order: 0, content_json: { type: "simple", text: "" } },
      { key: "purpose", title: "Purpose", sort_order: 1, content_json: { type: "simple", text: "" } },
      { key: "chapter_1", title: "Chapter 1", sort_order: 2, content_json: { type: "chapter", goal: "", key_points: [], content: "" } },
      { key: "chapter_2", title: "Chapter 2", sort_order: 3, content_json: { type: "chapter", goal: "", key_points: [], content: "" } },
      { key: "chapter_3", title: "Chapter 3", sort_order: 4, content_json: { type: "chapter", goal: "", key_points: [], content: "" } },
    ],
  },
  App: {
    icon: "⚡",
    sections: [
      { key: "concept", title: "Concept", sort_order: 0, content_json: { type: "simple", text: "" } },
      { key: "problem", title: "Problem", sort_order: 1, content_json: { type: "simple", text: "" } },
      { key: "solution", title: "Solution", sort_order: 2, content_json: { type: "simple", text: "" } },
      { key: "features", title: "Features", sort_order: 3, content_json: { type: "bullets", items: [] } },
      { key: "mvp_scope", title: "MVP Scope", sort_order: 4, content_json: { type: "simple", text: "" } },
    ],
  },
  Business: {
    icon: "🏢",
    sections: [
      { key: "concept", title: "Concept", sort_order: 0, content_json: { type: "simple", text: "" } },
      { key: "audience", title: "Audience", sort_order: 1, content_json: { type: "simple", text: "" } },
      { key: "offer", title: "Offer", sort_order: 2, content_json: { type: "simple", text: "" } },
      { key: "marketing", title: "Marketing", sort_order: 3, content_json: { type: "simple", text: "" } },
      { key: "operations", title: "Operations", sort_order: 4, content_json: { type: "simple", text: "" } },
    ],
  },
  Marketing: {
    icon: "📣",
    sections: [
      { key: "goal", title: "Goal", sort_order: 0, content_json: { type: "simple", text: "" } },
      { key: "audience", title: "Audience", sort_order: 1, content_json: { type: "simple", text: "" } },
      { key: "message", title: "Message", sort_order: 2, content_json: { type: "simple", text: "" } },
      { key: "channels", title: "Channels", sort_order: 3, content_json: { type: "bullets", items: [] } },
      { key: "plan", title: "Plan", sort_order: 4, content_json: { type: "simple", text: "" } },
    ],
  },
  Custom: {
    icon: "✦",
    sections: [
      { key: "concept", title: "Concept", sort_order: 0, content_json: { type: "simple", text: "" } },
      { key: "notes", title: "Notes", sort_order: 1, content_json: { type: "simple", text: "" } },
    ],
  },
};