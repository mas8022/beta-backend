-- CreateEnum
CREATE TYPE "public"."TopicEnum" AS ENUM ('عمومی', 'عضویت', 'رویدادها', 'پشتیبانی_فنی');

-- CreateTable
CREATE TABLE "public"."ContactUs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "topic" "public"."TopicEnum" NOT NULL,
    "message" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactUs_pkey" PRIMARY KEY ("id")
);
