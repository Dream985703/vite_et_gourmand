CREATE TABLE "commande" (
    "numero_commande" VARCHAR(50) NOT NULL,
    "date_commande" DATE NOT NULL,
    "date_prestation" DATE NOT NULL,
    "heure_livraison" VARCHAR(50) NOT NULL,
    "prix_menu" DOUBLE PRECISION NOT NULL,
    "nombre_personne" INTEGER NOT NULL,
    "prix_livraison" DOUBLE PRECISION NOT NULL,
    "statut" VARCHAR(50) NOT NULL,
    "pret_materiel" BOOLEAN NOT NULL,
    "restitution_materiel" BOOLEAN NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "utilisateur_id" INTEGER NOT NULL,

    CONSTRAINT "commande_pkey" PRIMARY KEY ("numero_commande")
);

CREATE TABLE "menu" (
    "menu_id" SERIAL NOT NULL,
    "titre" VARCHAR(50) NOT NULL,
    "nombre_personne_minimum" INTEGER NOT NULL,
    "prix_par_personne" DOUBLE PRECISION NOT NULL,
    "regime" VARCHAR(50) NOT NULL,
    "description" VARCHAR(50) NOT NULL,
    "quantite_restante" INTEGER NOT NULL,
    "regime_id" INTEGER NOT NULL,
    "theme_id" INTEGER NOT NULL,

    CONSTRAINT "menu_pkey" PRIMARY KEY ("menu_id")
);

CREATE TABLE "regime" (
    "regime_id" SERIAL NOT NULL,
    "libelle" VARCHAR(50) NOT NULL,

    CONSTRAINT "regime_pkey" PRIMARY KEY ("regime_id")
);

CREATE TABLE "theme" (
    "theme_id" SERIAL NOT NULL,
    "libelle" VARCHAR(50) NOT NULL,

    CONSTRAINT "theme_pkey" PRIMARY KEY ("theme_id")
);

CREATE TABLE "utilisateur" (
    "utilisateur_id" SERIAL NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "prenom" VARCHAR(50) NOT NULL,
    "telephone" VARCHAR(50) NOT NULL,
    "ville" VARCHAR(50) NOT NULL,
    "pays" VARCHAR(50) NOT NULL,
    "adresse_postale" VARCHAR(50) NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "utilisateur_pkey" PRIMARY KEY ("utilisateur_id")
);

CREATE TABLE "role" (
    "role_id" INTEGER NOT NULL,
    "libelle" VARCHAR(50) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("role_id")
);

CREATE TABLE "avis" (
    "avis_id" INTEGER NOT NULL,
    "note" VARCHAR(50) NOT NULL,
    "description" VARCHAR(50) NOT NULL,
    "statut" VARCHAR(50) NOT NULL,
    "utilisateur_id" INTEGER NOT NULL,

    CONSTRAINT "avis_pkey" PRIMARY KEY ("avis_id")
);

CREATE TABLE "plat" (
    "plat_id" SERIAL NOT NULL,
    "titre_plat" VARCHAR(50) NOT NULL,
    "photo" BYTEA NOT NULL,

    CONSTRAINT "plat_pkey" PRIMARY KEY ("plat_id")
);

CREATE TABLE "allergene" (
    "allergene_id" SERIAL NOT NULL,
    "libelle" VARCHAR(50) NOT NULL,

    CONSTRAINT "allergene_pkey" PRIMARY KEY ("allergene_id")
);

CREATE TABLE "horaire" (
    "horaire_id" SERIAL NOT NULL,
    "jour" VARCHAR(50) NOT NULL,
    "heure_ouverture" VARCHAR(50) NOT NULL,
    "heure_fermeture" VARCHAR(50) NOT NULL,

    CONSTRAINT "horaire_pkey" PRIMARY KEY ("horaire_id")
);

CREATE TABLE "_menuToplat" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_menuToplat_AB_pkey" PRIMARY KEY ("A","B")
);

CREATE TABLE "_allergeneToplat" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_allergeneToplat_AB_pkey" PRIMARY KEY ("A","B")
);

CREATE INDEX "_menuToplat_B_index" ON "_menuToplat"("B");

CREATE INDEX "_allergeneToplat_B_index" ON "_allergeneToplat"("B");

ALTER TABLE "commande" ADD CONSTRAINT "commande_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menu"("menu_id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "commande" ADD CONSTRAINT "commande_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateur"("utilisateur_id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "menu" ADD CONSTRAINT "menu_regime_id_fkey" FOREIGN KEY ("regime_id") REFERENCES "regime"("regime_id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "menu" ADD CONSTRAINT "menu_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "theme"("theme_id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "utilisateur" ADD CONSTRAINT "utilisateur_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "avis" ADD CONSTRAINT "avis_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateur"("utilisateur_id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "_menuToplat" ADD CONSTRAINT "_menuToplat_A_fkey" FOREIGN KEY ("A") REFERENCES "menu"("menu_id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_menuToplat" ADD CONSTRAINT "_menuToplat_B_fkey" FOREIGN KEY ("B") REFERENCES "plat"("plat_id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_allergeneToplat" ADD CONSTRAINT "_allergeneToplat_A_fkey" FOREIGN KEY ("A") REFERENCES "allergene"("allergene_id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_allergeneToplat" ADD CONSTRAINT "_allergeneToplat_B_fkey" FOREIGN KEY ("B") REFERENCES "plat"("plat_id") ON DELETE CASCADE ON UPDATE CASCADE;
