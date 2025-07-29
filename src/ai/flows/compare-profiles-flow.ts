
'use server';
/**
 * @fileOverview An AI agent that compares consultant profiles against a job description.
 *
 * - compareProfiles - A function that handles the profile comparison process.
 * - CompareProfilesInput - The input type for the compareProfiles function.
 * - CompareProfilesOutput - The return type for the compareProfiles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompareProfilesInputSchema = z.object({
  jobDescription: z.string().describe('The text content of the job description.'),
  profiles: z.array(z.object({
    name: z.string().describe('The filename or identifier of the profile.'),
    content: z.string().describe('The text content of the consultant profile.'),
  })).describe('An array of consultant profiles to compare against the job description.'),
});
export type CompareProfilesInput = z.infer<typeof CompareProfilesInputSchema>;


const MatchResultSchema = z.object({
  profileName: z.string().describe('The name of the profile being evaluated.'),
  matchScore: z.number().int().min(0).max(100).describe('A score from 0-100 indicating the match quality.'),
  justification: z.string().describe('A brief explanation for the assigned match score, highlighting key strengths and weaknesses.'),
});

const CompareProfilesOutputSchema = z.object({
  matches: z.array(MatchResultSchema).describe('A ranked list of profiles with their match scores and justifications.'),
});

export type CompareProfilesOutput = z.infer<typeof CompareProfilesOutputSchema>;
export type MatchResult = z.infer<typeof MatchResultSchema>;

export async function compareProfiles(input: CompareProfilesInput): Promise<CompareProfilesOutput> {
  return compareProfilesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareProfilesPrompt',
  input: {schema: CompareProfilesInputSchema},
  output: {schema: CompareProfilesOutputSchema},
  prompt: `You are an expert recruitment agent. Your task is to analyze a job description and a list of consultant profiles.
For each profile, you must provide a match score from 0 to 100 and a brief justification for your score.

The match score should reflect how well the consultant's skills and experience align with the requirements in the job description.
The justification should clearly state the reasons for the score, mentioning specific skills, technologies, or experience from both the JD and the profile.

Rank the final list of profiles from the highest match score to the lowest.

Job Description:
---
{{{jobDescription}}}
---

Consultant Profiles:
---
{{#each profiles}}
Profile Name: {{{this.name}}}
Profile Content:
{{{this.content}}}
---
{{/each}}
`,
});

const compareProfilesFlow = ai.defineFlow(
  {
    name: 'compareProfilesFlow',
    inputSchema: CompareProfilesInputSchema,
    outputSchema: CompareProfilesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
