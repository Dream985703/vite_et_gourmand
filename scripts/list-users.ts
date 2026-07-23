import "dotenv/config";
import { prisma } from "../prisma/client";

async function main() {
    const roles = await prisma.role.findMany();
    console.log("roles", roles);

    const users = await prisma.utilisateur.findMany({
        include: { role: true },
    });
    console.log(
        users.map((u) => ({
            email: u.email,
            prenom: u.prenom,
            role: u.role.libelle,
        })),
    );
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
