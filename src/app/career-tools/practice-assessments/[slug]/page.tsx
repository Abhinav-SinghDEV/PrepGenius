"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getAssessmentMeta } from "@/data/mcq-assessments";

type GeneratedQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: string;
};

type GeneratedPayload = {
  questions: GeneratedQuestion[];
  meta: {
    title: string;
    section: string;
  };
  fallback?: boolean;
};

export default function AssessmentPage() {
  const params = useParams();
  const slug = params.slug as string;

  const assessment = useMemo(() => {
    return getAssessmentMeta(slug);
  }, [slug]);

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(
    {}
  );
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [attemptId, setAttemptId] = useState(() => Date.now());

  const cacheKey = `mcq-${slug}-attempt-${attemptId}`;

  useEffect(() => {
    const loadQuestions = async () => {
      if (!assessment) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const cached = localStorage.getItem(cacheKey);

        if (cached) {
          const parsed: GeneratedPayload = JSON.parse(cached);
          setQuestions(parsed.questions);
          return;
        }

        const response = await fetch("/api/mcq/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug,
            attemptId,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to generate questions");
        }

        const payload: GeneratedPayload = {
          questions: data.questions,
          meta: data.meta,
          fallback: data.fallback,
        };

        setQuestions(payload.questions);
        localStorage.setItem(cacheKey, JSON.stringify(payload));
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [slug, assessment, cacheKey, attemptId]);

  if (!assessment) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Assessment Not Found</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
        <div className="absolute w-[500px] h-[500px] bg-blue-600 opacity-10 blur-[140px] rounded-full left-[-150px] top-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:90px_90px]" />

        <div className="relative z-10 bg-[#07122b] border border-blue-500/20 rounded-3xl px-10 py-8 shadow-2xl shadow-blue-950/20 text-center">
          <p className="text-2xl font-bold text-blue-400">
            Generating your assessment...
          </p>
          <p className="text-gray-400 mt-3">
            Please wait while AI creates your 10-question test.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="bg-[#07122b] border border-red-500/20 rounded-3xl p-8 shadow-2xl max-w-xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-red-400 mb-4">
            Failed to Load Assessment
          </h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link
            href="/career-tools/practice-assessments"
            className="inline-block bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-semibold"
          >
            Back to Assessments
          </Link>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">No questions available</h1>
      </div>
    );
  }

  const question = questions[currentQuestion];

  const handleSelect = (option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [question.id]: option,
    }));
  };

  const score = questions.reduce((acc, q) => {
    if (selectedAnswers[q.id] === q.answer) {
      return acc + 1;
    }
    return acc;
  }, 0);

  // 1. ADDED THE SAVE FUNCTION HERE
  const saveAssessmentResult = (finalScore: number, totalQuestions: number, subjectName: string) => {
    const newResult = {
      id: Date.now().toString(),
      subject: subjectName, 
      score: finalScore,
      totalQuestions: totalQuestions,
      date: new Date().toISOString(),
      feedback: finalScore >= (totalQuestions * 0.7) 
        ? `Great job! You have a strong grasp of ${subjectName}.` 
        : `Keep practicing! Review the core concepts of ${subjectName} to improve your accuracy.`
    };
    const existingHistory = JSON.parse(localStorage.getItem("mcqHistory") || "[]");
    localStorage.setItem("mcqHistory", JSON.stringify([...existingHistory, newResult]));
  };

  // 2. CREATED THIS WRAPPER TO SAVE AND SUBMIT AT THE SAME TIME
  const handleFinalSubmit = () => {
    saveAssessmentResult(score, questions.length, assessment.title);
    setSubmitted(true);
  };

  const handleRetake = () => {
    localStorage.removeItem(cacheKey);
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setSubmitted(false);
    setError("");
    setAttemptId((prev) => prev + 1);
    setLoading(true);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-blue-600 opacity-10 blur-[140px] rounded-full left-[-150px] top-[100px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:90px_90px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/career-tools/practice-assessments"
            className="text-lg hover:text-blue-400 transition-all duration-300"
          >
            ← Back to Assessments
          </Link>

          <div className="bg-blue-500 px-5 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20">
            Question {currentQuestion + 1} / {questions.length}
          </div>
        </div>

        {!submitted ? (
          <>
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-extrabold text-blue-400 mb-4">
                {assessment.title}
              </h1>
              <p className="text-gray-400 text-lg">
                Answer all questions carefully before submitting.
              </p>
            </div>

            <div className="bg-[#07122b] border border-blue-500/20 rounded-3xl p-8 md:p-10 shadow-2xl shadow-blue-950/20">
              <h2 className="text-2xl md:text-3xl font-bold text-yellow-300 leading-10 mb-8">
                {question.question}
              </h2>

              <div className="space-y-4">
                {question.options.map((option) => {
                  const isSelected = selectedAnswers[question.id] === option;

                  return (
                    <button
                      key={option}
                      onClick={() => handleSelect(option)}
                      className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-300 text-base md:text-lg ${
                        isSelected
                          ? "bg-blue-500 border-blue-400 text-white"
                          : "bg-[#0b1220] border-white/10 hover:border-cyan-400/30"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-10 gap-4">
                <button
                  disabled={currentQuestion === 0}
                  onClick={() => setCurrentQuestion((prev) => prev - 1)}
                  className={`px-6 py-3 rounded-xl font-semibold ${
                    currentQuestion === 0
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  Previous
                </button>

                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestion((prev) => prev + 1)}
                    className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded-xl font-semibold"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={handleFinalSubmit} // 3. UPDATED THIS BUTTON TO TRIGGER THE SAVE
                    className="bg-purple-500 hover:bg-purple-600 px-8 py-3 rounded-xl font-semibold"
                  >
                    Submit Assessment
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-[#07122b] border border-blue-500/20 rounded-3xl p-10 md:p-12 shadow-2xl shadow-blue-950/20 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-green-400 mb-6">
              Assessment Completed
            </h1>

            <p className="text-2xl md:text-3xl text-gray-300 mb-10">
              Your Score
            </p>

            <div className="text-7xl md:text-8xl font-extrabold text-yellow-300 mb-8">
              {score} / {questions.length}
            </div>

            <div className="flex justify-center gap-5 flex-wrap">
              <button
                onClick={handleRetake}
                className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg"
              >
                Retake Assessment
              </button>

              <Link
                href="/career-tools/practice-assessments"
                className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-2xl font-semibold text-lg"
              >
                Back to Assessments
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}