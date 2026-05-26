"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const techOptions = [
  // Existing
  "React", "Node.js", "MongoDB", "DSA", 
  // ML/Data
  "Machine Learning", "Data Science", "Python", "TensorFlow", "Pandas",
  // Cybersecurity (New)
  "Network Security", "Penetration Testing", "Ethical Hacking", "Cryptography",
  // DevOps/Cloud (New)
  "AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Azure",
  // Mobile (New)
  "Flutter", "Swift", "Kotlin", "React Native",
  // UI/UX (New)
  "Figma", "Adobe XD", "UI Design", "UX Research", "Prototyping",
  // AI/Eng (New)
  "NLP", "Computer Vision", "LLMs", "PyTorch"
];

export default function InterviewSetupPage() {
  const router = useRouter();
  const [role, setRole] = useState("Full Stack Developer");
  const [difficulty, setDifficulty] = useState("Medium");
  const [interviewType, setInterviewType] = useState("Technical");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);

  const toggleTech = (tech: string) => {
    setSelectedTech((prev) =>
      prev.includes(tech) ? prev.filter((item) => item !== tech) : [...prev, tech]
    );
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/interview/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, difficulty, interviewType, selectedTech }),
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem("interviewQuestions", JSON.stringify(data.questions));
      router.push("/interview/session");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:90px_90px]" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-12">
          <div className="px-5 py-2 rounded-full bg-black border border-white/10 text-xl font-bold shadow-lg">
            <span className="text-blue-400">Prep</span>Genius
          </div>
          <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold transition-all">
            Back to Dashboard
          </Link>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Interview Setup</h1>
          <p className="text-gray-400 text-lg mt-4">Choose your preferences before starting the AI interview</p>
        </div>

        <form onSubmit={handleStart} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Interview Details</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-blue-500">
                  <option>Full Stack Developer</option>
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>Cybersecurity Engineer</option>
                  <option>DevOps Engineer</option>
                  <option>Cloud Architect</option>
                  <option>Mobile App Developer</option>
                  <option>Data Engineer</option>
                  <option>Machine Learning Engineer</option>
                  <option>Data Scientist</option>
                  <option>AI Engineer</option>
                  <option>UI/UX Designer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Difficulty</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-blue-500">
                  <option>Easy</option><option>Medium</option><option>Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Interview Type</label>
                <select value={interviewType} onChange={(e) => setInterviewType(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 outline-none focus:border-blue-500">
                  <option>Technical</option><option>HR</option><option>Behavioral</option><option>Mixed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Tech Stack</h2>
            <div className="flex flex-wrap gap-3">
              {techOptions.map((tech) => (
                <button key={tech} type="button" onClick={() => toggleTech(tech)} className={`px-4 py-3 rounded-full border transition-all ${selectedTech.includes(tech) ? "bg-blue-500 border-blue-400 text-white" : "bg-white/5 border-white/10 text-gray-300 hover:border-blue-400"}`}>
                  {tech}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 flex justify-center">
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-xl font-semibold text-lg">
              Start Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}