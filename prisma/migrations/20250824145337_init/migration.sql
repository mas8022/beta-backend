/*
  Warnings:

  - The values [TEACHER,ADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Role_new" AS ENUM ('USER', 'MANAGER', 'AUTHOR');
ALTER TABLE "public"."User" ALTER COLUMN "roles" TYPE "public"."Role_new"[] USING ("roles"::text::"public"."Role_new"[]);
ALTER TYPE "public"."Role" RENAME TO "Role_old";
ALTER TYPE "public"."Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;
