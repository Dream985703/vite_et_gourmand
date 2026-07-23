"use server";

import { prisma } from "@/prisma/client";
import bcrypt from "bcryptjs";
import { validatePassword } from "../lib/utils";
import { sendMail } from "@/app/lib/mail";

type RegisterResult = {
    error?: string;
    success?: boolean;
};

export async function registerUser(
    formData: FormData,
): Promise<RegisterResult> {
    const lastname = formData.get("lastname") as string;
    const firstname = formData.get("firstname") as string;
    const phone = formData.get("phone") as string;
    const city = formData.get("city") as string;
    const country = formData.get("country") as string;
    const address = formData.get("adress") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (!email || !password || !confirmPassword || !lastname || !firstname) {
        return { error: "Veuillez remplir tous les champs obligatoires." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { error: "Adresse email invalide." };
    }

    if (password !== confirmPassword) {
        return { error: "Les mots de passe ne correspondent pas." };
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
        return { error: passwordError };
    }

    const existingUser = await prisma.utilisateur.findFirst({
        where: { email },
    });

    if (existingUser) {
        return { error: "Un compte existe déjà avec cet email." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = await prisma.role.findFirst({
        where: {
            libelle: "Utilisateur",
        },
    });

    if (!userRole) {
        return { error: "Le rôle utilisateur n'existe pas." };
    }

    try {
        await prisma.utilisateur.create({
            data: {
                email,
                password: hashedPassword,
                adresse_postale: address,
                pays: country,
                prenom: firstname,
                telephone: phone,
                ville: city,
                nom: lastname,
                role: {
                    connect: {
                        role_id: userRole.role_id,
                    },
                },
            },
        });

        try {
            await sendMail(
                email,
                "Bienvenue sur Vite & Gourmand",
                "Bonjour " +
                    firstname +
                    ",\n\nBienvenue sur Vite & Gourmand ! Votre compte a bien été créé.\nVous pouvez dès maintenant commander nos menus.\n\nCordialement,\nL'équipe Vite & Gourmand",
            );
        } catch (mailError) {
            console.error(mailError);
        }

        return { success: true };
    } catch (err) {
        console.error(err);
        return { error: "Une erreur est survenue lors de l'inscription." };
    }
}
