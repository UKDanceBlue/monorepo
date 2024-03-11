-- CreateTable
CREATE TABLE "marathons" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "year" TEXT NOT NULL,
    "start_date" TIMESTAMPTZ(6) NOT NULL,
    "end_date" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "marathons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marathon_hours" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "marathon_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "shown_starting_at" TIMESTAMPTZ(6) NOT NULL,
    "duration_info" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "marathon_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marathon_hour_map_images" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "marathon_hour_id" INTEGER NOT NULL,
    "image_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "marathon_hour_map_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "marathons_uuid_unique" ON "marathons"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "marathons_year_key" ON "marathons"("year");

-- CreateIndex
CREATE INDEX "marathons_uuid" ON "marathons"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "marathon_hours_uuid_unique" ON "marathon_hours"("uuid");

-- CreateIndex
CREATE INDEX "marathon_hours_uuid" ON "marathon_hours"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "marathon_hour_map_images_uuid_unique" ON "marathon_hour_map_images"("uuid");

-- CreateIndex
CREATE INDEX "marathon_hour_map_images_uuid" ON "marathon_hour_map_images"("uuid");

-- AddForeignKey
ALTER TABLE "marathon_hours" ADD CONSTRAINT "marathon_hours_marathon_id_fkey" FOREIGN KEY ("marathon_id") REFERENCES "marathons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marathon_hour_map_images" ADD CONSTRAINT "marathon_hour_map_images_marathon_hour_id_fkey" FOREIGN KEY ("marathon_hour_id") REFERENCES "marathon_hours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marathon_hour_map_images" ADD CONSTRAINT "marathon_hour_map_images_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;
