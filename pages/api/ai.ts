import type { NextApiRequest, NextApiResponse } from 'next';

const PROVIDER_URL = process.env.AI_PROVIDER_URL ?? 'https://api.anthropic.com/v1/messages';
const PROVIDER_KEY = process.env.AI_PROVIDER_KEY ?? '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { system, messages } = req.body ?? {};

  if (!PROVIDER_KEY) {
    // No key configured — return a useful stub so the UI still works
    res.status(200).json({
      text: 'AI is not configured yet. Add AI_PROVIDER_KEY to your environment variables.',
      actions: [{ label: 'Got it', type: 'followup' }],
    });
    return;
  }

  try {
    const aiRes = await fetch(PROVIDER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': PROVIDER_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system,
        messages,
      }),
    });

    if (!aiRes.ok) {
      const errBody = await aiRes.text();
      console.error('Anthropic error:', aiRes.status, errBody);
      res.status(502).json({ error: `AI provider returned ${aiRes.status}` });
      return;
    }

    const data = await aiRes.json();
    const raw = data.content?.map((b: any) => b.text ?? '').join('') ?? '';

    // Try to parse JSON response from the model
    const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/) ?? raw.match(/(\{[\s\S]*\})/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        res.status(200).json({ text: parsed.text ?? raw, actions: parsed.actions ?? [] });
        return;
      } catch {}
    }

    res.status(200).json({ text: raw, actions: [] });
  } catch (err) {
    console.error('AI API error:', err);
    res.status(500).json({ error: 'AI error' });
  }
}
