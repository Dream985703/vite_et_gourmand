"use server";

import { prisma } from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";

type UpdateProfileResult = {
    error?: string;
    success?: boolean;
};

export async function updateProfile(
    formData: FormData,
): Promise<UpdateProfileResult> {
    const session = await auth();
    if (!session?.user.id) {
        return { error: "Vous devez être connecté." };
    }

    const lastname = (formData.get("lastname") as string)?.trim() ?? "";
    const firstname = (formData.get("firstname") as string)?.trim() ?? "";
    const phone = (formData.get("phone") as string)?.trim() ?? "";
    const city = (formData.get("city") as string)?.trim() ?? "";
    const country = (formData.get("country") as string)?.trim() ?? "";
    const address = (formData.get("adress") as string)?.trim() ?? "";
    const email = (formData.get("email") as string)?.trim() ?? "";

    if (!email || !lastname || !firstname) {
        return { error: "Veuillez remplir tous les champs obligatoires." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { error: "Adresse email invalide." };
    }

    const userId = Number(session.user.id);

    const existingEmail = await prisma.utilisateur.findFirst({
        where: {
            email,
            NOT: { utilisateur_id: userId },
        },
    });

    if (existingEmail) {
        return { error: "Un compte existe déjà avec cet email." };
    }

    try {
        await prisma.utilisateur.update({
            where: { utilisateur_id: userId },
            data: {
                email,
                prenom: firstname,
                nom: lastname,
                telephone: phone,
                ville: city,
                pays: country,
                adresse_postale: address,
            },
        });

        revalidatePath("/account");

        return { success: true };
    } catch (err) {
        console.error(err);
        return { error: "Une erreur est survenue lors de la mise à jour." };
    }
}
