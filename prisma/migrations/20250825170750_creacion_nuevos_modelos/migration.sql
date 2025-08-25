-- CreateEnum
CREATE TYPE "public"."socialStratum" AS ENUM ('E1', 'E2', 'E3', 'E4', 'E5', 'E6');

-- CreateEnum
CREATE TYPE "public"."etnicalGroup" AS ENUM ('Ninguno', 'Afrodescendiente', 'Indigena', 'Raizal', 'Rom_Gitano', 'Palenquero', 'Otro');

-- CreateEnum
CREATE TYPE "public"."typeDocument" AS ENUM ('CC', 'TI', 'CE', 'Pasaporte');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('FEMENINO', 'MASCULINO', 'OTRO');

-- CreateEnum
CREATE TYPE "public"."EventStatus" AS ENUM ('Planeado', 'Finalizado');

-- CreateTable
CREATE TABLE "public"."Programas" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "requirements" TEXT[],
    "benefits" TEXT[],
    "specificInformation" JSONB NOT NULL,

    CONSTRAINT "Programas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RegistroPrograma" (
    "id" SERIAL NOT NULL,
    "typeDocument" "public"."typeDocument" NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "numDocument" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "comune" TEXT NOT NULL,
    "socialStratum" "public"."socialStratum" NOT NULL,
    "age" INTEGER NOT NULL,
    "etnicalGroup" "public"."etnicalGroup" NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motivation" TEXT NOT NULL,
    "expectations" TEXT NOT NULL,
    "acceptTerms" BOOLEAN NOT NULL,
    "specificInformation" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "programaId" INTEGER NOT NULL,

    CONSTRAINT "RegistroPrograma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."events" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "registered" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "public"."EventStatus" NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inscripciones_por_evento" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "numDocument" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inscripciones_por_evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_EventProgramas" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EventProgramas_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegistroPrograma_programaId_numDocument_key" ON "public"."RegistroPrograma"("programaId", "numDocument");

-- CreateIndex
CREATE UNIQUE INDEX "inscripciones_por_evento_numDocument_eventId_key" ON "public"."inscripciones_por_evento"("numDocument", "eventId");

-- CreateIndex
CREATE INDEX "_EventProgramas_B_index" ON "public"."_EventProgramas"("B");

-- AddForeignKey
ALTER TABLE "public"."RegistroPrograma" ADD CONSTRAINT "RegistroPrograma_programaId_fkey" FOREIGN KEY ("programaId") REFERENCES "public"."Programas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inscripciones_por_evento" ADD CONSTRAINT "inscripciones_por_evento_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EventProgramas" ADD CONSTRAINT "_EventProgramas_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Programas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EventProgramas" ADD CONSTRAINT "_EventProgramas_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
