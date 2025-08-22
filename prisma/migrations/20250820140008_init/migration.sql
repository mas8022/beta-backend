/*
  Warnings:

  - Changed the type of `authority` on the `CourseOrder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."CourseOrder" DROP COLUMN "authority",
ADD COLUMN     "authority" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CourseOrder_authority_key" ON "public"."CourseOrder"("authority");
