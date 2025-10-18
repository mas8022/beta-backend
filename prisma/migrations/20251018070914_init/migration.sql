-- CreateTable
CREATE TABLE "public"."AdminConfirm" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "courseId" INTEGER,
    "lessonId" INTEGER,
    "episodeId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminConfirm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."AdminConfirm" ADD CONSTRAINT "AdminConfirm_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdminConfirm" ADD CONSTRAINT "AdminConfirm_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdminConfirm" ADD CONSTRAINT "AdminConfirm_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdminConfirm" ADD CONSTRAINT "AdminConfirm_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "public"."Episode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
