/*
  Warnings:

  - The values [delete] on the enum `CourseCommentStatusEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."CourseCommentStatusEnum_new" AS ENUM ('pending', 'rejected', 'confirm');
ALTER TABLE "public"."CourseComment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."CourseComment" ALTER COLUMN "status" TYPE "public"."CourseCommentStatusEnum_new" USING ("status"::text::"public"."CourseCommentStatusEnum_new");
ALTER TYPE "public"."CourseCommentStatusEnum" RENAME TO "CourseCommentStatusEnum_old";
ALTER TYPE "public"."CourseCommentStatusEnum_new" RENAME TO "CourseCommentStatusEnum";
DROP TYPE "public"."CourseCommentStatusEnum_old";
ALTER TABLE "public"."CourseComment" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;
