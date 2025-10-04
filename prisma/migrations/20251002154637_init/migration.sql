/*
  Warnings:

  - You are about to drop the column `authorId` on the `CourseReport` table. All the data in the column will be lost.
  - Added the required column `reporterId` to the `CourseReport` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."CourseReport" DROP CONSTRAINT "CourseReport_authorId_fkey";

-- AlterTable
ALTER TABLE "public"."CourseReport" DROP COLUMN "authorId",
ADD COLUMN     "reporterId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."CourseReport" ADD CONSTRAINT "CourseReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
