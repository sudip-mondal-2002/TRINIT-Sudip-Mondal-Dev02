-- CreateTable
CREATE TABLE "Usage" (
    "id" SERIAL NOT NULL,
    "report_id" TEXT NOT NULL,
    "website_url" TEXT NOT NULL,
    "website_user" BIGINT NOT NULL,

    CONSTRAINT "Usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usage_report_id_key" ON "Usage"("report_id");
