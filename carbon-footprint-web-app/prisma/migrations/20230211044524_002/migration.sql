/*
  Warnings:

  - You are about to drop the column `website_url` on the `Usage` table. All the data in the column will be lost.
  - You are about to drop the column `website_user` on the `Usage` table. All the data in the column will be lost.
  - Added the required column `website_origin` to the `Usage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `website_usage` to the `Usage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usage" DROP COLUMN "website_url",
DROP COLUMN "website_user",
ADD COLUMN     "website_origin" TEXT NOT NULL,
ADD COLUMN     "website_usage" BIGINT NOT NULL;
