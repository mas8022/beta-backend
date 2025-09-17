/*
  Warnings:

  - The values [REJECT,success] on the enum `AuthorRequestFunsStatusEnum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `roles` on the `RequestCollaborate` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."AuthorRequestFunsStatusEnum_new" AS ENUM ('PENDING', 'REJECTED', 'SUCCESS');
ALTER TABLE "public"."AuthorRequestFuns" ALTER COLUMN "status" TYPE "public"."AuthorRequestFunsStatusEnum_new" USING ("status"::text::"public"."AuthorRequestFunsStatusEnum_new");
ALTER TYPE "public"."AuthorRequestFunsStatusEnum" RENAME TO "AuthorRequestFunsStatusEnum_old";
ALTER TYPE "public"."AuthorRequestFunsStatusEnum_new" RENAME TO "AuthorRequestFunsStatusEnum";
DROP TYPE "public"."AuthorRequestFunsStatusEnum_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."AuthorRequestFuns" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."RequestCollaborate" DROP COLUMN "roles";
