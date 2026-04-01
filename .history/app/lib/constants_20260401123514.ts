// Design tokens and templates
export const C = {
  bg: "#f5f5f3",
  border: "#e8e6e0",
  borderSub: "#f0eee8",
  text: "#111111",
  muted: "#7a7a73",
  faint: "#bdb9b0",
  accent: "#7f9462",
  accentBg: "#8aa05a12",
  panelBg: "#fcfcfa",
  cardBg: "#f9f8f5",
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
