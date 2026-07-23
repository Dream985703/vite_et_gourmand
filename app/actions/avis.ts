"use server";

import { prisma } from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { getEmployee } from "@/app/lib/employee";
import { auth } from "@/app/auth";

export async function createAvis(formData: FormData) {
    const session = await auth();
    if (!session?.user.id) {
        return { error: "Vous devez être connecté" };
    }

    const note = String(formData.get("note") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const numeroCommande = String(formData.get("numero_commande") ?? "").trim();

    if (!note || !description || !numeroCommande) {
        return { error: "Veuillez remplir tous les champs" };
    }

    const noteNumber = Number(note);
    if (noteNumber < 1 || noteNumber > 5) {
        return { error: "La note doit être entre 1 et 5" };
    }

    if (description.length > 255) {
        return { error: "Le commentaire est trop long" };
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

    if (order.statut !== "Terminée") {
        return {
            error: "Vous ne pouvez donner un avis que sur une commande terminée",
        };
    }

    await prisma.avis.create({
        data: {
            note: String(noteNumber),
            description: description,
            statut: "En attente",
            utilisateur_id: Number(session.user.id),
        },
    });

    revalidatePath("/account");
    return { error: null, success: true };
}

export async function validateAvis(avisId: number) {
    const employee = await getEmployee();
    if (!employee) {
        return { error: "Accès refusé" };
    }

    await prisma.avis.update({
        where: { avis_id: avisId },
        data: { statut: "Validé" },
    });

    revalidatePath("/account");
    revalidatePath("/");
    return { error: null };
}

export async function refuseAvis(avisId: number) {
    const employee = await getEmployee();
    if (!employee) {
        return { error: "Accès refusé" };
    }

    await prisma.avis.update({
        where: { avis_id: avisId },
        data: { statut: "Refusé" },
    });

    revalidatePath("/account");
    revalidatePath("/");
    return { error: null };
}
