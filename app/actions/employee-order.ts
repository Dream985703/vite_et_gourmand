"use server";

import { prisma } from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { getEmployee } from "@/app/lib/employee";
import { sendMail } from "@/app/lib/mail";
import { STATUT_SUIVI_LABELS } from "@/app/lib/suivi";

export async function acceptOrder(numeroCommande: string) {
    const employee = await getEmployee();
    if (!employee) {
        return { error: "Accès refusé" };
    }

    const order = await prisma.commande.findFirst({
        where: { numero_commande: numeroCommande },
    });

    if (!order) {
        return { error: "Commande introuvable" };
    }

    if (order.statut !== "En attente d'acceptation") {
        return { error: "Cette commande n'est pas en attente" };
    }

    await prisma.commande.update({
        where: { numero_commande: numeroCommande },
        data: { statut: "Accepté" },
    });

    await prisma.suivi_statut.create({
        data: {
            numero_commande: numeroCommande,
            statut: "Accepte",
        },
    });

    revalidatePath("/account");
    return { error: null };
}

export async function advanceOrderStatus(numeroCommande: string) {
    const employee = await getEmployee();
    if (!employee) {
        return { error: "Accès refusé" };
    }

    const order = await prisma.commande.findFirst({
        where: { numero_commande: numeroCommande },
        include: {
            suivis: { orderBy: { date_heure: "desc" }, take: 1 },
        },
    });

    if (!order) {
        return { error: "Commande introuvable" };
    }

    if (
        order.statut === "En attente d'acceptation" ||
        order.statut === "Annulée" ||
        order.statut === "Terminée"
    ) {
        return { error: "Impossible d'avancer cette commande" };
    }

    const current = order.suivis[0] ? order.suivis[0].statut : null;
    let next = null as null | "Accepte" | "EnPreparation" | "EnCoursDeLivraison" | "Livre" | "EnAttenteDuRetourDeMateriel" | "Terminee";

    if (current === "Accepte") {
        next = "EnPreparation";
    } else if (current === "EnPreparation") {
        next = "EnCoursDeLivraison";
    } else if (current === "EnCoursDeLivraison") {
        next = "Livre";
    } else if (current === "Livre") {
        if (order.pret_materiel) {
            next = "EnAttenteDuRetourDeMateriel";
        } else {
            next = "Terminee";
        }
    } else if (current === "EnAttenteDuRetourDeMateriel") {
        next = "Terminee";
    }

    if (!next) {
        return { error: "Aucun statut suivant" };
    }

    await prisma.suivi_statut.create({
        data: {
            numero_commande: numeroCommande,
            statut: next,
        },
    });

    let restitution = order.restitution_materiel;
    if (next === "Terminee" && order.pret_materiel) {
        restitution = true;
    }

    await prisma.commande.update({
        where: { numero_commande: numeroCommande },
        data: {
            statut: STATUT_SUIVI_LABELS[next],
            restitution_materiel: restitution,
        },
    });

    if (next === "EnAttenteDuRetourDeMateriel") {
        await sendMail(
            order.client_email,
            "Retour de matériel - Vite & Gourmand",
            "Bonjour " +
            order.client_prenom +
            ",\n\nVotre commande " +
            order.numero_commande +
            " est livrée. Du matériel vous a été prêté.\n\nSi le matériel n'est pas restitué sous 10 jours ouvrés, des frais de 600 euros pourront vous être facturés (voir conditions générales de vente).\n\nPour restituer le matériel, merci de contacter la société.\n\nCordialement,\nVite & Gourmand",
        );
    }

    if (next === "Terminee") {
        const appUrl = process.env.APP_URL || "http://localhost:3000";
        await sendMail(
            order.client_email,
            "Donnez votre avis - Vite & Gourmand",
            "Bonjour " +
            order.client_prenom +
            ",\n\nVotre commande " +
            order.numero_commande +
            " est terminée.\n\nVous pouvez vous connecter à votre compte pour donner votre avis (note de 1 à 5 et un commentaire) :\n" +
            appUrl +
            "/account\n\nCordialement,\nVite & Gourmand",
        );
    }

    revalidatePath("/account");
    return { error: null };
}

export async function cancelOrderByEmployee(
    numeroCommande: string,
    modeContact: string,
    motif: string,
) {
    const employee = await getEmployee();
    if (!employee) {
        return { error: "Accès refusé" };
    }

    const contact = modeContact.trim();
    const reason = motif.trim();

    if (!contact || !reason) {
        return {
            error: "Indiquez le mode de contact et le motif d'annulation",
        };
    }

    if (contact !== "GSM" && contact !== "Mail") {
        return { error: "Mode de contact invalide" };
    }

    const order = await prisma.commande.findFirst({
        where: { numero_commande: numeroCommande },
    });

    if (!order) {
        return { error: "Commande introuvable" };
    }

    if (order.statut === "Annulée" || order.statut === "Terminée") {
        return { error: "Cette commande ne peut plus être annulée" };
    }

    await prisma.commande.update({
        where: { numero_commande: numeroCommande },
        data: {
            statut: "Annulée",
            motif_annulation: "Contact " + contact + " - " + reason,
        },
    });

    revalidatePath("/account");
    return { error: null };
}
