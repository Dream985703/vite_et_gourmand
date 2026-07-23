CREATE TYPE "statut_suivi" AS ENUM ('Accepté', 'En préparation', 'En cours de livraison', 'Livré', 'En attente du retour de matériel', 'Terminée');

CREATE TABLE "suivi_statut" (
    "suivi_id" SERIAL NOT NULL,
    "statut" "statut_suivi" NOT NULL,
    "date_heure" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numero_commande" VARCHAR(50) NOT NULL,

    CONSTRAINT "suivi_statut_pkey" PRIMARY KEY ("suivi_id")
);

ALTER TABLE "suivi_statut" ADD CONSTRAINT "suivi_statut_numero_commande_fkey" FOREIGN KEY ("numero_commande") REFERENCES "commande"("numero_commande") ON DELETE RESTRICT ON UPDATE CASCADE;
