import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "../auth";
import { prisma } from "@/prisma/client";
import {
    STATUT_SUIVI_LABELS,
    STATUT_SUIVI_ORDER,
    canTrackOrder,
} from "@/app/lib/suivi";

type SearchParams = Promise<{ numero?: string }>;

export default async function TrackPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const session = await auth();
    if (!session?.user.id) {
        redirect("/login");
    }

    const { numero } = await searchParams;
    if (!numero) {
        redirect("/account");
    }

    const numeroCommande = decodeURIComponent(numero);

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

    const steps = STATUT_SUIVI_ORDER.filter(
        (statut) =>
            statut !== "EnAttenteDuRetourDeMateriel" || order.pret_materiel,
    );

    const suiviByStatut = new Map(
        order.suivis.map((s) => [s.statut, s] as const),
    );

    const latestSuivi = order.suivis.at(-1) ?? null;
    const currentIndex = latestSuivi
        ? steps.indexOf(latestSuivi.statut)
        : -1;

    return (
        <main className="mx-auto w-full max-w-2xl px-6 py-10">
            <Link
                href="/account"
                className="text-sm text-primary-foreground/60 hover:text-primary-foreground">
                ← Mes commandes
            </Link>

            <header className="mt-6 mb-10 border-b border-primary-foreground/15 pb-6">
                <h1 className="font-erica text-3xl text-primary-foreground">
                    Suivi
                </h1>
                <p className="mt-2 font-semibold text-primary-foreground">
                    {order.numero_commande}
                </p>
                <p className="mt-1 text-primary-foreground/70">
                    {order.menu.titre} · prestation du{" "}
                    {new Date(order.date_prestation).toLocaleDateString(
                        "fr-FR",
                    )}
                </p>
            </header>

            <ol className="relative flex flex-col">
                {steps.map((statut, index) => {
                    const suivi = suiviByStatut.get(statut);
                    const done = index <= currentIndex;
                    const current = index === currentIndex;

                    return (
                        <li
                            key={statut}
                            className="relative flex gap-4 pb-8 last:pb-0">
                            {index < steps.length - 1 && (
                                <span
                                    aria-hidden
                                    className={`absolute top-3 left-[7px] h-full w-px ${index < currentIndex
                                            ? "bg-primary-foreground"
                                            : "bg-primary-foreground/15"
                                        }`}
                                />
                            )}
                            <span
                                className={`relative z-10 mt-1 size-3.5 shrink-0 rounded-full border-2 ${done
                                        ? "border-primary-foreground bg-primary-foreground"
                                        : "border-primary-foreground/25 bg-transparent"
                                    } ${current ? "ring-2 ring-primary-foreground/25 ring-offset-2" : ""}`}
                            />
                            <div className="min-w-0 pt-0.5">
                                <p
                                    className={`font-medium ${done
                                            ? "text-primary-foreground"
                                            : "text-primary-foreground/40"
                                        }`}>
                                    {STATUT_SUIVI_LABELS[statut]}
                                </p>
                                {suivi ? (
                                    <p className="mt-0.5 text-sm text-primary-foreground/55">
                                        {new Date(
                                            suivi.date_heure,
                                        ).toLocaleString("fr-FR", {
                                            dateStyle: "short",
                                            timeStyle: "short",
                                        })}
                                    </p>
                                ) : (
                                    <p className="mt-0.5 text-sm text-primary-foreground/35">
                                        En attente
                                    </p>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </main>
    );
}
