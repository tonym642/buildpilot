// Local API route stub for AI integration
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // For now, just echo back a canned response for structure
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    // In the future, connect to real AI provider here
    const { prompt } = req.body;
    res.status(200).json({
      id: 'ai-dummy',
      message: 'This is a placeholder AI response. (Backend integration ready.)',
      actions: [
        { label: 'Try again', type: 'followup' }
      ]
    });
  } catch (err) {
    res.status(500).json({ error: 'AI error' });
  }
}
