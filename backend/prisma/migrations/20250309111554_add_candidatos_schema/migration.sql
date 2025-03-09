-- CreateTable
CREATE TABLE "candidatos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(15) NOT NULL,
    "direccion" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "educacion" (
    "id" SERIAL NOT NULL,
    "candidato_id" INTEGER NOT NULL,
    "institucion" VARCHAR(255) NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE,

    CONSTRAINT "educacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiencia_laboral" (
    "id" SERIAL NOT NULL,
    "candidato_id" INTEGER NOT NULL,
    "empresa" VARCHAR(255) NOT NULL,
    "puesto" VARCHAR(255) NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE,
    "descripcion" TEXT,

    CONSTRAINT "experiencia_laboral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" SERIAL NOT NULL,
    "candidato_id" INTEGER NOT NULL,
    "tipo_documento" VARCHAR(50) NOT NULL,
    "nombre_archivo" VARCHAR(255) NOT NULL,
    "ruta_archivo" VARCHAR(255) NOT NULL,
    "fecha_subida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidatos_email_key" ON "candidatos"("email");

-- AddForeignKey
ALTER TABLE "educacion" ADD CONSTRAINT "educacion_candidato_id_fkey" FOREIGN KEY ("candidato_id") REFERENCES "candidatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiencia_laboral" ADD CONSTRAINT "experiencia_laboral_candidato_id_fkey" FOREIGN KEY ("candidato_id") REFERENCES "candidatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_candidato_id_fkey" FOREIGN KEY ("candidato_id") REFERENCES "candidatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
