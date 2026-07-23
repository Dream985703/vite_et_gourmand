import { OrderForm } from "@/components/order-form";
import { prisma } from "@/prisma/client";
import { auth } from "@/app/auth";
import { redirect, notFound } from "next/navigation";

type Params = Promise<{ numero: string }>;

export default async function EditOrderPage({
    params,
}: {
    params: Params;
}) {
    const session = await auth();
    if (!session?.user.id) {
        redirect("/login");
    }

    const { numero } = await params;
    const numeroCommande = decodeURIComponent(numero);

    const order = await prisma.commande.findFirst({
        where: {
            numero_commande: numeroCommande,
            utilisateur_id: Number(session.user.id),
        },
    });

    if (!order) {
        notFound();
    }

    if (order.statut !== "En attente d'acceptation") {
        redirect("/account");
    }

    const menus = await prisma.menu.findMany();
    const user = await prisma.utilisateur.findFirst({
        where: {
            utilisateur_id: Number(session.user.id),
        },
    })


    const datePrestation = new Date(order.date_prestation)
        .toISOString()
        .split("T")
        .at(0);

    return (
        <OrderForm
            menus={menus}
            user={user}
            preselectedMenuId={String(order.menu_id)}
            mode="edit"
            orderNumber={order.numero_commande}
            initialValues={{
                menu_id: order.menu_id,
                nb_personnes: order.nombre_personne,
                date: datePrestation ?? "",
                hour: order.heure_livraison,
                pret_materiel: order.pret_materiel,
                client_firstname: order.client_prenom,
                client_lastname: order.client_nom,
                client_mail: order.client_email,
                client_phone: order.client_telephone,
                adress: order.adresse,
                city: order.ville,
            }}
        />
    );
}
