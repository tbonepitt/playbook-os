-- AlterTable
ALTER TABLE "Playbook" ADD COLUMN "userId" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "Playbook_userId_updatedAt_idx" ON "Playbook"("userId", "updatedAt");
