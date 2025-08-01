import type { NextApiRequest, NextApiResponse } from 'next';

let jds: { name: string; content: string }[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, content } = req.body;
    if (!name || !content) {
      return res.status(400).json({ error: 'Missing name or content' });
    }
    jds.push({ name, content });
    return res.status(200).json({ success: true, jd: { name, content } });
  } else if (req.method === 'GET') {
    return res.status(200).json({ jds });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
} 