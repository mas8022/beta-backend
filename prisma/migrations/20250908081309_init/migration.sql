-- CreateEnum
CREATE TYPE "public"."AuthorRequestFunsStatusEnum" AS ENUM ('pending', 'failed', 'success');

-- AlterTable
ALTER TABLE "public"."AuthorRequestFuns" ADD COLUMN     "status" "public"."AuthorRequestFunsStatusEnum" NOT NULL DEFAULT 'pending';
