import { prisma } from "@/prisma/client";

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
        <main className="mx-auto w-full max-w-3xl px-6 py-10">
            <section>
                <h1 className="font-erica text-3xl text-primary-foreground">
                    Avis clients
                </h1>
                <p className="mt-2 text-primary-foreground/70">
                    Ce que disent nos clients.
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
                                        note {a.note}
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
