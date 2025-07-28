'use server';

import {
  getAgenticMetricsInsights,
  type AgenticMetricsInsightsInput,
} from '@/ai/flows/agentic-metrics-insights';

export async function handleGetInsights(input: AgenticMetricsInsightsInput) {
  try {
    const result = await getAgenticMetricsInsights(input);
    return {success: true, insights: result.insights};
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return {success: false, error: `Failed to get insights: ${errorMessage}`};
  }
}
