/*
  Warnings:

  - You are about to drop the column `order` on the `Day` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Section` table. All the data in the column will be lost.
  - Added the required column `dayOrder` to the `Day` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Day` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exerciseOrder` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sectionOrder` to the `Section` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Day" DROP CONSTRAINT "Day_planId_fkey";

-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_dayId_fkey";

-- AlterTable
ALTER TABLE "Day" DROP COLUMN "order",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dayOrder" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "order",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "exerciseOrder" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "order",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sectionOrder" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Exercise_sectionId_idx" ON "Exercise"("sectionId");

-- CreateIndex
CREATE INDEX "Section_dayId_idx" ON "Section"("dayId");

-- AddForeignKey
ALTER TABLE "Day" ADD CONSTRAINT "Day_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
