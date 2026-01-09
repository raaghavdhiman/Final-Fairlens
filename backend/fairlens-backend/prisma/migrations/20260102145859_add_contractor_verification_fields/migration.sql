-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedBy" UUID;
