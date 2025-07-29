
'use server';
/**
 * @fileOverview An AI agent that generates a notification email with profile ranking results.
 *
 * - sendNotification - A function that handles the email generation process.
 * - SendNotificationInput - The input type for the sendNotification function.
 * - SendNotificationOutput - The return type for the sendNotification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { MatchResult } from './compare-profiles-flow';

const SendNotificationInputSchema = z.object({
  jobDescriptionName: z.string().describe('The name of the job description file.'),
  matches: z.array(z.object({
    profileName: z.string(),
    matchScore: z.number(),
    justification: z.string(),
  })).describe('The ranked list of consultant profiles with their match scores and justifications.'),
});
export type SendNotificationInput = z.infer<typeof SendNotificationInputSchema>;


const SendNotificationOutputSchema = z.object({
  emailSubject: z.string().describe('The subject line for the notification email.'),
  emailBody: z.string().describe('The full HTML content of the notification email.'),
});
export type SendNotificationOutput = z.infer<typeof SendNotificationOutputSchema>;

export async function sendNotification(input: SendNotificationInput): Promise<SendNotificationOutput> {
  return sendNotificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sendNotificationPrompt',
  input: {schema: SendNotificationInputSchema},
  output: {schema: SendNotificationOutputSchema},
  prompt: `You are a helpful recruitment assistant. Your task is to generate a notification email to a hiring manager with the results of a profile comparison analysis.

The email should be professional, clear, and concise. It should include the job description title, a summary of the top matches, and a formatted list of the ranked profiles with their scores and justifications.

Job Description: {{{jobDescriptionName}}}

Ranked Profiles:
---
{{#each matches}}
Profile: {{{this.profileName}}}
Score: {{{this.matchScore}}}%
Justification: {{{this.justification}}}
---
{{/each}}

Generate an appropriate subject line and a well-formatted HTML email body.
`,
});

const sendNotificationFlow = ai.defineFlow(
  {
    name: 'sendNotificationFlow',
    inputSchema: SendNotificationInputSchema,
    outputSchema: SendNotificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
