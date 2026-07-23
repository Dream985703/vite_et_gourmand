import { Button } from "@/components/ui/button";
import { MenuCarousel } from "@/components/menu-carousel";
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
            plat: {
                select: {
                    plat_id: true,
                    titre_plat: true,
                    photo: true,
                },
            },
        },
    });

    if (!menu) {
        return (
            <section className="p-10">
                <p>Menu introuvable.</p>
            </section>
        );
    }

    const photos = [];
    for (let i = 0; i < menu.plat.length; i++) {
        if (menu.plat[i].photo.length > 0) {
            photos.push({
                plat_id: menu.plat[i].plat_id,
                titre_plat: menu.plat[i].titre_plat,
            });
        }
    }

    return (
        <section className="flex flex-col gap-8 rounded-tl-4xl rounded-br-4xl bg-primary p-10">
            <MenuCarousel photos={photos} />

            <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="font-erica text-3xl">{menu.titre}</h1>
                    <p>{menu.description}</p>
                </div>
                <Link href={"/order?menu_id=" + menu.menu_id}>
                    <Button>Commander</Button>
                </Link>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <Snowflake className="size-4" />
                    <span className="text-xs uppercase">
                        Theme: <strong>{menu.themeRel.libelle}</strong>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Utensils className="size-4" />
                    <span className="text-xs uppercase">
                        Régime: <strong>{menu.regimeRel.libelle}</strong>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="size-4" />
                    <span className="text-xs uppercase">
                        Nombre de personnes minimal:{" "}
                        <strong>{menu.nombre_personne_minimum}</strong>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <DollarSign className="size-4" />
                    <span className="text-xs uppercase">
                        Prix par personne:{" "}
                        <strong>
                            {Intl.NumberFormat("fr-FR", {
                                currency: "EUR",
                                style: "currency",
                            }).format(menu.prix_par_personne)}
                        </strong>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Box className="size-4" />
                    <span className="text-xs uppercase">
                        Stock disponible:{" "}
                        <strong>{menu.quantite_restante}</strong>
                    </span>
                </div>
            </div>
        </section>
    );
}
