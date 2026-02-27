/*
  Warnings:

  - A unique constraint covering the columns `[userId,episodeId]` on the table `CompleteEpisode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CompleteEpisode_userId_episodeId_key" ON "public"."CompleteEpisode"("userId", "episodeId");
