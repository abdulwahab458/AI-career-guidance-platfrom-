"use server"
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genai.getGenerativeModel({
    model: "gemini-2.5-flash",
});

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
    const parsed = JSON.parse(text.replace(/```(?:json)?\n?/g, "").trim());

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
// export async function getIndustryInsight() {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     const user = await db.user.findUnique({ where: { clerkUserId: userId } });
//     if (!user) throw new Error("User not found");

//     if (!user.industryInsights) {
//         const aiInsights = await generateAIInsights(user.industry);

//         // Explicitly map keys to match Prisma model
//         const fixedInsights = {
//             salaryRanges: aiInsights.salaryRanges,
//             growthRate: aiInsights.growthRate,
//             demandLevel: aiInsights.demandLevel.toUpperCase(),
//             topSkills: aiInsights.topSkills,
//             marketOutlook: aiInsights.marketOutlook.toUpperCase() || "NEUTRAL",
//             keyTrends: Array.isArray(aiInsights.keyTrends) ? aiInsights.keyTrends : [],
//             recommendedSkills: aiInsights.recommendedSkills,
//         };

//         const industryInsight = await db.industryInsights.create({
//             data: {
//                 industry: user.industry,
//                 ...fixedInsights,
//                 nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//             },
//         });

//         return industryInsight;
//     }

//     return user.industryInsights;
// } 






export async function getIndustryInsight() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  // Generate AI insights before the upsert
  let aiInsights;
  try {
    aiInsights = await generateAIInsights(user.industry);
  } catch (err) {
    console.error("AI generation failed:", err);
    throw new Error("Failed to generate industry insights");
  }

  // Explicitly map keys to match Prisma schema
  const fixedInsights = {
    salaryRanges: aiInsights.salaryRanges,
    growthRate: aiInsights.growthRate,
    demandLevel: aiInsights.demandLevel.toUpperCase(),
    topSkills: aiInsights.topSkills,
    marketOutlook: aiInsights.marketOutlook.toUpperCase() || "NEUTRAL",
    keyTrends: Array.isArray(aiInsights.keyTrends) ? aiInsights.keyTrends : [],
    recommendedSkills: aiInsights.recommendedSkills,
    nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };

  // Use upsert to safely create or return existing record
  const industryInsight = await db.industryInsights.upsert({
    where: { industry: user.industry },
    create: {
      industry: user.industry,
      ...fixedInsights,
    },
    update: {},
  });

  return industryInsight;
}
