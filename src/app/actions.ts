
'use server';

import {
  getAgenticMetricsInsights,
  type AgenticMetricsInsightsInput,
} from '@/ai/flows/agentic-metrics-insights';

import {
    compareProfiles,
    type CompareProfilesInput,
    type MatchResult,
} from '@/ai/flows/compare-profiles-flow';

import {
    sendNotification,
    type SendNotificationInput
} from '@/ai/flows/send-notification-flow';

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

export { type MatchResult };
export async function handleCompareProfiles(input: CompareProfilesInput) {
  try {
    const result = await compareProfiles(input);
    // Sort matches from highest to lowest score
    const sortedMatches = result.matches.sort((a, b) => b.matchScore - a.matchScore);
    return { success: true, matches: sortedMatches };
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to compare profiles: ${errorMessage}` };
  }
}


export async function handleSendNotification(input: SendNotificationInput) {
  try {
    const result = await sendNotification(input);
    return { success: true, email: result };
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to generate notification: ${errorMessage}` };
  }
}
