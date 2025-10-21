/*
  Warnings:

  - The values [عمومی,عضویت,رویدادها,پشتیبانی_فنی] on the enum `TopicEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."TopicEnum_new" AS ENUM ('GENERAL', 'REPORT', 'TECHNICAL');
ALTER TABLE "public"."ContactUs" ALTER COLUMN "topic" TYPE "public"."TopicEnum_new" USING ("topic"::text::"public"."TopicEnum_new");
ALTER TYPE "public"."TopicEnum" RENAME TO "TopicEnum_old";
ALTER TYPE "public"."TopicEnum_new" RENAME TO "TopicEnum";
DROP TYPE "public"."TopicEnum_old";
COMMIT;
