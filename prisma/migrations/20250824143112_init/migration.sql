/*
  Warnings:

  - The `roles` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Author` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'MANAGER', 'AUTHOR', 'TEACHER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "public"."Course" DROP CONSTRAINT "Course_authorId_fkey";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "roles",
ADD COLUMN     "roles" "public"."Role"[];

-- DropTable
DROP TABLE "public"."Author";

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
