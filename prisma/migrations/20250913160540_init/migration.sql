/*
  Warnings:

  - The values [pending,failed] on the enum `AuthorRequestFunsStatusEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."AuthorRequestFunsStatusEnum_new" AS ENUM ('PENDING', 'REJECT', 'success');
ALTER TABLE "public"."AuthorRequestFuns" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."AuthorRequestFuns" ALTER COLUMN "status" TYPE "public"."AuthorRequestFunsStatusEnum_new" USING ("status"::text::"public"."AuthorRequestFunsStatusEnum_new");
ALTER TYPE "public"."AuthorRequestFunsStatusEnum" RENAME TO "AuthorRequestFunsStatusEnum_old";
ALTER TYPE "public"."AuthorRequestFunsStatusEnum_new" RENAME TO "AuthorRequestFunsStatusEnum";
DROP TYPE "public"."AuthorRequestFunsStatusEnum_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."AuthorRequestFuns" ALTER COLUMN "status" DROP DEFAULT;
