"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Trophy, Brain, Target, ClipboardList } from "lucide-react";

interface AssessmentResult {
  id: string;
  subject: string;
  score: number;
  totalQuestions: number;
  date: string;
  feedback?: string;
}

export default function AssessmentHistoryDashboard() {
  const [history, setHistory] = useState<AssessmentResult[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const storedHistory = localStorage.getItem("mcqHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear all your assessment history?")) {
      localStorage.removeItem("mcqHistory");
      setHistory([]);
    }
  };

  // Calculations
  const totalAssessments = history.length;
  const totalQuestions = history.reduce((acc, curr) => acc + curr.totalQuestions, 0);
  
  const averageScore = totalAssessments > 0 
    ? (history.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions), 0) / totalAssessments) * 100 
    : 0;
    
  const latestQuiz = totalAssessments > 0 ? history[history.length - 1] : null;
  const latestScore = latestQuiz ? (latestQuiz.score / latestQuiz.totalQuestions) * 100 : 0;

  // Categorization logic
  const aptitudeCount = history.filter(h => h.subject.toLowerCase().includes("aptitude") || h.subject.toLowerCase().includes("reasoning")).length;
  const coreCount = history.filter(h => h.subject.toLowerCase().includes("dbms") || h.subject.toLowerCase().includes("operating") || h.subject.toLowerCase().includes("network")).length;
  const technicalCount = totalAssessments - aptitudeCount - coreCount;

  // Prepare Chart Data
  const chartData = history.map((h) => {
    const d = new Date(h.date);
    return {
      date: `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`,
      score: Math.round((h.score / h.totalQuestions) * 100)
    };
  });

  if (!mounted) return null; // Prevent hydration mismatch on reload

  return (
    <div className="min-h-screen bg-[#050505] text-white relative font-sans">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto p-6 md:p-10 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center pt-4 pb-6">
          <div className="w-full flex justify-start mb-4">
            <button 
              onClick={() => router.push("/career-tools/practice-assessments")}
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              ← Back to Assessments
            </button>
          </div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 tracking-tight">
            Assessments History
          </h1>
        </div>

        {/* Top Stat Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#0a0a0a] border border-blue-900/50 p-6 rounded-xl shadow-[0_0_20px_rgba(0,112,243,0.15)] flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <h3 className="text-blue-100 font-semibold text-lg">Average Score</h3>
              <Trophy className="text-yellow-500 w-5 h-5" />
            </div>
            <div>
              <p className="text-4xl font-bold text-green-500">{averageScore.toFixed(1)}%</p>
              <p className="text-gray-400 text-xs mt-1">Across all assessments</p>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-blue-900/50 p-6 rounded-xl shadow-[0_0_20px_rgba(0,112,243,0.15)] flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <h3 className="text-blue-100 font-semibold text-lg">Questions Practiced</h3>
              <Brain className="text-yellow-500 w-5 h-5" />
            </div>
            <div>
              <p className="text-4xl font-bold text-green-500">{totalQuestions}</p>
              <p className="text-gray-400 text-xs mt-1">Total questions</p>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-blue-900/50 p-6 rounded-xl shadow-[0_0_20px_rgba(0,112,243,0.15)] flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <h3 className="text-blue-100 font-semibold text-lg">Latest Score</h3>
              <Target className="text-yellow-500 w-5 h-5" />
            </div>
            <div>
              <p className="text-4xl font-bold text-green-500">{latestScore.toFixed(1)}%</p>
              <p className="text-gray-400 text-xs mt-1">Most recent quiz</p>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-blue-900/50 p-6 rounded-xl shadow-[0_0_20px_rgba(0,112,243,0.15)] flex flex-col justify-between h-40">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-blue-100 font-semibold text-lg">Assessments Taken</h3>
              <ClipboardList className="text-yellow-500 w-5 h-5" />
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-gray-300">Aptitude Assessment: <span className="text-green-500 font-bold">{aptitudeCount}</span></p>
              <p className="text-gray-300">Technical: <span className="text-green-500 font-bold">{technicalCount}</span></p>
              <p className="text-gray-300">Core Subjects: <span className="text-green-500 font-bold">{coreCount}</span></p>
            </div>
          </div>
        </div>

        {/* Performance Trend Chart */}
        <div className="bg-[#0a0a0a] border border-blue-900/40 rounded-2xl p-8 shadow-[0_0_25px_rgba(0,112,243,0.1)]">
          <h2 className="text-2xl font-bold text-blue-200 text-center mb-2">Performance Trend</h2>
          <p className="text-gray-500 text-xs text-center mb-8">Your quiz scores over time</p>
          
          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="date" stroke="#666" tick={{ fill: '#666', fontSize: 12 }} />
                  <YAxis domain={[0, 100]} stroke="#666" tick={{ fill: '#666', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                    itemStyle={{ color: '#4ade80' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', stroke: '#60a5fa', strokeWidth: 2, r: 5 }} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Not enough data to display chart. Take a quiz to see your progress!
              </div>
            )}
          </div>
        </div>

        {/* Recent Quizzes Section */}
        <div className="bg-[#0a0a0a] border border-blue-900/40 rounded-2xl p-8 shadow-[0_0_25px_rgba(0,112,243,0.1)]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-orange-500 mb-1">Recent Quizzes</h2>
              <p className="text-gray-500 text-sm">Review your past quiz performance</p>
            </div>
            {history.length > 0 && (
              <button 
                onClick={clearHistory}
                className="bg-red-900/80 hover:bg-red-700 text-white text-sm font-semibold py-2 px-6 rounded-lg transition-colors border border-red-500/30"
              >
                Clear History
              </button>
            )}
          </div>

          <div className="space-y-6">
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No quizzes taken yet. Start practicing!</p>
            ) : (
              history.slice().reverse().map((attempt, index) => {
                const percentage = (attempt.score / attempt.totalQuestions) * 100;
                const d = new Date(attempt.date);
                const formattedDate = `${d.toLocaleString('default', { month: 'long' })} ${d.getDate()}, ${d.getFullYear()} ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

                return (
                  <div key={attempt.id} className="bg-[#111111] border border-gray-800 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-orange-500 mb-2">Quiz {history.length - index} <span className="text-white ml-2">{attempt.subject}</span></h3>
                        <p className="text-xl font-bold text-green-500">Score: {percentage.toFixed(1)}%</p>
                      </div>
                      <span className="text-yellow-600 text-sm font-medium">{formattedDate}</span>
                    </div>
                    
                    <p className="text-gray-400 text-sm leading-relaxed mt-4">
                      {attempt.feedback || `Great effort on the assessment! Based on your score of ${attempt.score} out of ${attempt.totalQuestions}, continue reviewing the core concepts of ${attempt.subject} to improve your accuracy.`}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm font-semibold">© 2026 PrepGenius</p>
        </div>

      </div>
    </div>
  );
}