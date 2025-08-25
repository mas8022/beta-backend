/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Enrollment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Enrollment" DROP CONSTRAINT "Enrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Enrollment" DROP CONSTRAINT "Enrollment_userId_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "role",
ADD COLUMN     "roles" TEXT[];

-- DropTable
DROP TABLE "public"."Enrollment";
