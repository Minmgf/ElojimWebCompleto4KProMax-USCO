-- CreateTable
CREATE TABLE "public"."news" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT[],
    "important" BOOLEAN NOT NULL DEFAULT false,
    "images" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "news_isActive_idx" ON "public"."news"("isActive");

-- CreateIndex
CREATE INDEX "news_important_idx" ON "public"."news"("important");

-- CreateIndex
CREATE INDEX "news_createdAt_idx" ON "public"."news"("createdAt");

-- CreateIndex
CREATE INDEX "news_category_idx" ON "public"."news"("category");

-- AddForeignKey
ALTER TABLE "public"."news" ADD CONSTRAINT "news_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
