ALTER TABLE "commande" ADD COLUMN "adresse" VARCHAR(50),
ADD COLUMN "client_email" VARCHAR(50),
ADD COLUMN "client_nom" VARCHAR(50),
ADD COLUMN "client_prenom" VARCHAR(50),
ADD COLUMN "client_telephone" VARCHAR(50),
ADD COLUMN "ville" VARCHAR(50);

UPDATE "commande" c
SET
  "client_prenom" = u."prenom",
  "client_nom" = u."nom",
  "client_email" = u."email",
  "client_telephone" = u."telephone",
  "adresse" = u."adresse_postale",
  "ville" = u."ville"
FROM "utilisateur" u
WHERE c."utilisateur_id" = u."utilisateur_id";

UPDATE "commande"
SET
  "client_prenom" = COALESCE("client_prenom", ''),
  "client_nom" = COALESCE("client_nom", ''),
  "client_email" = COALESCE("client_email", ''),
  "client_telephone" = COALESCE("client_telephone", ''),
  "adresse" = COALESCE("adresse", ''),
  "ville" = COALESCE("ville", '');

ALTER TABLE "commande" ALTER COLUMN "adresse" SET NOT NULL,
ALTER COLUMN "client_email" SET NOT NULL,
ALTER COLUMN "client_nom" SET NOT NULL,
ALTER COLUMN "client_prenom" SET NOT NULL,
ALTER COLUMN "client_telephone" SET NOT NULL,
ALTER COLUMN "ville" SET NOT NULL;
