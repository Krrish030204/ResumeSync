import { GoogleGenAI } from "@google/genai";

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
  const apiKey = localStorage.getItem("gemini_api_key");
  
  if (!apiKey) {
    throw new Error("No Gemini API key found. Please configure it in Settings.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are an expert ATS (Applicant Tracking System) parser and career coach.
    Compare the following Job Description to the provided Resume text.
    
    1. Calculate a strict ATS Match Score (0 to 100) based on how well the resume matches the required hard technical skills, tools, and years of experience in the JD.
    2. Provide a 1-2 sentence ATS feedback summary explaining why it received that score.
    3. Identify EXACTLY the HARD TECHNICAL SKILLS and TOOLS that are present in the JD but MISSING from the Resume. Ignore soft skills.
    4. For each missing skill, provide a specific, contextual recommendation on how to seamlessly integrate it into the resume. Point to a specific section (e.g., "Experience - Software Engineer at XYZ Corp", or "Skills Summary") and write a professional bullet point that weaves the keyword naturally into an achievement or task.

    OUTPUT EXACTLY AS A VALID JSON OBJECT matching this schema:
    {
      "atsScore": 65,
      "atsFeedback": "The resume lacks several core backend technologies mentioned in the JD, specifically Node.js and GraphQL.",
      "missingSkills": ["Node.js", "GraphQL"],
      "recommendations": [
        {
          "section": "Experience - Frontend Developer at XYZ",
          "keyword": "Node.js",
          "suggestion": "Expanded backend capabilities by building RESTful APIs using Node.js, improving data fetching speeds."
        }
      ]
    }
    
    If no skills are missing, still provide the score and feedback, but return empty arrays for missingSkills and recommendations.
    DO NOT output Markdown blocks (like \`\`\`json). Output RAW JSON only.

    Job Description:
    ${jobDescription}

    Resume:
    ${resumeText}
  `;

  let retries = 3;
  let lastError: any = null;

  while (retries > 0) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text || "";
      return JSON.parse(text) as ActionPlan;
    } catch (error: any) {
      console.error(`Gemini Error (retries left: ${retries - 1}):`, error);
      lastError = error;
      
      // If it's a JSON parse error, don't retry with wait, just throw
      if (error instanceof SyntaxError) {
        throw new Error("Failed to parse Gemini response as JSON. Try again.");
      }

      // If it's a 503 High Demand or 429 Too Many Requests, wait and retry
      if (error?.status === 503 || error?.status === 429 || error?.message?.includes("503") || error?.message?.includes("demand")) {
        retries--;
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
      } else {
        break;
      }
    }
  }

  const errorMessage = lastError?.message || "";
  if (errorMessage.includes("503") || errorMessage.includes("demand")) {
    throw new Error("Google AI is currently experiencing high demand. Please wait a few seconds and try clicking Sync again.");
  }
  
  throw new Error("Failed to communicate with Google AI. Please check your API key or try again.");
}
