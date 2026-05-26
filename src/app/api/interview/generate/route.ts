export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { groq } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { role, difficulty, interviewType, selectedTech } = body;

    // Injecting a random seed forces the AI to process a mathematically unique prompt every single time,
    // which prevents it from repeating the same cached or high-probability questions.
    const randomSeed = Math.floor(Math.random() * 100000);

    const prompt = `
You are an expert, rigorous technical interviewer. Generate exactly 5 highly unique, challenging, and scenario-based interview questions for a ${role} position.

Difficulty: ${difficulty}.
Tech Stack: ${selectedTech.join(", ")}.
Randomization Seed: ${randomSeed}

CRITICAL QUALITY INSTRUCTIONS:
1. Do NOT ask standard, generic, or boilerplate questions (e.g., do not ask "What is the virtual DOM?").
2. Focus on real-world edge cases, system design tradeoffs, debugging complex issues, or scaling problems specific to the requested tech stack.
3. Make sure these questions test deep practical knowledge, not just textbook definitions.

FORMAT INSTRUCTIONS:
Return ONLY the questions. Do NOT number them. Put each question on a new line. Do not include any introductory text, headers, or markdown formatting.
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.85, // Bumped temperature slightly to increase creative variance
    });

    const text = chatCompletion.choices[0]?.message?.content || "";

    return NextResponse.json({
      success: true,
      questions: text,
    });
  } catch (error) {
    console.error("Error generating interview questions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate questions" }, 
      { status: 500 }
    );
  }
}