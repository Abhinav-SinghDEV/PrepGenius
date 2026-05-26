export const runtime = "nodejs";
export const dynamic = "force-dynamic"; 
export const revalidate = 0;

import { NextResponse } from "next/server";
import { groq } from "@/lib/gemini";
import { getAssessmentMeta } from "@/data/mcq-assessments";
import { fallbackMcqBank } from "@/data/mcq-fallback";

type GeneratedQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: string;
};

async function generateWithRetry(prompt: string, attempts = 2) {
  let lastError: unknown;
  
  for (let i = 0; i < attempts; i++) {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.9, //
        response_format: { type: "json_object" }, 
      });
      
      return chatCompletion.choices[0]?.message?.content || "";
      
    } catch (error) {
      lastError = error;
      console.warn(`[Attempt ${i + 1} Failed] Retrying MCQ generation...`);
    }
  }
  
  throw lastError;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = body.slug as string;
    const attemptId = body.attemptId ?? 0;

    const meta = getAssessmentMeta(slug);

    if (!meta) {
      return NextResponse.json(
        { success: false, message: "Assessment not found" },
        { status: 400 }
      );
    }

    //  DYNAMIC THEME INJECTION: Forces the AI to write puzzles in a completely new setting every time
    const themes = ["Space Exploration", "Medieval Kingdom", "Cyberpunk Future", "Deep Sea Submarine", "Jungle Expedition", "Corporate Tech Startup", "Time Travel Agency", "Mars Colony", "Arctic Research Lab", "Magical Academy"];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const randomSeed = Math.random().toString(36).substring(2, 15) + Date.now();

    const prompt = `
You are an expert MCQ question generator. Generate EXACTLY 10 multiple-choice questions for:

Title: ${meta.title}
Section: ${meta.section}
Focus Topics: ${meta.focusTopics.join(", ")}

CRITICAL UNIQUENESS INSTRUCTION: 
To guarantee these questions are unique, you MUST write the scenarios, word problems, and logic puzzles using this exact theme: "${randomTheme}". 
Do NOT use generic names like Alice/Bob or generic scenarios like trains/bridges. Use elements, characters, and situations from the "${randomTheme}" theme.

Rules:
- Create exactly 10 questions.
- Each question must have exactly 4 options.
- Only one option should be correct.
- Return ONLY valid JSON in this exact format:

{
  "questions": [
    {
      "id": 1,
      "question": "Question text based on the theme...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Correct Option"
    }
  ]
}

Do not add any markdown, code fences, or explanations. Just the JSON object.
`;

    let text = "";

    try {
      text = await generateWithRetry(prompt, 2);
    } catch (error) {
      console.warn(`⚠️ [MCQ FALLBACK TRIGGERED for ${slug}] The AI failed to generate in time. Serving fallback questions. Reason:`, error instanceof Error ? error.message : "Unknown API error");
      
      const fallbackQuestions = fallbackMcqBank[slug] || [];

      if (fallbackQuestions.length === 0) {
        return NextResponse.json(
          { success: false, message: "Failed to generate MCQ questions" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        questions: fallbackQuestions,
        meta: { title: meta.title, section: meta.section },
        fallback: true,
      });
    }

    const cleanedText = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Model did not return valid JSON");
    }

    const parsed = JSON.parse(jsonMatch[0]) as { questions?: GeneratedQuestion[] };

    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error("No questions returned by model");
    }

    return NextResponse.json({
      success: true,
      questions: parsed.questions.slice(0, 10),
      meta: { title: meta.title, section: meta.section },
      fallback: false,
    });
  } catch (error) {
    console.error("MCQ GENERATION ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate MCQ questions" },
      { status: 500 }
    );
  }
}