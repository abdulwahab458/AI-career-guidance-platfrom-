"use server"

import { db, getDatabaseUnavailableMessage, isDatabaseUnavailableError } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server"
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    let user;
    try {
        user = await db.user.findUnique({
            where: { clerkUserId: userId },
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
            return { success: false, dbUnavailable: true, error: getDatabaseUnavailableMessage() };
        }
        throw error;
    }
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

    try {
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
    } catch (error) {
        if (isDatabaseUnavailableError(error)) {
            return { success: false, dbUnavailable: true, error: getDatabaseUnavailableMessage() };
        }
        throw error;
    }
}



export async function getUserStatus() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    try {
        let user = await db.user.findUnique({
            where: { clerkUserId: userId },
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

        // ✅ Auto-create the user if missing
        if (!user) {
            const clerkUser = await currentUser();
            user = await db.user.create({
                data: {
                    clerkUserId: userId,
                    email: clerkUser.emailAddresses[0]?.emailAddress || "",
                    name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
                },
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
        }

        return {
            isOnboarded: !!user?.industry,
            user,
            dbUnavailable: false,
        };
    } catch (error) {
        if (isDatabaseUnavailableError(error)) {
            console.error("Database unavailable in getUserStatus:", error);
            return {
                isOnboarded: false,
                user: null,
                dbUnavailable: true,
            };
        }
        throw error;
    }
}



