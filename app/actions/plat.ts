"use server";

import { prisma } from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { getEmployee } from "@/app/lib/employee";

export async function createPlat(formData: FormData) {
    const employee = await getEmployee();
    if (!employee) {
        return { error: "Accès refusé" };
    }

    const titre = String(formData.get("titre_plat") ?? "").trim();
    const menuId = Number(formData.get("menu_id"));
    const file = formData.get("photo");

    if (!titre) {
        return { error: "Le titre est obligatoire" };
    }

    let photo = new Uint8Array();
    if (file instanceof File && file.size > 0) {
        photo = new Uint8Array(await file.arrayBuffer());
    }

    await prisma.plat.create({
        data: {
            titre_plat: titre,
            photo,
            ...(menuId
                ? { menu: { connect: { menu_id: menuId } } }
                : {}),
        },
    });

    revalidatePath("/account");
    return { error: null };
}

export async function updatePlat(platId: number, formData: FormData) {
    const employee = await getEmployee();
    if (!employee) {
        return { error: "Accès refusé" };
    }

    const titre = String(formData.get("titre_plat") ?? "").trim();
    const menuId = Number(formData.get("menu_id"));
    const file = formData.get("photo");

    if (!titre) {
        return { error: "Le titre est obligatoire" };
    }

    if (file instanceof File && file.size > 0) {
        await prisma.plat.update({
            where: { plat_id: platId },
            data: {
                titre_plat: titre,
                photo: new Uint8Array(await file.arrayBuffer()),
                menu: menuId
                    ? { set: [{ menu_id: menuId }] }
                    : { set: [] },
            },
        });
    } else {
        await prisma.plat.update({
            where: { plat_id: platId },
            data: {
                titre_plat: titre,
                menu: menuId
                    ? { set: [{ menu_id: menuId }] }
                    : { set: [] },
            },
        });
    }

    revalidatePath("/account");
    return { error: null };
}

export async function deletePlat(platId: number) {
    const employee = await getEmployee();
    if (!employee) {
        return { error: "Accès refusé" };
    }

    await prisma.plat.delete({
        where: { plat_id: platId },
    });

    revalidatePath("/account");
    return { error: null };
}
