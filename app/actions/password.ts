"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma/client";
import { sendMail } from "@/app/lib/mail";
import { validatePassword } from "@/app/lib/utils";

export async function requestPasswordReset(formData: FormData) {
    const email = String(formData.get("email") ?? "")
        .trim()
        .toLowerCase();

    if (!email) {
        return { error: "Indiquez votre email" };
    }

    const user = await prisma.utilisateur.findFirst({
        where: { email },
    });

    if (!user) {
        return {
            error: null,
            success: true,
        };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await prisma.utilisateur.update({
        where: { utilisateur_id: user.utilisateur_id },
        data: {
            reset_token: token,
            reset_expires: expires,
        },
    });

    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const link = appUrl + "/reset-password?token=" + token;

    await sendMail(
        email,
        "Réinitialisation du mot de passe - Vite & Gourmand",
        "Bonjour " +
        user.prenom +
        ",\n\nVous avez demandé à réinitialiser votre mot de passe.\nCliquez sur ce lien pour en choisir un nouveau (valable 1 heure) :\n" +
        link +
        "\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez ce mail.\n\nCordialement,\nVite & Gourmand",
    );

    return { error: null, success: true };
}

export async function resetPassword(formData: FormData) {
    const token = String(formData.get("token") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirm-password") ?? "");

    if (!token) {
        return { error: "Lien invalide" };
    }

    if (!password || !confirm) {
        return { error: "Remplissez tous les champs" };
    }

    if (password !== confirm) {
        return { error: "Les mots de passe ne correspondent pas" };
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
        return { error: passwordError };
    }

    const user = await prisma.utilisateur.findFirst({
        where: { reset_token: token },
    });

    if (!user || !user.reset_expires) {
        return { error: "Lien invalide ou expiré" };
    }

    if (user.reset_expires.getTime() < Date.now()) {
        return { error: "Lien expiré, recommencez la demande" };
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.utilisateur.update({
        where: { utilisateur_id: user.utilisateur_id },
        data: {
            password: hashed,
            reset_token: null,
            reset_expires: null,
        },
    });

    return { error: null, success: true };
}
