/*
  Warnings:

  - You are about to drop the column `verifiedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `verifiedBy` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tenders" DROP CONSTRAINT "tenders_createdById_fkey";

-- AlterTable
ALTER TABLE "tenders" ADD COLUMN     "winningContractorId" UUID;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "verifiedAt",
DROP COLUMN "verifiedBy",
ADD COLUMN     "contractAddress" TEXT;

-- AddForeignKey
ALTER TABLE "tenders" ADD CONSTRAINT "tenders_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenders" ADD CONSTRAINT "tenders_winningContractorId_fkey" FOREIGN KEY ("winningContractorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
