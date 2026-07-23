import type { utilisateur } from "@/app/generated/prisma/client";
import { prisma } from "@/prisma/client";
import { EmployeeSpace } from "@/components/employee-space";

export async function AccountEmployee({ user }: { user: utilisateur }) {
    const orders = await prisma.commande.findMany({
        include: {
            menu: true,
            suivis: { orderBy: { date_heure: "desc" } },
        },
        orderBy: { date_commande: "desc" },
    });

    const menus = await prisma.menu.findMany({
        orderBy: { menu_id: "desc" },
    });
    const themes = await prisma.theme.findMany();
    const regimes = await prisma.regime.findMany();
    const plats = await prisma.plat.findMany({
        select: {
            plat_id: true,
            titre_plat: true,
            menu: true,
        },
        orderBy: { plat_id: "desc" },
    });
    const horaires = await prisma.horaire.findMany({
        orderBy: { horaire_id: "asc" },
    });
    const avisList = await prisma.avis.findMany({
        include: {
            utilisateur: {
                select: {
                    utilisateur_id: true,
                    prenom: true,
                    nom: true,
                },
            },
        },
        orderBy: { avis_id: "desc" },
    });

    return (
        <main className="mx-auto w-full max-w-4xl px-6 py-10">
            <header className="mb-10 border-b border-primary-foreground/15 pb-6">
                <h1 className="font-erica text-3xl text-primary-foreground">
                    Espace employé
                </h1>
                <p className="mt-2 text-primary-foreground/70">
                    Bonjour {user.prenom}
                </p>
            </header>

            <EmployeeSpace
                orders={orders}
                menus={menus}
                themes={themes}
                regimes={regimes}
                plats={plats}
                horaires={horaires}
                avisList={avisList}
            />
        </main>
    );
}
