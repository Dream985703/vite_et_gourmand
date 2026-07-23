"use server";

import { prisma } from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { getEmployee } from "@/app/lib/employee";

export async function createMenu(formData: FormData) {
    const employee = await getEmployee();
    if (!employee) {
        return { error: "Accès refusé" };
    }

    const titre = String(formData.get("titre") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const themeId = Number(formData.get("theme_id"));
    const regimeId = Number(formData.get("regime_id"));
    const prix = Number(formData.get("prix_par_personne"));
    const minPersonnes = Number(formData.get("nombre_personne_minimum"));
    const stock = Number(formData.get("quantite_restante"));

    if (!titre || !description || !themeId || !regimeId) {
        return { error: "Veuillez remplir tous les champs" };
    }

    if (Number.isNaN(prix) || Number.isNaN(minPersonnes) || Number.isNaN(stock)) {
        return { error: "Valeurs numériques invalides" };
    }

    const regimeRow = await prisma.regime.findFirst({
        where: { regime_id: regimeId },
    });
    if (!regimeRow) {
        return { error: "Régime introuvable" };
    }

    await prisma.menu.create({
        data: {
            titre,
            description,
            regime: regimeRow.libelle,
            theme_id: themeId,
            regime_id: regimeId,
            prix_par_personne: prix,
            nombre_personne_minimum: minPersonnes,
            quantite_restante: stock,
        },
    });

    revalidatePath("/account");
    revalidatePath("/menus");
    return { error: null };
}

export async function updateMenu(menuId: number, formData: FormData) {
    const employee = await getEmployee();
    if (!employee) {
        return { error: "Accès refusé" };
    }

    const titre = String(formData.get("titre") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const themeId = Number(formData.get("theme_id"));
    const regimeId = Number(formData.get("regime_id"));
    const prix = Number(formData.get("prix_par_personne"));
    const minPersonnes = Number(formData.get("nombre_personne_minimum"));
    const stock = Number(formData.get("quantite_restante"));

    if (!titre || !description || !themeId || !regimeId) {
        return { error: "Veuillez remplir tous les champs" };
    }

    const regimeRow = await prisma.regime.findFirst({
        where: { regime_id: regimeId },
    });
    if (!regimeRow) {
        return { error: "Régime introuvable" };
    }

    await prisma.menu.update({
        where: { menu_id: menuId },
        data: {
            titre,
            description,
            regime: regimeRow.libelle,
            theme_id: themeId,
            regime_id: regimeId,
            prix_par_personne: prix,
            nombre_personne_minimum: minPersonnes,
            quantite_restante: stock,
        },
    });

    revalidatePath("/account");
    revalidatePath("/menus");
    return { error: null };
}

export async function deleteMenu(menuId: number) {
    const employee = await getEmployee();
    if (!employee) {
        return { error: "Accès refusé" };
    }

    try {
        await prisma.menu.delete({
            where: { menu_id: menuId },
        });
    } catch {
        return {
            error: "Impossible de supprimer ce menu (commandes liées)",
        };
    }

    revalidatePath("/account");
    revalidatePath("/menus");
    return { error: null };
}
