export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { groq } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ADDED DEFAULTS HERE so it never crashes if the frontend forgets to send them
    const {
      role = "Candidate",
      difficulty = "Standard",
      interviewType = "Technical",
      selectedTech = [], 
      questions = [],
      answers = [],
    } = body;

    const prompt = `
You are an expert AI technical interviewer evaluating a candidate's performance.

Role: ${role}
Difficulty: ${difficulty}
Interview Type: ${interviewType}
Tech Stack: ${selectedTech.join(", ")}

Here are the questions asked and the candidate's answers:
Questions: ${JSON.stringify(questions)}
Answers: ${JSON.stringify(answers)}

You MUST evaluate these answers and return ONLY a valid JSON object matching this exact structure. Do not include markdown, code fences, or any other text. 
{
  "technicalScore": "Score out of 10 (e.g., '8/10')",
  "explanationQualityScore": "Score out of 10 (e.g., '7/10')",
  "confidenceScore": "Score out of 10 (e.g., '9/10')",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "idealAnswerImprovements": ["ideal answer tip 1", "ideal answer tip 2"]
}
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      response_format: { type: "json_object" }, // 🛡️ Forces perfect JSON output
    });

    const rawText = chatCompletion.choices[0]?.message?.content || "{}";
    
    // Parse the AI's string response into an actual JavaScript object
    const structuredFeedback = JSON.parse(rawText);

    return NextResponse.json({
      success: true,
      feedback: structuredFeedback, // Send the perfect object to the frontend
    });

  } catch (error) {
    console.error("FEEDBACK GENERATION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate feedback",
      },
      { status: 500 }
    );
  }
}