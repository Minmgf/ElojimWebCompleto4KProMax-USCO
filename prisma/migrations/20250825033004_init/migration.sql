-- DropForeignKey
ALTER TABLE "public"."_EventProgramas" DROP CONSTRAINT "_EventProgramas_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_EventProgramas" DROP CONSTRAINT "_EventProgramas_B_fkey";

-- AddForeignKey
ALTER TABLE "public"."_EventProgramas" ADD CONSTRAINT "_EventProgramas_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Programas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EventProgramas" ADD CONSTRAINT "_EventProgramas_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
