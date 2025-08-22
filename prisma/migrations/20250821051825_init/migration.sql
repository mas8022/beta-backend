/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseId]` on the table `CourseOrder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CourseOrder_userId_courseId_key" ON "public"."CourseOrder"("userId", "courseId");
