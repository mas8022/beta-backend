/*
  Warnings:

  - You are about to drop the column `useageLimit` on the `Promotion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Promotion" DROP COLUMN "useageLimit",
ADD COLUMN     "usageLimit" INTEGER NOT NULL DEFAULT 1;
