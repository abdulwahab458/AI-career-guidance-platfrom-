/*
  Warnings:

  - You are about to drop the column `salarayRanges` on the `IndustryInsights` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IndustryInsights" DROP COLUMN "salarayRanges",
ADD COLUMN     "salaryRanges" JSONB[];
