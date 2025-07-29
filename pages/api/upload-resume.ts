import type { NextApiRequest, NextApiResponse } from 'next';

let resumes: { name: string; content: string }[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, content } = req.body;
    if (!name || !content) {
      return res.status(400).json({ error: 'Missing name or content' });
    }
    resumes.push({ name, content });
    return res.status(200).json({ success: true, resume: { name, content } });
  } else if (req.method === 'GET') {
    return res.status(200).json({ resumes });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
} 