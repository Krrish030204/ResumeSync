export interface ActionPlan {
  atsScore: number;
  atsFeedback: string;
  missingSkills: string[];
  recommendations: {
    section: string;
    keyword: string;
    suggestion: string;
  }[];
}

export async function extractActionPlan(resumeText: string, jobDescription: string): Promise<ActionPlan> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resumeText, jobDescription }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    if (errorData && errorData.error) {
      throw new Error(errorData.error);
    }
    
    if (response.status === 503) {
      throw new Error("Google AI is currently experiencing high demand. Please wait a few seconds and try clicking Sync again.");
    }
    
    throw new Error("Failed to communicate with the server. Please try again.");
  }

  const data = await response.json();
  return data as ActionPlan;
}
