/*
  Warnings:

  - You are about to drop the `Requestژollaborate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Requestژollaborate";

-- CreateTable
CREATE TABLE "public"."RequestCollaborate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "roles" TEXT[],
    "experienceYears" TEXT,
    "hoursPerWeek" TEXT,
    "expertise" TEXT NOT NULL,
    "portfolioUrl" TEXT NOT NULL,
    "linkedin" TEXT,
    "githubOrYoutube" TEXT,
    "location" TEXT,
    "message" TEXT,
    "acceptTerms" BOOLEAN NOT NULL DEFAULT false,
    "permission" "public"."PermissionStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestCollaborate_pkey" PRIMARY KEY ("id")
);
