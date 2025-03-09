-- Convertire tutti i record con stato EVALUATED in PENDING
UPDATE "Candidate" SET "status" = 'PENDING' WHERE "status" = 'EVALUATED';

-- Creare un nuovo tipo di enumerazione senza EVALUATED
CREATE TYPE "Status_new" AS ENUM ('PENDING', 'REJECTED', 'INTERVIEW', 'OFFERED', 'HIRED');

-- Aggiornare la colonna status per utilizzare il nuovo tipo di enumerazione
ALTER TABLE "Candidate" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");

-- Eliminare il vecchio tipo di enumerazione
DROP TYPE "Status";

-- Rinominare il nuovo tipo di enumerazione
ALTER TYPE "Status_new" RENAME TO "Status"; 