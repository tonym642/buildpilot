// Central AI client abstraction for Build Pilot
import { buildPrompt } from "./promptBuilder";
import { parseAIResponse } from "./responseParser";

export type AIMessage = {
  id: string;
  role: "user" | "assistant";
  message: string;
  actions?: { label: string; type: string }[];
  createdAt?: number;
};

export async function callAI(messages: AIMessage[]): Promise<AIMessage> {
  try {
    const prompt = buildPrompt(messages);
    // Call local API route instead of direct provider
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();
    return parseAIResponse(data);
  } catch (err) {
    return {
      id: "error-" + Date.now(),
      role: "assistant",
      message: "Sorry, something went wrong. Please try again.",
    };
  }
}
