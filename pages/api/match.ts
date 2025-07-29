import type { NextApiRequest, NextApiResponse } from 'next';

let resumesStore: { name: string; content: string }[] = [];
try {
  // Try to import the global resumes array from upload-resume
  // @ts-ignore
  resumesStore = require('./upload-resume').resumes || [];
} catch {}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  let { jd, resumes } = req.body;
  if (!jd) {
    return res.status(400).json({ error: 'Missing JD' });
  }
  if (!resumes || !Array.isArray(resumes) || resumes.length === 0) {
    // Use all uploaded resumes if not provided
    try {
      // @ts-ignore
      resumes = require('./upload-resume').resumes || [];
    } catch {
      resumes = [];
    }
  }
  // Dummy scoring: just return first 3 resumes with random scores
  const topMatches = resumes.slice(0, 3).map((resume: any) => ({
    name: resume.name,
    score: Math.floor(Math.random() * 21) + 80 // 80-100
  }));
  return res.status(200).json({ success: true, matches: topMatches });
} 