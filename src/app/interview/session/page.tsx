"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InterviewSessionPage() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("interviewQuestions");
    if (stored) {
      const parsed = JSON.parse(stored);
      const cleaned = parsed.split("\n")
        .filter((q: string) => q.trim() !== "")
        .map((q: string) => q.replace(/^\d+[\.\)\s]+/, "").trim());
      setQuestions(cleaned);
      setAnswers(new Array(cleaned.length).fill(""));
    } else {
      router.push("/interview/setup");
    }
  }, [router]);

  const updateAnswer = (val: string) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = val;
    setAnswers(newAnswers);
  };

  const handleFinish = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/interview/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions, answers }),
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem("interviewFeedback", JSON.stringify(data.feedback));
        router.push("/interview/feedback");
      } else {
        alert("Error from server: " + (data.message || "Unknown error"));
        setIsGenerating(false);
      }
    } catch (error) {
      alert("Something went wrong generating feedback.");
      setIsGenerating(false);
    }
  };

  if (questions.length === 0) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      
      {/* HEADER SECTION - Added "Back to Setup" Button here */}
      <div className="flex items-center justify-between max-w-4xl mx-auto mb-8">
        <div className="px-5 py-2 rounded-full bg-black border border-white/10 text-xl font-bold shadow-lg">
          <span className="text-blue-400">Prep</span>Genius
        </div>
        
        <button 
          onClick={() => router.push("/interview/setup")}
          className="bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-2 rounded-xl text-sm font-semibold transition-all"
        >
          Back to Setup
        </button>
      </div>

      <div className="w-full max-w-4xl mx-auto bg-black border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">AI Interview Session</h1>
            <span className="text-gray-400 font-medium">Question {currentIndex + 1} / {questions.length}</span>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-6 min-h-[120px] flex items-center">
          <p className="text-lg text-gray-100 font-medium">
            <span className="text-blue-400 mr-2">{currentIndex + 1}.</span>
            {questions[currentIndex]}
          </p>
        </div>

        <textarea
          value={answers[currentIndex]}
          onChange={(e) => updateAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full h-48 bg-black border border-white/10 rounded-xl p-5 text-gray-200 focus:border-blue-500 outline-none mb-8 resize-none"
        />
        
        <div className="flex justify-between">
          <button 
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0 || isGenerating}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${currentIndex === 0 || isGenerating ? "opacity-30 cursor-not-allowed bg-gray-800" : "bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"}`}
          >
            ← Previous
          </button>

          <button 
            onClick={() => {
              if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
              } else {
                handleFinish();
              }
            }}
            disabled={isGenerating}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${isGenerating ? "bg-gray-600 cursor-not-allowed opacity-70" : "bg-green-600 hover:bg-green-700"}`}
          >
            {isGenerating ? "Analyzing Answers..." : (currentIndex < questions.length - 1 ? "Next Question" : "Submit Interview")}
          </button>
        </div>
      </div>
    </div>
  );
}