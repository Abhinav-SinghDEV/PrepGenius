"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type FeedbackData = {
  technicalScore: string;
  explanationQualityScore: string;
  confidenceScore: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  idealAnswerImprovements: string[];
};

export default function InterviewFeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);

  useEffect(() => {
    const storedFeedback = localStorage.getItem("interviewFeedback");

    if (storedFeedback) {
      try {
        const parsed = JSON.parse(storedFeedback);

        if (parsed && typeof parsed === "object") {
          setFeedback(parsed);
        }
      } catch (error) {
        console.error("Failed to parse feedback:", error);
      }
    }
  }, []);

  const renderList = (items: string[], colorClass: string) => {
    if (!items || items.length === 0) {
      return (
        <p className="text-gray-500 text-sm">
          No data available
        </p>
      );
    }

    return (
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className={`flex items-start gap-3 ${colorClass}`}
          >
            <span className="mt-1 text-lg leading-none">•</span>
            <span className="text-gray-200 leading-7">{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600 opacity-20 blur-[120px] rounded-full left-[-120px] top-[120px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-600 opacity-10 blur-[140px] rounded-full right-[-120px] top-[200px]" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:90px_90px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-10">
          <div className="px-5 py-2 rounded-full bg-black border border-white/10 text-xl font-bold shadow-lg">
            <span className="text-blue-400">Prep</span>Genius
          </div>

          <Link
            href="/dashboard"
            className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20"
          >
            Dashboard
          </Link>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            AI Interview Feedback
          </h1>
          <p className="text-gray-400 text-lg mt-4">
            Your performance summary, strengths, weaknesses, and improvement plan
          </p>
        </div>

        {!feedback ? (
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-2xl text-center">
            <p className="text-gray-300 text-lg">
              Feedback not found. Please complete an interview first.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Scores */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-blue-400">
                Scores
              </h2>

              <ul className="space-y-4">
                <li className="flex items-center justify-between rounded-2xl bg-black/40 border border-white/10 px-4 py-4">
                  <span className="text-gray-300 font-medium">Technical Score</span>
                  <span className="text-blue-400 font-bold text-lg">
                    {feedback.technicalScore}
                  </span>
                </li>

                <li className="flex items-center justify-between rounded-2xl bg-black/40 border border-white/10 px-4 py-4">
                  <span className="text-gray-300 font-medium">Explanation Quality</span>
                  <span className="text-purple-400 font-bold text-lg">
                    {feedback.explanationQualityScore}
                  </span>
                </li>

                <li className="flex items-center justify-between rounded-2xl bg-black/40 border border-white/10 px-4 py-4">
                  <span className="text-gray-300 font-medium">Confidence Score</span>
                  <span className="text-green-400 font-bold text-lg">
                    {feedback.confidenceScore}
                  </span>
                </li>
              </ul>
            </div>

            {/* Strengths + Weaknesses */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-blue-400">
                Strong Zones / Weak Zones
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-black/40 border border-green-500/20 p-5">
                  <h3 className="text-lg font-bold text-green-400 mb-4">
                    Strengths
                  </h3>
                  {renderList(feedback.strengths, "text-green-400")}
                </div>

                <div className="rounded-2xl bg-black/40 border border-red-500/20 p-5">
                  <h3 className="text-lg font-bold text-red-400 mb-4">
                    Weaknesses
                  </h3>
                  {renderList(feedback.weaknesses, "text-red-400")}
                </div>
              </div>
            </div>

            {/* Improvements */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-blue-400">
                Improvement Suggestions
              </h2>
              <div className="rounded-2xl bg-black/40 border border-yellow-500/20 p-5">
                {renderList(feedback.improvements, "text-yellow-400")}
              </div>
            </div>

            {/* Ideal Answer Improvement */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-blue-400">
                Ideal Answer Improvement
              </h2>
              <div className="rounded-2xl bg-black/40 border border-cyan-500/20 p-5">
                {renderList(feedback.idealAnswerImprovements, "text-cyan-400")}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}