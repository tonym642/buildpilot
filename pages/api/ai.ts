import type { NextApiRequest, NextApiResponse } from 'next';

// Read provider info from environment
const PROVIDER_URL = process.env.AI_PROVIDER_URL;
const PROVIDER_KEY = process.env.AI_PROVIDER_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const { prompt } = req.body;
    // If provider env not set, return dummy response
    if (!PROVIDER_URL || !PROVIDER_KEY) {
      res.status(200).json({
        id: 'ai-dummy',
        message: 'This is a placeholder AI response. (Backend integration ready.)',
        actions: [
          { label: 'Try again', type: 'followup' }
        ]
      });
      return;
    }
    // Example: Uncomment and implement real provider call below
    /*
    const aiRes = await fetch(PROVIDER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': PROVIDER_KEY,
      },
      body: JSON.stringify({ prompt }),
    });
    if (!aiRes.ok) throw new Error('AI provider error');
    const data = await aiRes.json();
    res.status(200).json(data);
    return;
    */
    // Fallback dummy
    res.status(200).json({
      id: 'ai-dummy',
      message: 'This is a placeholder AI response. (Backend integration ready.)',
      actions: [
        { label: 'Try again', type: 'followup' }
      ]
    });
  } catch (err) {
    // Log error for debugging, but do not expose details to client
    console.error('AI API error:', err);
    res.status(500).json({ error: 'AI error' });
  }
}
