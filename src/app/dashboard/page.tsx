"use client";

import Link from "next/link";

export default function DashboardPage() {
  const handleLogout = async () => {
    // 1. Hit the API route to destroy the secure cookie
    await fetch("/api/logout");
    
    // 2. Clear frontend memory (user name, history, etc.)
    localStorage.clear();
    
    // 3. Force a hard redirect to the login page so Next.js resets its cache
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600 opacity-20 blur-[120px] rounded-full left-[-120px] top-[120px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-600 opacity-10 blur-[140px] rounded-full right-[-120px] top-[200px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:90px_90px]" />

      <div className="relative z-10">
        {/* Navbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-md bg-black/40">
          <div className="px-4 py-2 rounded-full bg-black border border-white/10 text-lg font-bold shadow-lg">
            <span className="text-blue-400">Prep</span>Genius
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all duration-300 px-5 py-2 rounded-xl font-semibold border border-red-500/20"
          >
            Logout
          </button>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-16">
          <section className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              Choose Your Path
            </h1>
            <p className="text-gray-400 text-lg mt-4">
              Select an option to begin your preparation journey
            </p>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI Interview */}
            <Link
              href="/interview/setup"
              className="block bg-[#0b1220] border border-blue-500/20 rounded-3xl p-8 shadow-2xl hover:scale-[1.01] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="text-4xl">🎤</div>
                <span className="bg-yellow-400 text-red-600 font-bold px-4 py-2 rounded-md text-sm">
                  Genius+
                </span>
              </div>
              <h2 className="text-3xl font-bold text-blue-400 mb-4">
                AI-Powered Mock Interview
              </h2>
              <p className="text-gray-300 leading-7 mb-8">
                Experience role-specific AI interviews with intelligent
                feedback and performance analysis.
              </p>
              <ul className="space-y-3 text-gray-200">
                <li className="flex items-center gap-3">
                  <span className="text-blue-400">•</span> Dynamic Role Specific Questions
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-400">•</span> AI Feedback Report
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-400">•</span> Technical Performance Analysis
                </li>
              </ul>
            </Link>

            {/* Career Tools */}
            <Link
              href="/career-tools"
              className="block bg-[#0b1220] border border-blue-500/20 rounded-3xl p-8 shadow-2xl hover:scale-[1.01] transition-all duration-300"
            >
              <div className="text-4xl mb-8">📊</div>
              <h2 className="text-3xl font-bold text-blue-400 mb-4">
                PrepGenius Career Tools
              </h2>
              <p className="text-gray-300 leading-7 mb-8">
                Smart career tools powered by AI to improve resumes,
                interview preparation, and career growth.
              </p>
              <ul className="space-y-3 text-gray-200">
                <li className="flex items-center gap-3">
                  <span className="text-blue-400">•</span> Market Intelligence Hub
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-400">•</span> AI Career ChatBot
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-400">•</span> MCQ Mock Interview Practice
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-400">•</span> AI Career Roadmap Generator
                </li>
              </ul>
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}