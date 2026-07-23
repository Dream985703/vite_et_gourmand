"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/prisma/client";
import { getAdmin } from "@/app/lib/admin";
import { sendMail } from "@/app/lib/mail";
import { validatePassword } from "@/app/lib/utils";

export async function createEmployee(formData: FormData) {
    const admin = await getAdmin();
    if (!admin) {
        return { error: "Accès refusé" };
    }

    const email = String(formData.get("email") ?? "")
        .trim()
        .toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
        return { error: "Email et mot de passe obligatoires" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { error: "Adresse email invalide" };
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
        return { error: passwordError };
    }

    const existing = await prisma.utilisateur.findFirst({
        where: { email },
    });
    if (existing) {
        return { error: "Un compte existe déjà avec cet email" };
    }

    const employeeRole = await prisma.role.findFirst({
        where: { libelle: "Employé" },
    });
    if (!employeeRole) {
        return { error: "Rôle employé introuvable" };
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.utilisateur.create({
        data: {
            email,
            password: hashed,
            prenom: "Employé",
            nom: "-",
            telephone: "-",
            ville: "-",
            pays: "France",
            adresse_postale: "-",
            actif: true,
            role_id: employeeRole.role_id,
        },
    });

    await sendMail(
        email,
        "Votre compte employé - Vite & Gourmand",
        `Bonjour,\n\nUn compte employé a été créé pour vous sur Vite & Gourmand.\nIdentifiant : ${email}\n\nLe mot de passe ne figure pas dans ce message. Rapprochez-vous de l'administrateur pour l'obtenir.\n\nCordialement,\nVite & Gourmand`,
    );

    revalidatePath("/account");
    return { error: null };
}

export async function setEmployeeActive(userId: number, actif: boolean) {
    const admin = await getAdmin();
    if (!admin) {
        return { error: "Accès refusé" };
    }

    const employee = await prisma.utilisateur.findFirst({
        where: { utilisateur_id: userId },
        include: { role: true },
    });

    if (!employee || employee.role.libelle !== "Employé") {
        return { error: "Employé introuvable" };
    }

    await prisma.utilisateur.update({
        where: { utilisateur_id: userId },
        data: { actif },
    });

    revalidatePath("/account");
    return { error: null };
}
