"use server"
import { db, getDatabaseUnavailableMessage, isDatabaseUnavailableError } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genai.getGenerativeModel({
    model: "gemini-2.5-flash",
});

const industryInsightSelect = {
  industry: true,
  salaryRanges: true,
  growthRate: true,
  demandLevel: true,
  topSkills: true,
  marketOutlook: true,
  keyTrends: true,
  recommendedSkills: true,
  lastUpdated: true,
};

function getFallbackInsights(industry) {
  return {
    industry,
    salaryRanges: [],
    growthRate: 0,
    demandLevel: "MEDIUM",
    topSkills: [],
    marketOutlook: "NEUTRAL",
    keyTrends: [],
    recommendedSkills: [],
    lastUpdated: new Date(),
    nextUpdate: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
}

async function findUserByClerkId(clerkUserId) {
  try {
    return await db.user.findUnique({
      where: { clerkUserId },
      select: {
        id: true,
        clerkUserId: true,
        email: true,
        name: true,
        imageUrl: true,
        industry: true,
        bio: true,
        experience: true,
      },
    });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      console.error("Database unavailable in getIndustryInsight:", error);
      return "__DB_UNAVAILABLE__";
    }
    throw error;
  }
}

async function findStoredIndustryInsight(industry) {
  try {
    return await db.industryInsights.findUnique({
      where: { industry },
      select: industryInsightSelect,
    });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      console.error(getDatabaseUnavailableMessage(), error);
      return null;
    }
    throw error;
  }
}

function mapInsightsToPrisma(aiInsights) {
  return {
    salaryRanges: Array.isArray(aiInsights.salaryRanges) ? aiInsights.salaryRanges : [],
    growthRate: Number(aiInsights.growthRate) || 0,
    demandLevel: String(aiInsights.demandLevel || "MEDIUM").toUpperCase(),
    topSkills: Array.isArray(aiInsights.topSkills) ? aiInsights.topSkills : [],
    marketOutlook: String(aiInsights.marketOutlook || "NEUTRAL").toUpperCase(),
    keyTrends: Array.isArray(aiInsights.keyTrends) ? aiInsights.keyTrends : [],
    recommendedSkills: Array.isArray(aiInsights.recommendedSkills) ? aiInsights.recommendedSkills : [],
    nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
}

export const generateAIInsights = async (industry) => {
    const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text.replaceAll(/```(?:json)?\n?/g, "").trim());

    // Explicitly map to match Prisma model
    return {
        salaryRanges: parsed.salaryRanges,
        growthRate: parsed.growthRate,
        demandLevel: parsed.demandLevel,
        topSkills: parsed.topSkills,
        marketOutlook: parsed.marketOutlook,
        keyTrends: parsed.keyTrends, // array
        recommendedSkills: parsed.recommendedSkills,
    };
}
export async function getIndustryInsight() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await findUserByClerkId(userId);
  if (user === "__DB_UNAVAILABLE__") return null;
  if (!user) throw new Error("User not found");
  if (!user.industry) return null;

  // Prefer existing stored insights so dashboard can render even if AI provider is down.
  const existingInsight = await findStoredIndustryInsight(user.industry);
  if (existingInsight) {
    return existingInsight;
  }

  // Generate AI insights only when no stored insight exists.
  let aiInsights;
  try {
    aiInsights = await generateAIInsights(user.industry);
  } catch (err) {
    console.error("AI generation failed:", err);
    return getFallbackInsights(user.industry);
  }

  // Explicitly map keys to match Prisma schema
  const fixedInsights = mapInsightsToPrisma(aiInsights);

  // Use upsert to safely create or return existing record
  try {
    const industryInsight = await db.industryInsights.upsert({
      where: { industry: user.industry },
      create: {
        industry: user.industry,
        ...fixedInsights,
      },
      update: {
        ...fixedInsights,
      },
      select: industryInsightSelect,
    });

    return industryInsight;
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      console.error(getDatabaseUnavailableMessage(), error);
      return getFallbackInsights(user.industry);
    }
    throw error;
  }
}
