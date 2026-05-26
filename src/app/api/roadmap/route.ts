import { NextResponse } from "next/server";
import { groq } from "@/lib/gemini"; 

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const role = body?.role?.toString().trim();

    if (!role) {
      return NextResponse.json({ success: false, message: "Role is required" }, { status: 400 });
    }

    const systemPrompt = `You are a Principal Engineer. The user wants to become a ${role}. 
    Create a step-by-step learning roadmap. 
    
    You MUST respond with ONLY a valid JSON object in this exact format. Do not include markdown formatting or backticks, just the raw JSON:
    {
      "title": "${role} Roadmap",
      "description": "Learn the core skills to become a ${role}.",
      "steps": [
        {
          "id": "1",
          "title": "HTML & CSS",
          "description": "Learn the basics of web structure and styling."
        },
        {
          "id": "2",
          "title": "JavaScript Basics",
          "description": "Learn variables, loops, and DOM manipulation."
        }
      ]
    }
    
    Provide 6 to 8 crucial steps in logical order.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate the JSON roadmap for ${role}` }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1, 
      response_format: { type: "json_object" }
    });

    let reply = chatCompletion.choices[0]?.message?.content || "{}";
    
    // THE FIX: Strip out sneaky markdown backticks before parsing
    reply = reply.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const jsonData = JSON.parse(reply);

    return NextResponse.json({ success: true, roadmap: jsonData });

  } catch (error) {
    console.error("API ROUTE ERROR:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}