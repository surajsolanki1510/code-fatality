-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "email" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordHash" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "displayName" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isGuest" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE IF NOT EXISTS "QuestCompletion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuestCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_createdAt_idx" ON "User"("createdAt");
CREATE INDEX IF NOT EXISTS "User_isGuest_idx" ON "User"("isGuest");
CREATE UNIQUE INDEX IF NOT EXISTS "QuestCompletion_userId_questId_key" ON "QuestCompletion"("userId", "questId");
CREATE INDEX IF NOT EXISTS "QuestCompletion_userId_idx" ON "QuestCompletion"("userId");
CREATE INDEX IF NOT EXISTS "QuestCompletion_questId_idx" ON "QuestCompletion"("questId");
CREATE INDEX IF NOT EXISTS "QuestCompletion_completedAt_idx" ON "QuestCompletion"("completedAt");

-- AddForeignKey
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'QuestCompletion_userId_fkey') THEN
    ALTER TABLE "QuestCompletion" ADD CONSTRAINT "QuestCompletion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Migrate old array progress if present, then drop
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Progress' AND column_name = 'completedQuestIds'
  ) THEN
    EXECUTE 'INSERT INTO "QuestCompletion" (id, "userId", "questId", "xpEarned")
      SELECT md5(random()::text || clock_timestamp()::text), p."userId", qid, 0
      FROM "Progress" p
      CROSS JOIN LATERAL unnest(COALESCE(p."completedQuestIds", ARRAY[]::text[])) AS qid
      ON CONFLICT DO NOTHING';
    EXECUTE 'ALTER TABLE "Progress" DROP COLUMN "completedQuestIds"';
  END IF;
END $$;
