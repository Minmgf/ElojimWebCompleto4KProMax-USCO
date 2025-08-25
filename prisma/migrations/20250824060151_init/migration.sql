/*
  Warnings:

  - Changed the type of `duration` on the `events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."events" DROP COLUMN "duration",
ADD COLUMN     "duration" INTEGER NOT NULL,
ALTER COLUMN "status" SET DATA TYPE TEXT;
