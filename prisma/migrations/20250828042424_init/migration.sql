/*
  Warnings:

  - You are about to drop the column `publish` on the `CourseComment` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."CourseCommentStatusEnum" AS ENUM ('pending', 'delete', 'confirm');

-- AlterTable
ALTER TABLE "public"."CourseComment" DROP COLUMN "publish",
ADD COLUMN     "status" "public"."CourseCommentStatusEnum" NOT NULL DEFAULT 'pending';
