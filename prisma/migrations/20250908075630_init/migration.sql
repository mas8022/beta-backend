-- CreateTable
CREATE TABLE "public"."AuthorRequestFuns" (
    "id" SERIAL NOT NULL,
    "amount" BIGINT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthorRequestFuns_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."AuthorRequestFuns" ADD CONSTRAINT "AuthorRequestFuns_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
