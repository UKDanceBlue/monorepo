-- CreateTable
CREATE TABLE "feed_items" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "title" TEXT NOT NULL,
    "textContent" TEXT,
    "image_id" INTEGER,

    CONSTRAINT "feed_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "feed_items_uuid_unique" ON "feed_items"("uuid");

-- CreateIndex
CREATE INDEX "feed_items_uuid" ON "feed_items"("uuid");

-- AddForeignKey
ALTER TABLE "feed_items" ADD CONSTRAINT "feed_items_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
