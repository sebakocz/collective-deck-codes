/*
  Warnings:

  - The `state` column on the `Card` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "pools" INTEGER[],
DROP COLUMN "state",
ADD COLUMN     "state" INTEGER;
