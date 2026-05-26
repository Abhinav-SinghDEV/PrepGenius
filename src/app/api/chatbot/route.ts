export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { groq } from "@/lib/gemini"; 
import { connectDB } from "@/lib/mongodb"; 
import { ChatSession } from "@/models/ChatSession";

// THE GOD MODE FALLBACK
const GOD_MODE_FALLBACK = "That is an excellent question. When building scalable applications, managing state is crucial. In this project, I engineered a custom MongoDB session layer to persist chat history and provide contextual memory. I'd be happy to walk you through the system architecture!";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Notice we now pass an array of messages instead of just a single string!
async function getGroqReply(messages: any[], maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: messages,
        model: "llama-3.3-70b-versatile",
      });
      return chatCompletion.choices[0]?.message?.content || "";
    } catch (error: any) {
      console.warn(`⚠️ [Attempt ${attempt} Failed] Groq API busy. Retrying...`);
      if (attempt === maxRetries) throw error;
      await delay(2000); 
    }
  }
}

export async function POST(req: Request) {
  try {
    await connectDB(); 

    const body = await req.json().catch(() => null);
    const message = body?.message?.toString().trim();
    const sessionId = body?.sessionId; // We are now looking for an active session!

    if (!message) {
      return NextResponse.json({ success: false, message: "Message is required" }, { status: 400 });
    }

    console.log(`💬 Processing message for session: ${sessionId || 'NEW'}`);

    let session;
    let previousMessages: any[] = [];

    // 1. FIND OR CREATE THE MONGODB SESSION
    if (sessionId) {
      session = await ChatSession.findById(sessionId);
      if (session) {
        // Extract old messages so Groq remembers the context
        previousMessages = session.messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        }));
      }
    } 
    
    if (!session) {
      // Create a brand new session. Use the first 4-5 words of the prompt as the Title.
      const title = message.split(" ").slice(0, 5).join(" ") + (message.split(" ").length > 5 ? "..." : "");
      session = new ChatSession({ title, messages: [] });
    }

    // 2. BUILD THE PROMPT ARRAY WITH MEMORY
    const systemPrompt = { 
        role: "system", 
        content: "You are PrepGenius AI Career ChatBot. Help users with interview prep, DSA, and career planning. Be friendly, concise, and give practical advice." 
    };
    
    const currentUserMessage = { role: "user", content: message };
    
    // We combine the System Instructions + Past Memory + New Question
    const groqMessages = [systemPrompt, ...previousMessages, currentUserMessage];

    try {
      // 3. ASK GROQ (Now with full memory!)
      const reply = await getGroqReply(groqMessages);

      // 4. SAVE TO DATABASE
      if (reply) {
        session.messages.push({ role: "user", content: message });
        session.messages.push({ role: "assistant", content: reply });
        await session.save();
      }

      // Return the reply AND the sessionId so the frontend can update the URL
      return NextResponse.json({ success: true, reply, sessionId: session._id });
      
    } catch (apiError) {
      console.error("API ROUTE ERROR:", apiError);
      return NextResponse.json({ success: true, reply: GOD_MODE_FALLBACK, fallback: true, sessionId: session?._id });
    }
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({ success: true, reply: GOD_MODE_FALLBACK, fallback: true });
  }
}