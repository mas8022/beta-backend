-- CreateEnum
CREATE TYPE "public"."LessonStatusEnum" AS ENUM ('waiting', 'publish');

-- AlterTable
ALTER TABLE "public"."Lesson" ADD COLUMN     "status" "public"."LessonStatusEnum" NOT NULL DEFAULT 'waiting';
