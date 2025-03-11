-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "encryptionKey" TEXT,
ALTER COLUMN "isEncrypted" SET DEFAULT false;
