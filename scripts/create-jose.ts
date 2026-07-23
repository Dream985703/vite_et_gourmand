import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma/client";

async function main() {
    const adminRole = await prisma.role.findFirst({
        where: { libelle: "Administrateur" },
    });

    if (!adminRole) {
        throw new Error("Rôle Administrateur introuvable");
    }

    const email = "jose@viteetgourmand.fr";
    const existing = await prisma.utilisateur.findFirst({
        where: { email },
    });

    if (existing) {
        console.log("José existe déjà:", email);
        return;
    }

    const password = await bcrypt.hash("JoseAdmin1!", 10);

    await prisma.utilisateur.create({
        data: {
            email,
            password,
            prenom: "José",
            nom: "Admin",
            telephone: "-",
            ville: "Bordeaux",
            pays: "France",
            adresse_postale: "-",
            actif: true,
            role_id: adminRole.role_id,
        },
    });

    console.log("Compte José créé:", email);
    console.log("Mot de passe: JoseAdmin1!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
