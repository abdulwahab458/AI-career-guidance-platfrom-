-- Convert array-backed columns to JSONB so Prisma can read them as Json fields.
ALTER TABLE "Assessment"
  ALTER COLUMN "questions" TYPE JSONB USING to_jsonb("questions");

ALTER TABLE "User"
  ALTER COLUMN "skills" TYPE JSONB USING to_jsonb("skills");

ALTER TABLE "IndustryInsights"
  ALTER COLUMN "salaryRanges" TYPE JSONB USING to_jsonb("salaryRanges"),
  ALTER COLUMN "topSkills" TYPE JSONB USING to_jsonb("topSkills"),
  ALTER COLUMN "keyTrends" TYPE JSONB USING to_jsonb("keyTrends"),
  ALTER COLUMN "recommendedSkills" TYPE JSONB USING to_jsonb("recommendedSkills");