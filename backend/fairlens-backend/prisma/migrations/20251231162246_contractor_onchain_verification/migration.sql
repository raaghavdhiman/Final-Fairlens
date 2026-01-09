/*
  Warnings:

  - You are about to drop the column `contractAddress` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "contractAddress",
ADD COLUMN     "contractorHash" TEXT;
