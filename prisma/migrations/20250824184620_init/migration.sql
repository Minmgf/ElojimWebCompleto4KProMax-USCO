/*
  Warnings:

  - Changed the type of `status` on the `events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."RegistroPrograma" ALTER COLUMN "phone" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."events" DROP COLUMN "status",
ADD COLUMN     "status" "public"."EventStatus" NOT NULL;
