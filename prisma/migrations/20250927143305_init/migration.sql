/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseId,status]` on the table `CourseOrder` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."CourseOrder_userId_courseId_key";

-- CreateIndex
CREATE UNIQUE INDEX "CourseOrder_userId_courseId_status_key" ON "public"."CourseOrder"("userId", "courseId", "status");
