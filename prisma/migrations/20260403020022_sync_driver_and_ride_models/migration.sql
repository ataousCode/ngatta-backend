/*
  Warnings:

  - The values [REQUESTED,ON_GOING] on the enum `RideStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `dropLat` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `dropLng` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `pickupLat` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `pickupLng` on the `Ride` table. All the data in the column will be lost.
  - Added the required column `fromLat` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromLng` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toLat` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toLng` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('CAR', 'MOTO');

-- AlterEnum
BEGIN;
CREATE TYPE "RideStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
ALTER TABLE "public"."Ride" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Ride" ALTER COLUMN "status" TYPE "RideStatus_new" USING ("status"::text::"RideStatus_new");
ALTER TYPE "RideStatus" RENAME TO "RideStatus_old";
ALTER TYPE "RideStatus_new" RENAME TO "RideStatus";
DROP TYPE "public"."RideStatus_old";
ALTER TABLE "Ride" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "licensePlate" TEXT,
ADD COLUMN     "vehicleType" "VehicleType" NOT NULL DEFAULT 'CAR';

-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "dropLat",
DROP COLUMN "dropLng",
DROP COLUMN "pickupLat",
DROP COLUMN "pickupLng",
ADD COLUMN     "fromLat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fromLng" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "toLat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "toLng" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
