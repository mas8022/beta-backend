/*
  Warnings:

  - You are about to drop the column `instructor` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `instructorAvatar` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Course" DROP COLUMN "instructor",
DROP COLUMN "instructorAvatar",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD COLUMN     "requirements" TEXT[],
ADD COLUMN     "whatYouLearn" TEXT[];

-- AlterTable
ALTER TABLE "public"."Lesson" DROP COLUMN "description",
DROP COLUMN "videoUrl";

-- AlterTable
ALTER TABLE "public"."Like" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "public"."Author" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Episode" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "videoUrl" TEXT NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Episode" ADD CONSTRAINT "Episode_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
