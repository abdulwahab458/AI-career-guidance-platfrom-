"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { generateAIInsights } from "./dashboard";
import { currentUser } from "@clerk/nextjs/server";

// export async function updateUser(data) {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     const user = await db.user.findUnique({
//         where: { clerkUserId: userId },
//     });
//     if (!user) throw new Error("User not found");

//     try {
//         const result = await db.$transaction(async (tx) => {
//             // ✅ Use the correct Prisma client accessor
//             let industryInsights = await tx.industryInsights.findUnique({
//                 where: { industry: data.industry },
//             });

//             // ✅ Create the record if it doesn’t exist
//             if (!industryInsights) {
//                 const insights = await generateAIInsights(data.industry);
//                 const industryInsight = await db.industryInsights.create({
//                     data: {
//                         industry: data.industry,
//                         ...insights,
//                         nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//                     },
//                 });
//                 return industryInsight;
//             }

//             const updatedUser = await tx.user.update({
//                 where: { id: user.id },
//                 data: {
//                     industry: data.industry,
//                     experience: data.experience,
//                     bio: data.bio,
//                     skills: data.skills,
//                 },
//             });

//             return { updatedUser, industryInsights };
//         });

//         return { success: true, ...result };
//     } catch (error) {
//         console.error("Error Message from the action:", error);
//         return { success: false, error: error.message };
//     }
// }





export async function updateUser(data) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    // Generate AI insights BEFORE the transaction
    let aiInsights;
    try {
        aiInsights = await generateAIInsights(data.industry);
    } catch (err) {
        console.error("AI generation failed:", err);
        throw new Error("Failed to generate industry insights");
    }

    // Explicitly map keys to match Prisma schema
    const fixedInsights = {
        salaryRanges: aiInsights.salaryRanges,        // must match your Prisma schema
        growthRate: aiInsights.growthRate,
        demandLevel: aiInsights.demandLevel.toUpperCase(),
        topSkills: aiInsights.topSkills,
        marketOutlook: aiInsights.marketOutlook.toUpperCase()||"NEUTRAL",
        keyTrends: Array.isArray(aiInsights.keyTrends) ? aiInsights.keyTrends : [],
        recommendedSkills: aiInsights.recommendedSkills,
    };

    return await db.$transaction(async (tx) => {
        let industryInsight = await tx.industryInsights.findUnique({
            where: { industry: data.industry },
        });

        // Create AI insight if it doesn't exist
        if (!industryInsight) {
            industryInsight = await tx.industryInsights.create({
                data: {
                    industry: data.industry,
                    ...fixedInsights,
                    nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            });
        }

        // Update user
        const updatedUser = await tx.user.update({
            where: { id: user.id },
            data: {
                industry: data.industry,
                experience: data.experience,
                bio: data.bio,
                skills: data.skills,
            },
        });

        return { updatedUser, industryInsight };
    });
}



export async function getUserStatus() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    let user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    // ✅ Auto-create the user if missing
    if (!user) {
        const clerkUser = await currentUser();
        user = await db.user.create({
            data: {
                clerkUserId: userId,
                email: clerkUser.emailAddresses[0]?.emailAddress || "",
                name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
            },
        });
    }

    return {
        isOnboarded: !!user?.industry,
        user,
    };
}



