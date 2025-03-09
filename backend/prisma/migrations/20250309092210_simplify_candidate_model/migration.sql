/*
  Warnings:

  - You are about to drop the `Education` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkExperience` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "WorkExperience" DROP CONSTRAINT "WorkExperience_candidateId_fkey";

-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "education" TEXT,
ADD COLUMN     "experience" TEXT;

-- DropTable
DROP TABLE "Education";

-- DropTable
DROP TABLE "WorkExperience";
