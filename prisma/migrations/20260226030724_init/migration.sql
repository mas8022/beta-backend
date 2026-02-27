-- CreateTable
CREATE TABLE "public"."CompleteEpisode" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "episodeId" INTEGER NOT NULL,

    CONSTRAINT "CompleteEpisode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CompleteEpisode" ADD CONSTRAINT "CompleteEpisode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompleteEpisode" ADD CONSTRAINT "CompleteEpisode_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "public"."Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
