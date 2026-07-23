"use server";

import { prisma } from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { getEmployee } from "@/app/lib/employee";

export async function createHoraire(formData: FormData) {
    const employee = await getEmployee();
    if (!employee) {
        return { error: "Accès refusé" };
    }

    const jour = String(formData.get("jour") ?? "").trim();
    const ouverture = String(formData.get("heure_ouverture") ?? "").trim();
    const fermeture = String(formData.get("heure_fermeture") ?? "").trim();

    if (!jour || !ouverture || !fermeture) {
        return { error: "Veuillez remplir tous les champs" };
    }

    await prisma.horaire.create({
        data: {
            jour,
            heure_ouverture: ouverture,
            heure_fermeture: fermeture,
        },
    });

    revalidatePath("/account");
    return { error: null };
}

export async function updateHoraire(horaireId: number, formData: FormData) {
    const employee = await getEmployee();
    if (!employee) {
        return { error: "Accès refusé" };
    }

    const jour = String(formData.get("jour") ?? "").trim();
    const ouverture = String(formData.get("heure_ouverture") ?? "").trim();
    const fermeture = String(formData.get("heure_fermeture") ?? "").trim();

    if (!jour || !ouverture || !fermeture) {
        return { error: "Veuillez remplir tous les champs" };
    }

    await prisma.horaire.update({
        where: { horaire_id: horaireId },
        data: {
            jour,
            heure_ouverture: ouverture,
            heure_fermeture: fermeture,
        },
    });

    revalidatePath("/account");
    return { error: null };
}

export async function deleteHoraire(horaireId: number) {
    const employee = await getEmployee();
    if (!employee) {
        return { error: "Accès refusé" };
    }

    await prisma.horaire.delete({
        where: { horaire_id: horaireId },
    });

    revalidatePath("/account");
    return { error: null };
}
