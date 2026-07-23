"use server";

import { prisma } from "@/prisma/client";
import { sendMail } from "@/app/lib/mail";

export async function sendContactMessage(formData: FormData) {
    const titre = String(formData.get("titre") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    if (!titre || !description || !email) {
        return { error: "Veuillez remplir tous les champs" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { error: "Adresse email invalide" };
    }

    const contactEmail =
        process.env.CONTACT_EMAIL || "contact@viteetgourmand.fr";

    await sendMail(
        contactEmail,
        "Contact site - " + titre,
        "Nouveau message depuis le formulaire de contact.\n\nDe : " +
        email +
        "\nTitre : " +
        titre +
        "\n\n" +
        description,
    );

    return { error: null, success: true };
}
