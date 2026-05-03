import { Prisma, PrismaClient } from "@prisma/client";

export const db = globalThis.prisma || new PrismaClient();

const DB_UNAVAILABLE_REGEX = /can't reach database server|p1001|p1002|connection.*timed out/i;

export function isDatabaseUnavailableError(error) {
    if (!error) return false;

    if (error instanceof Prisma.PrismaClientInitializationError) {
        return true;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return error.code === "P1001" || error.code === "P1002";
    }

    return DB_UNAVAILABLE_REGEX.test(String(error.message || error));
}

export function getDatabaseUnavailableMessage() {
    return "Database is temporarily unavailable. Please verify DATABASE_URL and ensure Neon is reachable, then try again.";
}

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
}