import { MenuSection } from "@/components/menu-section";
import { prisma } from "@/prisma/client";

export default async function Menus() {
    const menus = await prisma.menu.findMany();
    const themes = await prisma.theme.findMany();
    const regimes = await prisma.regime.findMany();

    return (
        <main className="">
            <MenuSection menus={menus} themes={themes} regimes={regimes} />
        </main>
    );
}
