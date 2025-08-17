/*
  Warnings:

  - You are about to drop the column `lessonsCount` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `students` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Course" DROP COLUMN "lessonsCount",
DROP COLUMN "students";
