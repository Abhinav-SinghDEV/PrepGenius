import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ChatSession } from "@/models/ChatSession";

export const dynamic = "force-dynamic";

// FETCH ALL CHAT SESSIONS
export async function GET() {
  try {
    await connectDB();
    
    // Fetch all sessions, sorted by newest first, and only grab the ID, title, and date
    const sessions = await ChatSession.find({})
      .select("_id title createdAt")
      .sort({ createdAt: -1 });

    // Format the data to match your frontend UI requirements
    const formattedSessions = sessions.map(session => ({
      id: session._id.toString(),
      title: session.title,
      date: new Date(session.createdAt).toLocaleString(),
    }));

    return NextResponse.json({ success: true, sessions: formattedSessions });
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// DELETE ALL CHAT SESSIONS (For the "Clear Chats" button)
export async function DELETE() {
  try {
    await connectDB();
    await ChatSession.deleteMany({});
    
    return NextResponse.json({ success: true, message: "All history cleared" });
  } catch (error) {
    console.error("Failed to clear history:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}