"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const sections = [
  {
    title: "Aptitude",
    items: [
      {
        name: "Logical Reasoning",
        slug: "logical-reasoning",
      },
      {
        name: "Quantitative Aptitude",
        slug: "quantitative-aptitude",
      },
      {
        name: "Verbal Ability",
        slug: "verbal-ability",
      },
    ],
  },
  {
    title: "Core Subjects",
    items: [
      {
        name: "DBMS",
        slug: "dbms",
      },
      {
        name: "Computer Networks",
        slug: "computer-networks",
      },
      {
        name: "Operating System",
        slug: "operating-system",
      },
    ],
  },
  {
    title: "Technical",
    items: [
      {
        name: "Technical Assessment",
        slug: "technical-assessment",
      },
    ],
  },
];

export default function PracticeAssessmentsPage() {
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    // 1. Fetch the user data from localStorage when the component mounts
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.name) {
          setUserName(parsedUser.name);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Glow */}
      <div className="absolute w-[450px] h-[450px] bg-blue-600 opacity-10 blur-[140px] rounded-full left-[-120px] top-[120px]" />

      <div className="absolute w-[350px] h-[350px] bg-purple-600 opacity-10 blur-[120px] rounded-full right-[-100px] top-[220px]" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/career-tools"
            className="text-gray-300 hover:text-blue-400 transition-all duration-300 text-sm"
          >
            ← Back to Career Tools
          </Link>

          {/* 2. REPLACED BUTTON WITH NEXT.JS LINK */}
          <Link 
            href="/career-tools/practice-assessments/history"
            className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 px-5 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20"
          >
            My Assessment History
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-blue-500">
            MCQ MOCK INTERVIEW PRACTICE
          </h1>

          <p className="mt-4 text-xl md:text-2xl font-semibold">
            Hi{" "}
            {/* 3. REPLACED HARDCODED NAME WITH STATE VARIABLE */}
            <span className="text-yellow-400">
              {userName}
            </span>
            ! Ready to test your preparation?
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-3xl font-bold text-orange-400 mb-5">
                {section.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {section.items.map((item) => (
                  <div
                    key={item.slug}
                    className="bg-[#07122b] border border-blue-500/20 rounded-2xl p-6 shadow-xl shadow-blue-950/10 hover:border-cyan-400/30 transition-all duration-300"
                  >
                    <h3 className="text-2xl font-bold text-yellow-300 mb-3">
                      {item.name}
                    </h3>

                    <p className="text-gray-300 text-sm mb-6">
                      No of questions{" "}
                      <span className="text-green-400 font-bold">
                        10
                      </span>
                    </p>

                    <Link
                      href={`/career-tools/practice-assessments/${item.slug}`}
                      className="block w-full bg-green-500 hover:bg-green-600 transition-all duration-300 text-center py-3 rounded-xl font-semibold text-white"
                    >
                      Take Assessment
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-14 text-gray-500 text-sm">
          AI-powered assessment engine with dynamic MCQ generation.
        </div>
      </div>
    </div>
  );
}