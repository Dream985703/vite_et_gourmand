import { MenuSection } from "@/components/menu-section";
import { prisma } from "@/prisma/client";

export default async function Menus() {
    const menus = await prisma.menu.findMany({
        include: {
            plat: {
                select: {
                    plat_id: true,
                    photo: true,
                },
            },
        },
    });
    const themes = await prisma.theme.findMany();
    const regimes = await prisma.regime.findMany();

    const menusAvecPlats = [];
    for (let i = 0; i < menus.length; i++) {
        const plats = [];
        for (let j = 0; j < menus[i].plat.length; j++) {
            if (menus[i].plat[j].photo.length > 0) {
                plats.push({
                    plat_id: menus[i].plat[j].plat_id,
                });
            }
        }
        menusAvecPlats.push({
            menu_id: menus[i].menu_id,
            titre: menus[i].titre,
            description: menus[i].description,
            nombre_personne_minimum: menus[i].nombre_personne_minimum,
            prix_par_personne: menus[i].prix_par_personne,
            theme_id: menus[i].theme_id,
            regime_id: menus[i].regime_id,
            plats: plats,
        });
    }

    return (
        <main>
            <MenuSection
                menus={menusAvecPlats}
                themes={themes}
                regimes={regimes}
            />
        </main>
    );
}
