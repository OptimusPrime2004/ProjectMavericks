'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing insights into agentic framework metrics.
 *
 * - getAgenticMetricsInsights - A function that retrieves and formats agentic framework metrics for display.
 * - AgenticMetricsInsightsInput - The input type for the getAgenticMetricsInsights function.
 * - AgenticMetricsInsightsOutput - The return type for the getAgenticMetricsInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AgenticMetricsInsightsInputSchema = z.object({
  queueData: z
    .string()
    .describe('The data from agentic framework-managed queues.'),
  latencyData: z
    .string()
    .describe('The data from agentic framework-managed latencies.'),
  errorRateData: z
    .string()
    .describe('The data from agentic framework-managed error rates.'),
});
export type AgenticMetricsInsightsInput = z.infer<typeof AgenticMetricsInsightsInputSchema>;

const AgenticMetricsInsightsOutputSchema = z.object({
  insights: z
    .string()
    .describe(
      'Formatted insights into agentic framework metrics, including queues, latencies, and error rates.'
    ),
});
export type AgenticMetricsInsightsOutput = z.infer<typeof AgenticMetricsInsightsOutputSchema>;

export async function getAgenticMetricsInsights(
  input: AgenticMetricsInsightsInput
): Promise<AgenticMetricsInsightsOutput> {
  return agenticMetricsInsightsFlow(input);
}

const agenticMetricsInsightsPrompt = ai.definePrompt({
  name: 'agenticMetricsInsightsPrompt',
  input: {schema: AgenticMetricsInsightsInputSchema},
  output: {schema: AgenticMetricsInsightsOutputSchema},
  prompt: `You are an AI assistant that provides insights into agentic framework metrics.

You will receive data about queues, latencies, and error rates. Your task is to format
this data into a human-readable summary that highlights key performance indicators
and potential bottlenecks.

Present the insights in a clear and concise manner, suitable for display in an admin
console. Use markdown formatting for readability.

Queues Data: {{{queueData}}}
Latencies Data: {{{latencyData}}}
Error Rates Data: {{{errorRateData}}}`,
});

const agenticMetricsInsightsFlow = ai.defineFlow(
  {
    name: 'agenticMetricsInsightsFlow',
    inputSchema: AgenticMetricsInsightsInputSchema,
    outputSchema: AgenticMetricsInsightsOutputSchema,
  },
  async input => {
    const {output} = await agenticMetricsInsightsPrompt(input);
    return output!;
  }
);
