"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
  }, []);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert("User Registered Successfully");
      router.push("/login");
    } else {
      alert(data.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600 opacity-20 blur-[120px] rounded-full left-[-150px] top-[100px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />

      {/* Main Glass Card */}
      <div className="relative z-10 w-[420px] bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-2xl my-8">
        <div className="flex justify-center mb-6">
          <div className="px-5 py-2 rounded-full bg-black border border-white/10 text-xl font-bold">
            <span className="text-blue-400">Prep</span>Genius
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2">
          Smart Interview Preparation
        </h1>

        <p className="text-gray-400 text-center mb-8 text-sm">
          Create your AI-powered interview account
        </p>

        {/* Traditional Email/Password Form */}
        <form onSubmit={handleRegister} autoComplete="off" className="flex flex-col gap-4">
          <input
            type="text"
            name="register-name"
            autoComplete="off"
            placeholder="Enter your name"
            className="bg-white/5 border border-white/10 p-3.5 rounded-xl outline-none focus:border-blue-500 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            name="register-email"
            autoComplete="off"
            placeholder="Enter your email"
            className="bg-white/5 border border-white/10 p-3.5 rounded-xl outline-none focus:border-blue-500 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            name="register-password"
            autoComplete="new-password"
            placeholder="Enter your password"
            className="bg-white/5 border border-white/10 p-3.5 rounded-xl outline-none focus:border-blue-500 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-[1.02] transition-all duration-300 p-3.5 rounded-xl font-semibold mt-2"
          >
            Create an Account
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 border-t border-white/10"></div>
          <span className="text-gray-500 text-xs uppercase font-semibold tracking-wider">Or continue with</span>
          <div className="flex-1 border-t border-white/10"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="flex flex-col gap-3">
          {/* Google Button Only */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 p-3.5 rounded-xl font-semibold text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>
        </div>

        <p className="text-center text-gray-400 mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-white font-semibold hover:text-blue-400 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}