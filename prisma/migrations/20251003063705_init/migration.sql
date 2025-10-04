/*
  Warnings:

  - You are about to drop the `AuthorRequestFuns` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."RequestFunsStatusEnum" AS ENUM ('PENDING', 'REJECTED', 'SUCCESS');

-- DropForeignKey
ALTER TABLE "public"."AuthorRequestFuns" DROP CONSTRAINT "AuthorRequestFuns_authorId_fkey";

-- DropTable
DROP TABLE "public"."AuthorRequestFuns";

-- DropEnum
DROP TYPE "public"."AuthorRequestFunsStatusEnum";

-- CreateTable
CREATE TABLE "public"."RequestFuns" (
    "id" SERIAL NOT NULL,
    "status" "public"."RequestFunsStatusEnum" NOT NULL DEFAULT 'PENDING',
    "amount" BIGINT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "transactionId" BIGINT,
    "requesterId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestFuns_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."RequestFuns" ADD CONSTRAINT "RequestFuns_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
