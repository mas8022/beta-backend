/*
  Warnings:

  - The `status` column on the `CourseOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."CourseOrderStatusEnum" AS ENUM ('isPending', 'success', 'failed');

-- AlterTable
ALTER TABLE "public"."CourseOrder" DROP COLUMN "status",
ADD COLUMN     "status" "public"."CourseOrderStatusEnum" NOT NULL DEFAULT 'isPending';
