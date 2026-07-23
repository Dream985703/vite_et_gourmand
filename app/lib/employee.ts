import { auth } from "@/app/auth";
import { prisma } from "@/prisma/client";

export async function getEmployee() {
    const session = await auth();
    if (!session?.user.id) {
        return null;
    }

    const user = await prisma.utilisateur.findFirst({
        where: { utilisateur_id: Number(session.user.id) },
        include: { role: true },
    });

    if (!user || !user.actif) {
        return null;
    }

    if (
        user.role.libelle !== "Employé" &&
        user.role.libelle !== "Administrateur"
    ) {
        return null;
    }

    return user;
}
