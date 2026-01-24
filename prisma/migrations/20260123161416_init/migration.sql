/*
  Warnings:

  - You are about to drop the column `timeSec` on the `Exercise` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "timeSec",
ADD COLUMN     "timeUnit" TEXT,
ADD COLUMN     "timeValue" INTEGER;
