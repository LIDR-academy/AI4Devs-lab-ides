-- CreateTable
CREATE TABLE "candidatos" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(20) NOT NULL,
    "direccion" VARCHAR(255),
    "educacion" TEXT,
    "experiencia_laboral" TEXT,
    "cv" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidatos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidatos_email_key" ON "candidatos"("email");

-- CreateIndex
CREATE INDEX "candidatos_email_idx" ON "candidatos"("email");
