"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genai.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateCoverLetter({ jobTitle, companyName, jobDescription, resumeSummary }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  const prompt = `
  You are an expert career writer. Write a professional and personalized cover letter
  for a ${user.industry || "general"} professional applying for the position of **${jobTitle}** at **${companyName}**.

  The user’s professional summary is:
  "${resumeSummary || "N/A"}"

  The job description is:
  "${jobDescription || "N/A"}"

  Follow these rules:
  1. Use a professional and engaging tone.
  2. Make it sound personal but concise (max 250 words).
  3. Highlight how the candidate’s background aligns with the job.
  4. Include a short introduction, 1–2 achievement-based body paragraphs, and a closing paragraph.
  5. Do not include placeholder names or personal contact info — only use what’s given.
  
  Output the cover letter in clean Markdown format.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const letter = response.text().trim();

    return { coverLetter: letter };
  } catch (error) {
    console.error("Error generating cover letter:", error);
    throw new Error("Failed to generate cover letter. Please try again.");
  }
}
