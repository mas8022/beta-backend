-- CreateTable
CREATE TABLE "public"."Promotion" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "percent" INTEGER NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,
    "useageLimit" INTEGER NOT NULL DEFAULT 1,
    "courseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Promotion" ADD CONSTRAINT "Promotion_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
