-- CreateEnum
CREATE TYPE "public"."ManagerCourseReportStatusEnum" AS ENUM ('SEND', 'CORRECTION', 'ACCEPTE');

-- CreateTable
CREATE TABLE "public"."ManagerCourseReport" (
    "id" SERIAL NOT NULL,
    "status" "public"."ManagerCourseReportStatusEnum" NOT NULL DEFAULT 'SEND',
    "message" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ManagerCourseReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ManagerCourseReport" ADD CONSTRAINT "ManagerCourseReport_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ManagerCourseReport" ADD CONSTRAINT "ManagerCourseReport_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
