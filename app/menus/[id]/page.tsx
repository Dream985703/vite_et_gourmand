import { Button } from "@/components/ui/button";
import { prisma } from "@/prisma/client";
import { Box, DollarSign, Snowflake, Users, Utensils } from "lucide-react";
import Link from "next/link";

type Params = Promise<{ id: string }>;

export default async function MenuPage({ params }: { params: Params }) {
    const id = (await params).id;
    const menu = await prisma.menu.findFirst({
        where: {
            menu_id: Number(id),
        },
        select: {
            titre: true,
            menu_id: true,
            description: true,
            nombre_personne_minimum: true,
            quantite_restante: true,
            prix_par_personne: true,
            themeRel: {
                select: {
                    libelle: true,
                },
            },
            regimeRel: {
                select: {
                    libelle: true,
                },
            },
        },
    });
    return (
        <section className="flex gap-8 bg-primary rounded-tl-4xl rounded-br-4xl p-10 flex-col">
            <div className="flex justify-between">
                <div className="flex gap-2 flex-col">
                    <h1 className="text-3xl font-erica">{menu?.titre}</h1>
                    <h1 className="">{menu?.description}</h1>
                </div>
                <Link href={`/order?menu_id=${menu?.menu_id}`}>
                    <Button>Commander</Button>
                </Link>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex gap-2 items-center">
                    <Snowflake className="size-4" />
                    <span className="uppercase text-xs">
                        Theme: <strong>{menu?.themeRel.libelle}</strong>
                    </span>
                </div>
                <div className="flex gap-2 items-center">
                    <Utensils className="size-4" />
                    <span className="uppercase text-xs">
                        Régime: <strong>{menu?.regimeRel.libelle}</strong>
                    </span>
                </div>
                <div className="flex gap-2 items-center">
                    <Users className="size-4" />
                    <span className="uppercase text-xs">
                        Nombre de personnes minimal:{" "}
                        <strong>{menu?.nombre_personne_minimum}</strong>
                    </span>
                </div>
                <div className="flex gap-2 items-center">
                    <DollarSign className="size-4" />
                    <span className="uppercase text-xs">
                        Prix par personne:{" "}
                        <strong>
                            {Intl.NumberFormat("fr-FR", {
                                currency: "EUR",
                                style: "currency",
                            }).format(menu?.prix_par_personne ?? 0)}
                        </strong>
                    </span>
                </div>
                <div className="flex gap-2 items-center">
                    <Box className="size-4" />
                    <span className="uppercase text-xs">
                        Stock disponible:{" "}
                        <strong>{menu?.quantite_restante}</strong>
                    </span>
                </div>
            </div>
        </section>
    );
}
