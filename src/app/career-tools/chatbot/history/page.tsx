"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Define the shape of our Session data
type Session = {
  id: string;
  title: string;
  date: string;
};

export default function ChatHistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH SESSIONS FROM MONGODB ON LOAD
  useEffect(() => {
    fetch("/api/chatbot/history")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSessions(data.sessions);
        }
      })
      .catch((error) => console.error("Error fetching history:", error))
      .finally(() => setLoading(false));
  }, []);

  // DELETE ALL SESSIONS FROM MONGODB
  const clearChats = async () => {
    if (confirm("Are you sure you want to delete all chat history? This cannot be undone.")) {
      try {
        const res = await fetch("/api/chatbot/history", {
          method: "DELETE",
        });
        const data = await res.json();
        
        if (data.success) {
          setSessions([]); // Clear the UI instantly
        }
      } catch (error) {
        console.error("Failed to clear chats:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden font-sans">
      {/* Background Glow Effects */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600 opacity-5 blur-[140px] rounded-full left-[-120px] top-[-100px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10">
        
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center mb-10">
          <Link 
            href="/career-tools/chatbot" 
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
          >
            <span className="mr-2">←</span> Back to Chat Dashboard
          </Link>
          
          <button 
            onClick={clearChats}
            disabled={loading || sessions.length === 0}
            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            Clear Chats
          </button>
        </div>

        {/* Header Section */}
        <div className="mb-12 border-b border-white/5 pb-8">
          <div className="inline-flex items-center gap-2 bg-[#0a192f] border border-blue-500/30 text-blue-400 px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-4">
            <span>↺</span> CONVERSATION ARCHIVE
          </div>
          <h1 className="text-5xl font-extrabold text-[#38bdf8] tracking-tight mb-4">
            Your Chat History
          </h1>
          <p className="text-gray-400 text-lg">
            Revisit previous AI career chats, continue planning, and refine your next moves.
          </p>
          
          {!loading && (
            <div className="mt-6 inline-flex items-center gap-2 bg-[#0f172a] border border-white/10 px-4 py-2 rounded-lg text-sm text-gray-300">
              <span className="text-blue-400">✨</span> {sessions.length} saved conversation{sessions.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Chat History List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 bg-[#07122b] border border-white/5 rounded-2xl">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-6 w-32 bg-white/10 rounded mb-4"></div>
                <div className="h-4 w-48 bg-white/5 rounded"></div>
              </div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-20 bg-[#07122b] border border-white/5 rounded-2xl">
              <p className="text-gray-500 text-lg">No chat history found.</p>
              <Link href="/career-tools/chatbot" className="text-blue-400 hover:underline mt-2 inline-block">
                Start a new conversation
              </Link>
            </div>
          ) : (
            sessions.map((session) => (
              <Link 
                href={`/career-tools/chatbot?chatId=${session.id}`} 
                key={session.id}
                className="block group"
              >
                <div className="bg-[#0b1120] border border-white/5 hover:border-blue-500/30 transition-all duration-300 rounded-2xl p-6 flex justify-between items-center relative overflow-hidden">
                  
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-[#facc15] mb-2 group-hover:text-yellow-300 transition-colors">
                      {session.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-2">📅</span> {session.date}
                    </div>
                  </div>

                  <div className="relative z-10 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    →
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

      </div>
    </div>
  );
}