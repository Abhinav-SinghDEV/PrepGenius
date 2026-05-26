"use client";

import Link from "next/link";

const tools = [
  {
    title: "Market Intelligence Hub",
    description:
      "Explore industry trends, salary insights, hiring demand, fast-growing domains, and the most in-demand skills across different career paths.",
    button: "Open Analytics Dashboard",
    href: "/career-tools/market-intelligence",
    icon: "📊",
    active: true,
  },
  {
    title: "AI Career RoadMap Generator",
    description: "Generate Personalized step-by-step learning roadmaps.",
    button: "Generate RoadMap",
    href: "/career-tools/roadmap",
    icon: "🗺️", 
    active: true,
  },
  {
    title: "MCQ Mock Interview Practice",
    description:
      "Practice topic-wise MCQs for aptitude, core CS subjects, and technical interview preparation.",
    button: "Open Assessments",
    href: "/career-tools/practice-assessments",
    icon: "📝",
    active: true,
  },
 {
  title: "AI Career ChatBot",
  description:
    "Ask career-related questions and get guided learning paths.",
  button: "Open ChatBot",
  href: "/career-tools/chatbot",
  icon: "🤖",
  active: true,
},
];

export default function CareerToolsPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden pb-10">
      {/* Background Glow */}
      <div className="absolute w-[420px] h-[420px] bg-blue-600 opacity-10 blur-[140px] rounded-full left-[-120px] top-[80px]" />
      <div className="absolute w-[320px] h-[320px] bg-purple-600 opacity-10 blur-[120px] rounded-full right-[-120px] top-[220px]" />

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:90px_90px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <div className="px-4 sm:px-5 py-2 rounded-full bg-black border border-white/10 text-lg sm:text-xl font-bold shadow-lg">
            <span className="text-blue-400">Prep</span>Genius
          </div>

          <Link
            href="/dashboard"
            className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 px-4 sm:px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/20 text-sm sm:text-base"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-7 lg:mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-300 mb-4">
            <span className="text-green-400">●</span>
            Career Preparation Tools
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
            Career Tools
          </h1>

          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-6 sm:leading-7">
            Choose a tool to improve your interview preparation, market awareness,
            and career growth journey.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 items-stretch">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className="bg-[#0a0a0a] border border-blue-500/20 rounded-3xl p-5 sm:p-6 lg:p-7 shadow-2xl shadow-blue-950/20 hover:border-cyan-400/30 transition-all duration-300 h-full min-h-[220px] lg:min-h-[235px] flex flex-col"
            >
              <div className="text-3xl sm:text-4xl mb-4 sm:mb-5">
                {tool.icon}
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-400 mb-3 leading-tight">
                {tool.title}
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-6 sm:leading-7 mb-5 sm:mb-6 flex-1">
                {tool.description}
              </p>

              {tool.active ? (
                <Link
                  href={tool.href}
                  className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white font-semibold px-5 sm:px-6 py-3 rounded-xl text-sm sm:text-base shadow-lg shadow-blue-500/20 w-full sm:w-fit"
                >
                  {tool.button}
                </Link>
              ) : (
                <button className="bg-gray-700 text-gray-300 px-5 sm:px-6 py-3 rounded-xl text-sm sm:text-base font-semibold cursor-not-allowed w-full sm:w-fit">
                  {tool.button}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-5 sm:mt-6 lg:mt-8 text-gray-500 text-xs sm:text-sm">
          Powered by AI-driven preparation, analytics, and career intelligence.
        </div>
      </div>
    </div>
  );
}