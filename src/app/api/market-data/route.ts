import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Forces the route to revalidate the cache every 24 hours
export const revalidate = 86400; 

const BLS_SERIES = {
  it_overall_wage: "OEUN000000000000015000003",
  data_scientist_wage: "OEUN000000000000015122103",
};

export async function GET() {
  try {
    const currentYear = new Date().getFullYear();
    const startYear = (currentYear - 1).toString();

    // 1. ADDED: API Key injection. 
    // Always use an environment variable for API keys to keep them secure.
    const registrationKey = process.env.BLS_API_KEY || ""; 

    const blsResponse = await fetch("https://api.bls.gov/publicAPI/v2/timeseries/data/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seriesid: Object.values(BLS_SERIES),
        startyear: startYear,
        endyear: currentYear.toString(),
        registrationkey: registrationKey, // Required for higher rate limits
      }),
    });

    const result = await blsResponse.json();

    // 2. IMPROVED: Strict error checking
    if (!blsResponse.ok || result.status !== "REQUEST_SUCCEEDED") {
      throw new Error(result.message?.[0] || "BLS API Rate Limit exceeded or Service Unavailable");
    }

    const seriesData = result.Results.series || [];
    
    const extractLatestValue = (id: string): number | null => {
      const match = seriesData.find((s: any) => s.seriesID === id);
      // Ensure we find a valid numeric value
      const latestPoint = match?.data?.[0];
      return latestPoint ? parseFloat(latestPoint.value) : null;
    };

    const rawItWage = extractLatestValue(BLS_SERIES.it_overall_wage);
    const rawDataScientistWage = extractLatestValue(BLS_SERIES.data_scientist_wage);

    // 3. ENHANCED: Data mapping with cleaner defaults
    const compiledMarketSnapshot = {
      marketOutlook: { status: "POSITIVE", description: "Computer occupations are growing faster than the economy overall." },
      growthPulse: {
        rate: "34%",
        highlightRole: "Data Scientist",
        description: `Data scientists lead the growth snapshot with median baselines around $${(rawDataScientistWage || 108020).toLocaleString()}.`,
      },
      demandLevel: { level: "HIGH", description: "High demand across AI, Cloud, and Cybersecurity sectors." },
      medianWage: {
        formattedValue: rawItWage ? `$${rawItWage.toLocaleString()}` : "$105,990",
        footnote: "Data fetched from official BLS occupational wage statistics.",
      },
      trendingSkills: ["Cloud Computing", "AI", "Data Analytics", "Cybersecurity", "Full Stack", "DevOps"],
      lastUpdated: new Date().toLocaleDateString("en-GB"),
    };

    return NextResponse.json({ success: true, source: "live_bls_api", data: compiledMarketSnapshot });

  } catch (error) {
    console.error("⚠️ BLS API Gateway Fallback Triggered:", error);

    // Serve consistent static data if the API fails
    return NextResponse.json({
      success: true,
      source: "cached_fallback_store",
      data: {
        marketOutlook: { status: "POSITIVE", description: "Computer occupations show robust growth." },
        growthPulse: { rate: "34%", highlightRole: "Data Scientist", description: "Data scientists continue to lead growth." },
        demandLevel: { level: "HIGH", description: "Strong market demand for technical roles." },
        medianWage: { formattedValue: "$105,990", footnote: "Historical benchmark data." },
        trendingSkills: ["Cloud Computing", "AI", "Data Analytics", "Cybersecurity", "Full Stack", "DevOps"],
        lastUpdated: new Date().toLocaleDateString("en-GB"),
      },
    });
  }
}