-- CreateEnum
CREATE TYPE "public"."CourseStatusEnum" AS ENUM ('creating', 'waiting', 'publish');

-- AlterTable
ALTER TABLE "public"."Course" ADD COLUMN     "status" "public"."CourseStatusEnum" NOT NULL DEFAULT 'creating';
