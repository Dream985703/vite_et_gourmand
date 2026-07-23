import { MenuSection } from "@/components/menu-section";
import { prisma } from "@/prisma/client";

export default async function Home() {
    const menus = await prisma.menu.findMany();
    const themes = await prisma.theme.findMany();
    return <main className=""></main>;
}
