import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "../auth";
import { prisma } from "@/prisma/client";
import { STATUT_SUIVI_LABELS, canTrackOrder } from "@/app/lib/suivi";
import { ChevronLeft } from "lucide-react";

export default async function TrackPage({
    searchParams,
}: {
    searchParams: Promise<{ numero?: string }>;
}) {
    const session = await auth();
    if (!session?.user.id) {
        redirect("/login");
    }

    const params = await searchParams;
    if (!params.numero) {
        redirect("/account");
    }

    const numeroCommande = decodeURIComponent(params.numero);

    const order = await prisma.commande.findFirst({
        where: {
            numero_commande: numeroCommande,
            utilisateur_id: Number(session.user.id),
        },
        include: {
            menu: true,
            suivis: {
                orderBy: { date_heure: "asc" },
            },
        },
    });

    if (!order) {
        notFound();
    }

    if (!canTrackOrder(order.statut)) {
        redirect("/account");
    }

    const etapes: string[] = [
        "Accepte",
        "EnPreparation",
        "EnCoursDeLivraison",
        "Livre",
    ];

    if (order.pret_materiel) {
        etapes.push("EnAttenteDuRetourDeMateriel");
    }
    etapes.push("Terminee");

    let etapeActuelle = -1;
    for (let i = 0; i < order.suivis.length; i++) {
        const index = etapes.indexOf(order.suivis[i].statut);
        if (index > etapeActuelle) {
            etapeActuelle = index;
        }
    }

    return (
        <main className="mx-auto w-full max-w-2xl px-6 py-10">
            <Link
                href="/account"
                className="text-sm text-primary-foreground/60 hover:text-primary-foreground flex items-center gap-2">

                <ChevronLeft className="size-4" />
                Retour à mes commandes
            </Link>

            <div className="mt-6 mb-10 border-b border-primary-foreground/15 pb-6">
                <h1 className="font-erica text-3xl text-primary-foreground">
                    Suivi
                </h1>
                <p className="mt-2 font-semibold text-primary-foreground">
                    {order.numero_commande}
                </p>
                <p className="mt-1 text-primary-foreground/70">
                    {order.menu.titre} ·{" "}
                    {new Date(order.date_prestation).toLocaleDateString("fr-FR")}
                </p>
            </div>

            <div className="flex flex-col gap-4">
                {etapes.map((statut, index) => {
                    let dateTexte = "En attente";
                    for (let i = 0; i < order.suivis.length; i++) {
                        if (order.suivis[i].statut === statut) {
                            dateTexte = new Date(
                                order.suivis[i].date_heure,
                            ).toLocaleString("fr-FR");
                        }
                    }

                    const fait = index <= etapeActuelle;

                    return (
                        <div key={statut} className="flex items-start gap-3">
                            <div
                                className={
                                    fait
                                        ? "mt-1 h-3 w-3 rounded-full bg-primary-foreground"
                                        : "mt-1 h-3 w-3 rounded-full border border-primary-foreground/30"
                                }
                            />
                            <div>
                                <p
                                    className={
                                        fait
                                            ? "font-medium text-primary-foreground"
                                            : "text-primary-foreground/40"
                                    }>
                                    {
                                        STATUT_SUIVI_LABELS[
                                        statut as keyof typeof STATUT_SUIVI_LABELS
                                        ]
                                    }
                                </p>
                                <p className="text-sm text-primary-foreground/50">
                                    {dateTexte}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
