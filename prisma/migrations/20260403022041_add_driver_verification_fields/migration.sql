-- CreateEnum
CREATE TYPE "DriverStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "idCardUrl" TEXT,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "licenseUrl" TEXT,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "status" "DriverStatus" NOT NULL DEFAULT 'PENDING';
