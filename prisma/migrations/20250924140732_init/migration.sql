/*
  Warnings:

  - Added the required column `role` to the `RequestCollaborate` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `RequestCollaborate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `experienceYears` on table `RequestCollaborate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hoursPerWeek` on table `RequestCollaborate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `message` on table `RequestCollaborate` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."RoleEnum" AS ENUM ('ADMIN', 'AUTHOR');

-- AlterTable
ALTER TABLE "public"."RequestCollaborate" ADD COLUMN     "role" "public"."RoleEnum" NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "experienceYears" SET NOT NULL,
ALTER COLUMN "hoursPerWeek" SET NOT NULL,
ALTER COLUMN "portfolioUrl" DROP NOT NULL,
ALTER COLUMN "message" SET NOT NULL;
