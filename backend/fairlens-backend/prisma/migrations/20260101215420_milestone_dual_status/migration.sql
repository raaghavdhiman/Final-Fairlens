/*
  Warnings:

  - You are about to drop the column `completedAt` on the `milestones` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `milestones` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `milestones` table. All the data in the column will be lost.
  - Added the required column `amount` to the `milestones` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MilestoneWorkStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED');

-- CreateEnum
CREATE TYPE "MilestonePaymentStatus" AS ENUM ('NOT_ELIGIBLE', 'SUBMITTED', 'VERIFIED', 'PAID');

-- AlterTable
ALTER TABLE "milestones" DROP COLUMN "completedAt",
DROP COLUMN "dueDate",
DROP COLUMN "status",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentStatus" "MilestonePaymentStatus" NOT NULL DEFAULT 'NOT_ELIGIBLE',
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "workStatus" "MilestoneWorkStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "MilestoneStatus";
