import { redirect } from "next/navigation";
import { auth } from "../auth";
import { prisma } from "@/prisma/client";
import { AccountUser } from "@/components/account-user";
import { AccountEmployee } from "@/components/account-employee";
import { AccountAdmin } from "@/components/account-admin";

export default async function AccountPage() {
    const session = await auth();
    if (!session?.user.id) {
        redirect("/login");
    }

    const user = await prisma.utilisateur.findFirst({
        where: { utilisateur_id: Number(session.user.id) },
        include: { role: true },
    });

    if (!user || !user.actif) {
        redirect("/login");
    }

    switch (user.role.libelle) {
        case "Administrateur":
            return <AccountAdmin user={user} />;
        case "Employé":
            return <AccountEmployee user={user} />;
        default:
            return <AccountUser user={user} />;
    }
}
