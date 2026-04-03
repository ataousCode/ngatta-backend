-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "used" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hashedRefreshToken" TEXT;
