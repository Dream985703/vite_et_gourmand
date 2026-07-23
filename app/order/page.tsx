import { OrderForm } from "@/components/order-form";

import { prisma } from "@/prisma/client";
import { auth } from "../auth";
import { utilisateur } from "@/app/generated/prisma/browser";

type SearchParams = Promise<{ menu_id: string | null }>;

export default async function OrderPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const menuId = (await searchParams).menu_id ?? null;
    const menus = await prisma.menu.findMany();

    const session = await auth();

    let user: utilisateur | null = null;

    if (session?.user.id) {
        user = await prisma.utilisateur.findFirst({
            where: {
                utilisateur_id: Number(session.user.id),
            },
        });
    }

    return <OrderForm menus={menus} preselectedMenuId={menuId} user={user} />;
}
