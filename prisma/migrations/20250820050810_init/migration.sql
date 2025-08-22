-- CreateTable
CREATE TABLE "public"."CourseOrder" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "authority" TEXT NOT NULL,

    CONSTRAINT "CourseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseOrder_authority_key" ON "public"."CourseOrder"("authority");

-- AddForeignKey
ALTER TABLE "public"."CourseOrder" ADD CONSTRAINT "CourseOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseOrder" ADD CONSTRAINT "CourseOrder_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
