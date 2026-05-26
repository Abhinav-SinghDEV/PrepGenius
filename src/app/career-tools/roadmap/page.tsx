"use client";

import { useState } from "react";
import Link from "next/link";
import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from "reactflow";
import "reactflow/dist/style.css"; 

// RESTORED: Your full original list of roles
const SUGGESTED_ROLES = [
  "Machine Learning Engineer",
  "Data Scientist",
  "Data Analyst",
  "AI Engineer",
  "NLP Engineer",
  "Computer Vision Engineer",
  "MLOps Engineer",
  "Data Engineer",
  "Prompt Engineer",
  "Full Stack Web Developer"
];

export default function RoadmapGeneratorPage() {
  const [selectedRole, setSelectedRole] = useState("");
  const [customRole, setCustomRole] = useState(""); // RESTORED: Custom input state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [roadmapInfo, setRoadmapInfo] = useState({ title: "", description: "" });

  const generateRoadmap = async (roleToGenerate: string) => {
    if (!roleToGenerate) return;
    
    setLoading(true);
    setError("");
    setNodes([]);
    setEdges([]);
    setRoadmapInfo({ title: "", description: "" });

    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: roleToGenerate }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to generate roadmap");
      }

      if (data.roadmap?.steps) {
        setRoadmapInfo({
          title: data.roadmap.title,
          description: data.roadmap.description
        });

        const generatedNodes = data.roadmap.steps.map((step: any, index: number) => ({
          id: step.id,
          position: { x: 350, y: index * 180 }, 
          data: { 
            label: (
              <div className="text-left flex flex-col gap-1 p-2">
                <strong className="text-sm border-b border-black/20 pb-1">{step.title}</strong>
                <span className="text-xs">{step.description}</span>
              </div>
            ) 
          },
          style: { 
            background: "#facc15", 
            color: "#000", 
            border: "1px solid #ca8a04",
            borderRadius: "8px",
            width: 280,
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
          }
        }));

        const generatedEdges = data.roadmap.steps.slice(1).map((step: any, index: number) => ({
          id: `e${data.roadmap.steps[index].id}-${step.id}`,
          source: data.roadmap.steps[index].id,
          target: step.id,
          animated: true,
          style: { stroke: "#fff" }, 
        }));

        setNodes(generatedNodes);
        setEdges(generatedEdges);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customRole.trim()) {
      setSelectedRole(customRole);
      generateRoadmap(customRole);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white relative font-sans flex flex-col">
      <div className="relative z-10 max-w-5xl mx-auto px-4 w-full pt-10 pb-6">
        <div className="flex justify-between items-center mb-8">
          <Link href="/career-tools" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4 tracking-tight">
            AI Career Roadmap Generator
          </h1>
        </div>

        {/* RESTORED: Full List of Roles */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {SUGGESTED_ROLES.map((role) => (
            <button
              key={role}
              onClick={() => { setSelectedRole(role); setCustomRole(""); generateRoadmap(role); }}
              disabled={loading}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedRole === role ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-[#111827] border border-white/10 text-gray-300 hover:bg-[#1f2937]"
              } disabled:opacity-50`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* RESTORED: Custom Input Form */}
        <form onSubmit={handleCustomSubmit} className="max-w-md mx-auto flex gap-2 mb-6">
          <input
            type="text"
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            placeholder="Or type a custom role (e.g. Prompt Engineer)"
            className="flex-1 bg-[#0b1120] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !customRole.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 transition-colors px-6 py-3 rounded-xl font-medium text-sm"
          >
            Generate
          </button>
        </form>

        {error && <div className="text-red-400 text-center mb-4">{error}</div>}
      </div>

      {/* THE FIX: Fixed height of 70vh (70% of the screen height) so ReactFlow renders! */}
      <div className="w-full h-[70vh] border-t border-white/10 bg-[#0a0a0a] relative">
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
              <div className="text-blue-400 text-lg font-bold">Architecting Flowchart...</div>
            </div>
          </div>
        )}

        {nodes.length > 0 ? (
          <>
            <div className="absolute top-6 left-6 z-40 bg-[#111] border border-white/10 p-6 rounded-xl max-w-sm shadow-2xl pointer-events-none">
              <h2 className="text-2xl font-bold text-yellow-400 mb-2">{roadmapInfo.title}</h2>
              <p className="text-sm text-gray-300">{roadmapInfo.description}</p>
            </div>

            <ReactFlow nodes={nodes} edges={edges} fitView>
              <Background color="#333" gap={20} />
              <Controls className="bg-white/10 fill-white border-none" />
              <MiniMap 
                nodeColor="#facc15" 
                maskColor="rgba(0, 0, 0, 0.7)" 
                style={{ backgroundColor: '#111' }} 
              />
            </ReactFlow>
          </>
        ) : !loading && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-600">
            Select or enter a role above to map your journey.
          </div>
        )}
      </div>
    </div>
  );
}