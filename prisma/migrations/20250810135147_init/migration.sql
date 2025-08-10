-- CreateEnum
CREATE TYPE "public"."PermissionStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "public"."CreatorApplication" (
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

    CONSTRAINT "CreatorApplication_pkey" PRIMARY KEY ("id")
);
