"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function ChatInterface() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! I am your PrepGenius Career ChatBot. Ask me anything about interviews, resumes, skills, or career planning.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 1. IF THERE IS A CHAT ID IN THE URL, LOAD THE HISTORY
  useEffect(() => {
    if (chatId) {
      setLoading(true);
      fetch(`/api/chatbot/history/${chatId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.messages.length > 0) {
            setMessages(data.messages);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: trimmed,
          sessionId: chatId // 2. SEND THE ID TO GROQ SO IT REMEMBERS
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) throw new Error(data.message);

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);

      // 3. IF THIS IS A NEW CHAT, UPDATE THE URL SO IT CAN BE SAVED
      if (!chatId && data.sessionId) {
        router.replace(`/career-tools/chatbot?chatId=${data.sessionId}`);
      }

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: error instanceof Error ? error.message : "Error" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="px-4 sm:px-5 py-2 rounded-full bg-black border border-white/10 text-lg font-bold shadow-lg">
          <span className="text-blue-400">Prep</span>Genius
        </div>

        <div className="flex gap-3">
          <Link href="/career-tools/chatbot/history" className="bg-gray-800 hover:bg-gray-700 transition-all duration-300 px-4 sm:px-6 py-2.5 rounded-xl font-semibold shadow-lg text-sm sm:text-base border border-white/10">
            Chat History
          </Link>
          <Link href="/career-tools" className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 px-4 sm:px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/20 text-sm sm:text-base">
            Back
          </Link>
        </div>
      </div>

      <div className="text-center mb-8 sm:mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-blue-500">
          AI Career ChatBot
        </h1>
        <p className="text-gray-400 mt-3 text-sm sm:text-base">
          {chatId ? "Continuing previous conversation..." : "Ask about interviews, skills, roadmaps, projects, or resume tips."}
        </p>
      </div>

      <div className="bg-[#07122b] border border-blue-500/20 rounded-3xl shadow-2xl shadow-blue-950/20 overflow-hidden">
        <div className="h-[65vh] overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((message, index) => (
            <div key={`msg-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm sm:text-base leading-7 whitespace-pre-wrap ${message.role === "user" ? "bg-blue-500 text-white" : "bg-white/10 text-gray-100 border border-white/10"}`}>
                {message.content.replace(/\*\*/g, '')}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/10 text-gray-100 border border-white/10 rounded-2xl px-4 py-3 text-sm sm:text-base">
                Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-white/10 p-4 sm:p-5 bg-black/20">
          <div className="flex flex-col sm:flex-row gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your career question here..."
              className="flex-1 min-h-[90px] resize-none rounded-2xl bg-black/50 border border-white/10 px-4 py-3 text-sm sm:text-base outline-none focus:border-blue-500"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="sm:w-32 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-300 text-white font-semibold px-5 py-3 rounded-2xl flex items-center justify-center"
            >
              {loading ? "Thinking..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Next.js requires search params to be wrapped in a Suspense boundary
export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-blue-600 opacity-10 blur-[140px] rounded-full left-[-120px] top-[120px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-600 opacity-10 blur-[120px] rounded-full right-[-120px] top-[180px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:90px_90px]" />
      
      <Suspense fallback={<div className="text-center py-20 text-white">Loading interface...</div>}>
        <ChatInterface />
      </Suspense>
    </div>
  );
}