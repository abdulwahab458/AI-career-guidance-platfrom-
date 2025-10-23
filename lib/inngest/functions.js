// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { db } from "../prisma";
// import { inngest } from "./client";

// const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genai.getGenerativeModel({
//   model: "gemini-2.5-flash",
// });

// export const generateIndustryInsights = inngest.createFunction(
//   { name: "generate industry insights" },
//   { cron: "0 0 * * 0" }, // every Sunday at midnight
//   async ({ step }) => {
//     // ✅ In v2, we destructure step from ctx

//     // Fetch industries
//     const industries = await step.run("Fetch Industries", async () => {
//       return await db.industryInsights.findMany({
//         select: { industry: true },
//       });
//     });

//     for (const { industry } of industries) {
//       const prompt = `
//         Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
//         {
//           "salaryRanges": [
//             { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
//           ],
//           "growthRate": number,
//           "demandLevel": "High" | "Medium" | "Low",
//           "topSkills": ["skill1", "skill2"],
//           "marketOutlook": "Positive" | "Neutral" | "Negative",
//           "keyTrends": ["trend1", "trend2"],
//           "recommendedSkills": ["skill1", "skill2"]
//         }

//         IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
//         Include at least 5 common roles for salary ranges.
//         Growth rate should be a percentage.
//         Include at least 5 skills and trends.
//       `;

//       const responseText = await step.run(`Generate ${industry} insights`, async () => {
//         const res = await model.generateContent(prompt);
//         return res.response.candidates[0].content.parts[0].text || "";
//       });

//       const parsed = responseText.replace(/```(?:json)?\n?/g, "").trim();
//       const insights = JSON.parse(parsed);

//       await step.run(`Update ${industry} insights`, async () => {
//         await db.industryInsights.update({
//           where: { industry },
//           data: {
//             ...insights,
//             lastUpdated: new Date(),
//             nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//           },
//         });
//       });
//     }
//   }
// );






import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../prisma";
import { inngest } from "./client";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genai.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateIndustryInsights = inngest.createFunction(
  { name: "generate industry insights" },
  { cron: "0 0 * * 0" }, // every Sunday at midnight
  async ({ step }) => {
    const industries = await step.run("Fetch Industries", async () => {
      return await db.industryInsights.findMany({
        select: { industry: true },
      });
    });

    for (const { industry } of industries) {
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

        IMPORTANT: Return ONLY the JSON. No extra text or markdown formatting.
      `;

      const responseText = await step.run(`Generate ${industry} insights`, async () => {
        const res = await model.generateContent(prompt);
        return res.response.candidates?.[0]?.content?.parts?.[0]?.text || "";
      });

      const parsed = responseText.replace(/```(?:json)?\n?/g, "").trim();
      const insights = JSON.parse(parsed);

      // ✅ Normalize values to match Prisma schema
      const fixedInsights = {
        salaryRanges: Array.isArray(insights.salaryRanges)
          ? insights.salaryRanges
          : [],
        growthRate: insights.growthRate ?? 0,
        demandLevel: insights.demandLevel
          ? insights.demandLevel.toUpperCase()
          : "MEDIUM",
        topSkills: Array.isArray(insights.topSkills) ? insights.topSkills : [],
        marketOutlook: insights.marketOutlook
          ? insights.marketOutlook.toUpperCase()
          : "NEUTRAL",
        keyTrends: Array.isArray(insights.keyTrends)
          ? insights.keyTrends
          : [],
        recommendedSkills: Array.isArray(insights.recommendedSkills)
          ? insights.recommendedSkills
          : [],
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      await step.run(`Update ${industry} insights`, async () => {
        await db.industryInsights.update({
          where: { industry },
          data: fixedInsights,
        });
      });
    }
  }
);

