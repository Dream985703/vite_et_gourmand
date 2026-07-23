"use server";

import type { OrderForm } from "@/components/order-form";
import { prisma } from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";

export async function confirmOrder(
    form: OrderForm,
    totalCommande: number,
    totalLivraison: number,
): Promise<{ error: string | null }> {

    const session = await auth();
    if (!session?.user.id) {
        return { error: "Vous devez être connecté" };
    }

    if (!form.menu_id) {
        return { error: "Vous devez sélectionner un menu" };
    }

    const totalCommandes = await prisma.commande.count();

    await prisma.commande.create({
        data: {
            date_commande: new Date().toISOString(),
            date_prestation: new Date(form.date).toISOString(),
            heure_livraison: form.hour,
            nombre_personne: form.nb_personnes,
            prix_menu: totalCommande,
            prix_livraison: totalLivraison,
            statut: "En attente d'acceptation",
            menu_id: form.menu_id,
            utilisateur_id: Number(session.user.id),
            numero_commande: String(
                `#${session.user.name?.toUpperCase().replaceAll(" ", "")}${totalCommandes + 1}`,
            ),
            pret_materiel: form.pret_materiel,
            restitution_materiel: false,
            client_prenom: form.client_firstname,
            client_nom: form.client_lastname,
            client_email: form.client_mail,
            client_telephone: form.client_phone,
            adresse: form.adress,
            ville: form.city,
        },
    });

    return {
        error: null,
    };
}

export async function updateOrder(
    numeroCommande: string,
    form: OrderForm,
    totalCommande: number,
    totalLivraison: number,
): Promise<{ error: string | null }> {
    const session = await auth();
    if (!session?.user.id) {
        return { error: "Vous devez être connecté" };
    }

    const order = await prisma.commande.findFirst({
        where: {
            numero_commande: numeroCommande,
            utilisateur_id: Number(session.user.id),
        },
    });

    if (!order) {
        return { error: "Commande introuvable" };
    }

    if (order.statut !== "En attente d'acceptation") {
        return {
            error: "Cette commande ne peut plus être modifiée",
        };
    }

    await prisma.commande.update({
        where: { numero_commande: numeroCommande },
        data: {
            date_prestation: new Date(form.date).toISOString(),
            heure_livraison: form.hour,
            nombre_personne: form.nb_personnes,
            prix_menu: totalCommande,
            prix_livraison: totalLivraison,
            pret_materiel: form.pret_materiel,
            client_prenom: form.client_firstname,
            client_nom: form.client_lastname,
            client_email: form.client_mail,
            client_telephone: form.client_phone,
            adresse: form.adress,
            ville: form.city,
        },
    });

    revalidatePath("/account");

    return { error: null };
}

export async function cancelOrder(
    numeroCommande: string,
): Promise<{ error: string | null }> {
    const session = await auth();
    if (!session?.user.id) {
        return { error: "Vous devez être connecté" };
    }

    const order = await prisma.commande.findFirst({
        where: {
            numero_commande: numeroCommande,
            utilisateur_id: Number(session.user.id),
        },
    });

    if (!order) {
        return { error: "Commande introuvable" };
    }

    if (order.statut !== "En attente d'acceptation") {
        return { error: "Cette commande n'est pas en attente d'acceptation, vous ne pouvez pas l'annuler" };
    }

    await prisma.commande.update({
        where: { numero_commande: numeroCommande },
        data: { statut: "Annulée" },
    });

    revalidatePath("/account");

    return { error: null };
}
