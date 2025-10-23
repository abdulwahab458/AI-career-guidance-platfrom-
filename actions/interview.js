"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";


const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genai.getGenerativeModel({
    model: "gemini-2.5-flash",
});

export async function generatequiz() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    try {
        const prompt = `
  Generate 10 technical interview questions for a ${user.industry}
  professional${user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""}.
  
  Each question should be multiple choice with 4 options.

  Return ONLY valid JSON like this:
  {
    "questions": [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctAnswer": "string",
        "explanation": "string"
      }
    ]
  }
  `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // 🧠 Clean any markdown or code fences
        const cleaned = text
            .replace(/```(?:json)?/g, "")
            .replace(/```/g, "")
            .trim();

        // 🧠 Try parsing JSON safely
        let parsed;
        try {
            parsed = JSON.parse(cleaned);
        } catch (err) {
            console.error("JSON parse failed. Raw response:\n", cleaned);
            throw new Error("Failed to parse Gemini response");
        }

        // ✅ Always return an array
        return parsed.questions || [];
    } catch (error) {
        console.error("here is the error from the quizgen:", error);
        throw new Error("Quiz generation failed");
    }
}


export async function saveQuizResult(questions, answers, score) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    const questionResults = questions.map((q, index) => ({
        question: q.question,
        answer: q.correctAnswer,
        userAnswer: answers[index],
        isCorrect: q.correctAnswer === answers[index],
        explanation: q.explanation,
    }));

    const wrongAnswers = questionResults.filter((q) => !q.isCorrect);
    let improvementTip = null;
    if (wrongAnswers.length > 0) {
        const wrongQuestionsText = wrongAnswers
            .map(
                (q) =>
                    `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
            )
            .join("\n\n");

        const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

        try {
            const result = await model.generateContent(improvementPrompt);
            const response = result.response;
            improvementTip = response.text().trim();

        } catch (error) {
            console.log("error from imporvement tip", error);
        }


        try {
            const assessment = await db.Assessment.create({
                data: {
                    userId: user.id,
                    quizscore: score,
                    questions: questionResults,
                    category: "Technical",
                    improvementTip,
                }
            })
            return assessment;
        } catch (error) {
            console.log("error from saving assesments ", error);
            throw new Error("Error saving the score")
        }

    }
}

export async function getAssesment() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    try {
        const assessments = await db.assessment.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "asc" },
        });
        return assessments;
    } catch (error) {
        console.log("Error fetching assessments:", error);
        throw new Error("Error fetching assessments");
    }
}
