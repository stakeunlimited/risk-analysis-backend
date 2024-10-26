/*
  Warnings:

  - Made the column `address` on table `Pool` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Pool" ALTER COLUMN "address" SET NOT NULL;
