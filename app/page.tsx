import Link from "next/link";
import { prisma } from "@/prisma/client";
import { Button } from "@/components/ui/button";

export default async function Home() {
    const avis = await prisma.avis.findMany({
        where: { statut: "Validé" },
        include: {
            utilisateur: {
                select: { prenom: true, nom: true },
            },
        },
        orderBy: { avis_id: "desc" },
        take: 6,
    });

    return (
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-16 px-6 py-10">
            <section className="rounded-tl-4xl rounded-br-4xl bg-primary p-10">
                <h1 className="font-erica text-4xl text-primary-foreground">
                    Vite & Gourmand
                </h1>
                <p className="mt-4 max-w-xl text-primary-foreground/80">
                    Entreprise de restauration basée à Bordeaux, nous
                    préparons des menus pour vos événements, réunions et
                    moments conviviaux. Commandez en ligne, on s&apos;occupe
                    de la suite : cuisine, livraison et prêt de matériel si
                    besoin.
                </p>
                <p className="mt-3 max-w-xl text-primary-foreground/80">
                    Notre but est simple : vous proposer une cuisine soignée,
                    avec des délais clairs et un suivi de commande jusqu&apos;à
                    la livraison.
                </p>
                <div className="mt-8">
                    <Link href="/menus">
                        <Button>Voir les menus</Button>
                    </Link>
                </div>
            </section>

            <section>
                <h2 className="font-erica text-3xl text-primary-foreground">
                    Une équipe pro
                </h2>
                <p className="mt-2 text-primary-foreground/70">
                    Des personnes formées pour chaque étape de votre commande.
                </p>
                <ul className="mt-8 flex flex-col gap-6">
                    <li className="border-b border-primary-foreground/10 pb-6">
                        <p className="font-semibold text-primary-foreground">
                            Cuisine
                        </p>
                        <p className="mt-1 text-primary-foreground/80">
                            Préparation des menus avec rigueur, hygiène et
                            respect des régimes alimentaires.
                        </p>
                    </li>
                    <li className="border-b border-primary-foreground/10 pb-6">
                        <p className="font-semibold text-primary-foreground">
                            Logistique
                        </p>
                        <p className="mt-1 text-primary-foreground/80">
                            Organisation des livraisons pour arriver à
                            l&apos;heure, au bon endroit, avec le bon matériel.
                        </p>
                    </li>
                    <li className="border-b border-primary-foreground/10 pb-6 last:border-0">
                        <p className="font-semibold text-primary-foreground">
                            Suivi client
                        </p>
                        <p className="mt-1 text-primary-foreground/80">
                            Une équipe joignable pour valider, accompagner et
                            répondre à vos demandes jusqu&apos;à la fin de la
                            prestation.
                        </p>
                    </li>
                </ul>
            </section>

            <section>
                <h2 className="font-erica text-3xl text-primary-foreground">
                    Avis clients
                </h2>
                <p className="mt-2 text-primary-foreground/70">
                    Les retours validés par notre équipe.
                </p>

                {avis.length === 0 ? (
                    <p className="mt-8 text-primary-foreground/60">
                        Pas encore d&apos;avis validés.
                    </p>
                ) : (
                    <ul className="mt-8 flex flex-col gap-6">
                        {avis.map((a) => (
                            <li
                                key={a.avis_id}
                                className="border-b border-primary-foreground/10 pb-6 last:border-0">
                                <p className="font-semibold text-primary-foreground">
                                    {a.utilisateur.prenom} {a.utilisateur.nom}
                                    <span className="ml-2 text-sm font-normal text-primary-foreground/50">
                                        note {a.note}/5
                                    </span>
                                </p>
                                <p className="mt-2 text-primary-foreground/80">
                                    {a.description}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}
