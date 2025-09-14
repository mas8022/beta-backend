/*
  Warnings:

  - The `permission` column on the `RequestCollaborate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `roles` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."UserStatusEnum" AS ENUM ('ACCESS', 'BLOCK');

-- CreateEnum
CREATE TYPE "public"."UserRoleEnum" AS ENUM ('USER', 'MANAGER', 'AUTHOR');

-- CreateEnum
CREATE TYPE "public"."PermissionStatusEnum" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "public"."RequestCollaborate" DROP COLUMN "permission",
ADD COLUMN     "permission" "public"."PermissionStatusEnum" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "status" "public"."UserStatusEnum" NOT NULL DEFAULT 'ACCESS',
DROP COLUMN "roles",
ADD COLUMN     "roles" "public"."UserRoleEnum"[];

-- DropEnum
DROP TYPE "public"."PermissionStatus";

-- DropEnum
DROP TYPE "public"."Role";
