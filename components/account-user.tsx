import Link from "next/link";
import { prisma } from "@/prisma/client";
import { CancelOrderButton } from "@/components/cancel-order-button";
import { ProfileForm } from "@/components/profile-form";
import { ReviewForm } from "@/components/review-form";
import { canTrackOrder } from "@/app/lib/suivi";
import type { utilisateur } from "@/app/generated/prisma/client";

const currency = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
});

export async function AccountUser({ user }: { user: utilisateur }) {
    const orders = await prisma.commande.findMany({
        where: { utilisateur_id: user.utilisateur_id },
        include: { menu: true },
        orderBy: { date_commande: "desc" },
    });

    return (
        <main className="mx-auto w-full max-w-3xl px-6 py-10">
            <header className="mb-10 border-b border-primary-foreground/15 pb-6">
                <h1 className="font-erica text-3xl text-primary-foreground">
                    Mon compte
                </h1>
                <p className="mt-2 text-primary-foreground/70">
                    Bonjour {user.prenom}
                </p>
            </header>

            <section className="mb-12">
                <h2 className="mb-4 text-lg font-semibold text-primary-foreground">
                    Informations personnelles
                </h2>
                <div className="rounded-2xl bg-primary p-6">
                    <ProfileForm user={user} />
                </div>
            </section>

            <section>
                <h2 className="mb-6 text-lg font-semibold text-primary-foreground">
                    Mes commandes
                </h2>

                {orders.length === 0 ? (
                    <p className="text-primary-foreground/60">
                        Aucune commande pour le moment.
                    </p>
                ) : (
                    <ul className="flex flex-col gap-6">
                        {orders.map((order) => {
                            const total =
                                order.prix_menu + order.prix_livraison;

                            return (
                                <li
                                    key={order.numero_commande}
                                    className="border-b border-primary-foreground/10 pb-6 last:border-0">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                                <p className="font-semibold text-primary-foreground">
                                                    {order.numero_commande}
                                                </p>
                                                <p className="text-sm text-primary-foreground/50">
                                                    Commandée le{" "}
                                                    {new Date(
                                                        order.date_commande,
                                                    ).toLocaleDateString(
                                                        "fr-FR",
                                                    )}
                                                </p>
                                            </div>

                                            <p className="text-primary-foreground/80">
                                                Prestation du{" "}
                                                <span className="font-medium text-primary-foreground">
                                                    {new Date(
                                                        order.date_prestation,
                                                    ).toLocaleDateString(
                                                        "fr-FR",
                                                    )}
                                                </span>
                                                {" · "}
                                                livraison à{" "}
                                                <span className="font-medium text-primary-foreground">
                                                    {order.heure_livraison}
                                                </span>
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-indigo-600">
                                                {order.statut}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-2xl font-semibold text-primary-foreground">
                                                {currency.format(total)}
                                            </p>
                                            <p className="mt-1 text-sm text-primary-foreground/50">
                                                {currency.format(
                                                    order.prix_menu,
                                                )}{" "}
                                                menu
                                                {order.prix_livraison > 0 && (
                                                    <>
                                                        {" · "}
                                                        {currency.format(
                                                            order.prix_livraison,
                                                        )}{" "}
                                                        livraison
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-primary-foreground/80">
                                        {order.menu.titre}
                                        <span className="text-primary-foreground/50">
                                            {" "}
                                            · {order.nombre_personne} personne
                                            {order.nombre_personne > 1
                                                ? "s"
                                                : ""}
                                            {order.pret_materiel
                                                ? " · prêt matériel"
                                                : ""}
                                        </span>
                                    </p>

                                    {order.statut ===
                                        "En attente d'acceptation" && (
                                        <div className="mt-4 flex flex-wrap items-center gap-3">
                                            <Link
                                                href={`/account/${encodeURIComponent(order.numero_commande)}/edit`}
                                                className="rounded-lg border border-primary-foreground/30 px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary-foreground/5">
                                                Modifier
                                            </Link>
                                            <CancelOrderButton
                                                numeroCommande={
                                                    order.numero_commande
                                                }
                                            />
                                        </div>
                                    )}

                                    {canTrackOrder(order.statut) && (
                                        <div className="mt-4">
                                            <Link
                                                href={`/track?numero=${encodeURIComponent(order.numero_commande)}`}
                                                className="rounded-lg bg-primary-foreground px-3 py-1.5 text-sm text-white hover:opacity-90">
                                                Suivre ma commande
                                            </Link>
                                        </div>
                                    )}

                                    {order.statut === "Terminée" && (
                                        <ReviewForm
                                            numeroCommande={
                                                order.numero_commande
                                            }
                                        />
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>
        </main>
    );
}
