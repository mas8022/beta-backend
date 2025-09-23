-- CreateEnum
CREATE TYPE "public"."CourseReportStatusEnum" AS ENUM ('SEND', 'CORRECTION', 'ACCEPTE');

-- CreateTable
CREATE TABLE "public"."CourseReport" (
    "id" SERIAL NOT NULL,
    "status" "public"."CourseReportStatusEnum" NOT NULL DEFAULT 'SEND',
    "message" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CourseReport" ADD CONSTRAINT "CourseReport_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseReport" ADD CONSTRAINT "CourseReport_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
