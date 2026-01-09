/*
  Warnings:

  - You are about to drop the column `paymentStatus` on the `milestones` table. All the data in the column will be lost.
  - You are about to drop the column `workStatus` on the `milestones` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED');

-- AlterTable
ALTER TABLE "milestones" DROP COLUMN "paymentStatus",
DROP COLUMN "workStatus",
ADD COLUMN     "status" "MilestoneStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "MilestonePaymentStatus";

-- DropEnum
DROP TYPE "MilestoneWorkStatus";
