/*
  Warnings:

  - Added the required column `authorId` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Promotion" ADD COLUMN     "authorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Promotion" ADD CONSTRAINT "Promotion_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
