"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
if (data.success) {
  document.cookie = "pg_auth=1; path=/; SameSite=Lax";
  router.replace("/dashboard");
} else {
  alert(data.message || "Login Failed");
}
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-blue-600 opacity-20 blur-[120px] rounded-full left-[-150px] top-[100px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="relative z-10 w-[420px] bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="px-5 py-2 rounded-full bg-black border border-white/10 text-xl font-bold">
            <span className="text-blue-400">Prep</span>Genius
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center mb-2">Welcome Back</h1>

        <p className="text-gray-400 text-center mb-8">
          Login to continue your AI interview journey
        </p>

        <form
          onSubmit={handleLogin}
          autoComplete="off"
          className="flex flex-col gap-5"
        >
          <input
            type="email"
            name="login-email"
            autoComplete="off"
            placeholder="Enter your email"
            className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            name="login-password"
            autoComplete="current-password"
            placeholder="Enter your password"
            className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-[1.02] transition-all duration-300 p-4 rounded-xl font-semibold"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-white font-semibold hover:text-blue-400"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}