"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerUser } from "@/app/actions/register";

export default function RegisterPage() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function submit(formData: FormData) {
        setError("");
        setLoading(true);

        const result = await registerUser(formData);

        if (result.error) {
            setError(result.error);
            setLoading(false);
            return;
        }

        const signInResult = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });

        setLoading(false);

        if (signInResult?.error) {
            router.push("/login");
            return;
        }

        router.push("/");
    }

    return (
        <main className="flex flex-col gap-6 bg-primary p-10 max-w-lg w-full rounded-3xl mx-auto items-center">
            <p className="text-xl font-bold">Inscription</p>
            {error && <p className="text-red-500">{error}</p>}
            <form action={submit} className="flex flex-col gap-4 w-full">
                <Input
                    label="Nom"
                    placeholder="Perque"
                    type="text"
                    className="w-full"
                    name="lastname"
                    required
                    autoComplete="family-name"
                />
                <Input
                    label="Prénom"
                    placeholder="Ryan"
                    type="text"
                    className="w-full"
                    name="firstname"
                    required
                    autoComplete="given-name"
                />
                <Input
                    label="Numéro de GSM"
                    placeholder="0612345678"
                    type="tel"
                    className="w-full"
                    name="phone"
                    autoComplete="tel"
                />
                <Input
                    label="Ville"
                    placeholder="Paris"
                    type="text"
                    className="w-full"
                    name="city"
                    autoComplete="city"
                />
                <Input
                    label="Pays"
                    placeholder="France"
                    type="text"
                    className="w-full"
                    name="country"
                    autoComplete="country"
                />
                <Input
                    label="Adresse"
                    placeholder="1 Rue de la Paix"
                    type="text"
                    className="w-full"
                    name="adress"
                    autoComplete="street-address"
                />
                <Input
                    label="Email"
                    placeholder="ryan@mail.fr"
                    type="email"
                    className="w-full"
                    name="email"
                    autoComplete="email"
                    required
                />
                <Input
                    name="password"
                    label="Mot de passe"
                    placeholder="123456789"
                    type="password"
                    className="w-full"
                    required
                    autoComplete="new-password"
                />
                <Input
                    name="confirm-password"
                    label="Confirmer le mot de passe"
                    placeholder="123456789"
                    type="password"
                    className="w-full"
                    required
                    autoComplete="new-password"
                />
                <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? "Inscription en cours..." : "S'inscrire"}
                </Button>
            </form>
        </main>
    );
}
