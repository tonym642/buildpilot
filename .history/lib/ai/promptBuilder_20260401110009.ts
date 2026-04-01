// Builds the prompt for the AI model
import { AIMessage } from "./aiClient";

export function buildPrompt(messages: AIMessage[]): string {
  // Simple prompt builder, can be extended for system/context
  return messages.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.message}`).join("\n");
}
