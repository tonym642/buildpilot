import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured." },
      { status: 500 }
    );
  }

  let body: { system?: string; messages?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { system, messages } = body;
  if (!messages?.length) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  try {
    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        ...(system ? [{ role: "system" as const, content: system }] : []),
        ...messages.map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      max_tokens: 1024,
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    // Try to parse JSON actions from the model response
    const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/) ?? raw.match(/(\{[\s\S]*\})/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        return NextResponse.json({
          message: parsed.text ?? raw,
          actions: parsed.actions ?? [],
        });
      } catch {}
    }

    return NextResponse.json({ message: raw, actions: [] });
  } catch (err: any) {
    console.error("OpenAI error:", err?.message ?? err);
    return NextResponse.json(
      { error: err?.message ?? "OpenAI request failed." },
      { status: 502 }
    );
  }
}
