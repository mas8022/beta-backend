-- CreateEnum
CREATE TYPE "public"."AdminConfirmStatusEnum" AS ENUM ('WAITING', 'DELETE', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."AdminConfirm" ADD COLUMN     "status" "public"."AdminConfirmStatusEnum" NOT NULL DEFAULT 'WAITING';
