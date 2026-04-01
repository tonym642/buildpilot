// Parses and normalizes AI responses
import { AIMessage } from "./aiClient";

export function parseAIResponse(data: any): AIMessage {
  // Defensive parsing for malformed/partial responses
  if (!data || typeof data !== "object") {
    return {
      id: "error-" + Date.now(),
      role: "assistant",
      message: "Sorry, I couldn't understand the response.",
    };
  }
  let message = "";
  let actions = undefined;
  try {
    message = typeof data.message === "string" ? data.message : JSON.stringify(data);
    if (Array.isArray(data.actions)) {
      actions = data.actions.map((a: any) => ({
        label: typeof a.label === "string" ? a.label : "Action",
        type: typeof a.type === "string" ? a.type : "other"
      }));
    }
  } catch {
    message = JSON.stringify(data);
  }
  return {
    id: data.id || "ai-" + Date.now(),
    role: "assistant",
    message,
    actions,
  };
}
