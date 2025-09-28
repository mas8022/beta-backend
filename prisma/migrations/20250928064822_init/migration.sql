-- CreateEnum
CREATE TYPE "public"."EpisodeStatusEnum" AS ENUM ('waiting', 'rejected', 'publish');

-- AlterTable
ALTER TABLE "public"."Episode" ADD COLUMN     "status" "public"."EpisodeStatusEnum" NOT NULL DEFAULT 'waiting';
