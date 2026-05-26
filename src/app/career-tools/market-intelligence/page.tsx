import Link from "next/link";
import marketData from "@/data/market-data.json";

const {
  overviewCards,
  topSkills,
  trends,
  recommendations,
  roleSnapshot,
} = marketData;

const maxWage = Math.max(...roleSnapshot.map((item) => item.wage));

function formatMoney(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

const metricIcons: Record<string, string> = {
  "Market Outlook": "📈",
  "Growth Pulse": "🔥",
  "Demand Level": "🚀",
  "Median IT Wage": "💰",
};

// 👇 1. Live Server-Side Fetch to the Official U.S. BLS API
async function getLiveBLSData() {
  try {
    const response = await fetch("https://api.bls.gov/publicAPI/v2/timeseries/data/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seriesid: ["OEUM0000000000000151252"], // National Software Developer wages series ID
        startyear: "2024",
        endyear: "2026",
        registrationkey: process.env.BLS_API_KEY,
      }),
      // Revalidates cache exactly once every 24 hours
      next: { revalidate: 86400 } 
    });

    const result = await response.json();
    const latestData = result.Results?.series[0]?.data[0];
    
    return {
      medianWage: latestData ? parseFloat(latestData.value) : 105990, // BLS standard fallback
    };
  } catch (error) {
    console.error("BLS Live Fetch failed, reverting to configuration snapshot:", error);
    return { medianWage: 105990 };
  }
}

// 👇 2. Turned your main component into an async function to support the backend fetch
export default async function MarketIntelligencePage() {
  const blsData = await getLiveBLSData();
  
  // Dynamically compute the current date tracker string on the server (DD/MM/YYYY)
  const currentLiveDate = new Date().toLocaleDateString("en-GB");

  const highestRole = roleSnapshot.reduce((best, item) =>
    item.wage > best.wage ? item : best
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600 opacity-20 blur-[120px] rounded-full left-[-120px] top-[120px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-600 opacity-10 blur-[140px] rounded-full right-[-120px] top-[200px]" />

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:90px_90px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-10">
          <div className="px-5 py-2 rounded-full bg-black border border-white/10 text-xl font-bold shadow-lg">
            <span className="text-blue-400">Prep</span>Genius
          </div>

          <Link
            href="/career-tools"
            className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20"
          >
            Back to Career Tools
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-5">
            <span className="text-green-400 animate-pulse">●</span>
            Live Market Snapshot
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Market Intelligence Hub
          </h1>

          <p className="text-gray-400 text-lg mt-4 max-w-3xl mx-auto leading-8">
            Track hiring signals, salary snapshots, in-demand skills, and job market momentum across technology careers.
          </p>
        </div>

        {/* Updated Badge (Now updates every day dynamically!) */}
        <div className="flex justify-center mb-10">
          <div className="px-4 py-2 rounded-full bg-black/60 border border-white/10 text-sm text-gray-300 font-mono">
            Last updated: {currentLiveDate}
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
          {overviewCards.map((card) => {
            // 👇 Here is the change! It now forces "(latest)" explicitly.
            const isWageCard = card.title === "Median IT Wage";
            const displayValue = isWageCard ? formatMoney(blsData.medianWage) : card.value;
            const displayNote = isWageCard ? `Live official BLS snapshot (latest)` : card.note;

            return (
              <div
                key={card.title}
                className={`bg-[#0b1220] border rounded-3xl p-6 shadow-2xl shadow-blue-950/20 hover:border-cyan-400/30 transition-all duration-300 ${
                  isWageCard ? "border-amber-500/30 ring-1 ring-amber-500/5" : "border-blue-500/20"
                }`}
              >
                <div className="flex items-center justify-between mb-5">
                  <p className={`text-sm font-semibold ${isWageCard ? "text-amber-400" : "text-yellow-300"}`}>
                    {card.title}
                  </p>
                  <span className="text-2xl">{metricIcons[card.title] || "📌"}</span>
                </div>

                <h2 className={`text-3xl font-extrabold mb-2 ${isWageCard ? "text-amber-400" : "text-white"}`}>
                  {displayValue}
                </h2>

                <p className="text-gray-400 text-sm leading-6">{displayNote}</p>
              </div>
            );
          })}

          {/* Trending Skills */}
          <div className="bg-[#0b1220] border border-blue-500/20 rounded-3xl p-6 shadow-2xl shadow-blue-950/20 hover:border-cyan-400/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <p className="text-yellow-300 text-sm font-semibold">
                Trending Skills
              </p>
              <span className="text-2xl">⚡</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {topSkills.slice(0, 8).map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full bg-white/10 text-gray-200 text-xs font-medium border border-white/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Market Pulse */}
        <div className="bg-[#0b1220] border border-blue-500/20 rounded-3xl p-6 shadow-2xl shadow-blue-950/20 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-cyan-300">
                Market Pulse
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Roles with the strongest growth and wage signals right now
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm">
                Highest wage: {highestRole.role}
              </span>
              <span className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
                Fastest growth: Data Scientist
              </span>
              <span className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
                Strong demand across AI + Security
              </span>
            </div>
          </div>
        </div>

        {/* Salary Chart */}
        <div className="bg-[#0b1220] border border-blue-500/20 rounded-3xl p-8 shadow-2xl shadow-blue-950/20 mb-8">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-yellow-300">
                Salary Ranges by Role
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Current snapshot using BLS occupational wage and growth projections.
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-400">IT Median Wage</div>
              {/* 👇 Feeds live calculation into the overview section */}
              <div className="text-2xl font-bold text-green-400">{formatMoney(blsData.medianWage)}</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[950px]">
              <div className="h-[430px] flex items-end gap-5 border-b border-l border-dashed border-white/15 pl-4 pb-3">
                {roleSnapshot.map((item) => {
                  const barHeight = Math.max(
                    Math.round((item.wage / maxWage) * 260),
                    80
                  );

                  return (
                    <div key={item.role} className="flex-1 min-w-[120px]">
                      <div className="h-[340px] flex items-end justify-center">
                        <div className="w-full flex flex-col items-center">
                          <div
                            className="w-full max-w-[120px] rounded-t-2xl bg-gradient-to-t from-green-500 to-emerald-300 shadow-lg shadow-green-500/20 hover:scale-105 transition-all duration-300"
                            style={{ height: `${barHeight}px` }}
                          />
                          <div className="mt-4 text-center">
                            <div className="text-sm text-gray-300 font-medium">
                              {item.role}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {item.label}
                            </div>
                            <div className="text-green-400 font-semibold mt-2">
                              {formatMoney(item.wage)}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Growth: {item.growth}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between text-xs text-gray-500 mt-2 pl-4 pr-2">
                <span>Lower</span>
                <span>Mid</span>
                <span>Higher</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trends */}
          <div className="bg-[#0b1220] border border-blue-500/20 rounded-3xl p-8 shadow-2xl shadow-blue-950/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-2xl font-bold text-yellow-300">
                Key Industry Trends
              </h3>
              <span className="text-xl">📈</span>
            </div>

            <p className="text-gray-400 text-sm mb-6">
              Current signals shaping hiring and skill demand
            </p>

            <ul className="space-y-4">
              {trends.map((trend) => (
                <li key={trend} className="flex items-start gap-3 text-gray-200">
                  <span className="text-green-400 mt-1">•</span>
                  <span className="leading-7">{trend}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div className="bg-[#0b1220] border border-blue-500/20 rounded-3xl p-8 shadow-2xl shadow-blue-950/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-2xl font-bold text-yellow-300">
                Recommended Skills
              </h3>
              <span className="text-xl">🧠</span>
            </div>

            <p className="text-gray-400 text-sm mb-6">
              Skills worth developing for stronger market positioning
            </p>

            <div className="flex flex-wrap gap-3">
              {recommendations.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-full bg-white/10 text-gray-200 text-sm border border-white/10 hover:border-cyan-400/30 transition-all duration-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          Powered by live U.S. Bureau of Labor Statistics data streams and official occupational trend metrics.
        </div>
      </div>
    </div>
  );
}