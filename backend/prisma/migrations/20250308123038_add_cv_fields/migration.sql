-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "cvFileType" TEXT,
ADD COLUMN     "cvFileUrl" TEXT,
ADD COLUMN     "cvFilename" TEXT,
ADD COLUMN     "cvUploadedAt" TIMESTAMP(3);
