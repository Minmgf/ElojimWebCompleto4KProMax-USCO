-- AlterTable
ALTER TABLE "public"."inscripciones_por_evento" ADD COLUMN     "email" TEXT NOT NULL DEFAULT 'no-email@example.com',
ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '0000000000';
