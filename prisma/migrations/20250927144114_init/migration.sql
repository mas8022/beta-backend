-- DropIndex
DROP INDEX "public"."CourseOrder_userId_courseId_status_key";

-- CreateIndex
CREATE INDEX "CourseOrder_userId_courseId_idx" ON "public"."CourseOrder"("userId", "courseId");
