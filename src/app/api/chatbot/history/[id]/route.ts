import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ChatSession } from "@/models/ChatSession";

// Next.js 15+ compatible route handler
export async function GET(req: Request, context: any) {
  try {
    await connectDB();
    
    // Safely await the parameters to prevent silent crashes
    const params = await context.params;
    const id = params.id;

    if (!id) {
      return NextResponse.json({ success: false, message: "No ID provided" }, { status: 400 });
    }

    const session = await ChatSession.findById(id);
    
    if (!session) {
      return NextResponse.json({ success: false, message: "Session not found" }, { status: 404 });
    }

    // Return the old messages back to the frontend
    return NextResponse.json({ success: true, messages: session.messages });
    
  } catch (error) {
    console.error("GET History Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}