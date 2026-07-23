"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/app/actions/password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [pending, setPending] = useState(false);

    async function submit(formData: FormData) {
        setError("");
        setSuccess(false);
        setPending(true);
        const res = await requestPasswordReset(formData);
        if (res.error) {
            setError(res.error);
        } else {
            setSuccess(true);
        }
        setPending(false);
    }

    return (
        <main className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 rounded-3xl bg-primary p-10">
            <p className="text-xl font-bold">Mot de passe oublié</p>
            <p className="text-center text-sm text-primary-foreground/70">
                Indiquez votre email. Si un compte existe, vous recevrez un lien
                pour réinitialiser votre mot de passe.
            </p>
            {error && <p className="text-red-500">{error}</p>}
            {success && (
                <p className="text-green-700">
                    Si un compte existe, un email a été envoyé.
                </p>
            )}
            <form action={submit} className="flex w-full flex-col gap-4">
                <Input
                    label="email"
                    placeholder="ryan@mail.fr"
                    type="email"
                    name="email"
                    required
                    className="w-full"
                />
                <Button className="w-full" type="submit" disabled={pending}>
                    Envoyer le lien
                </Button>
            </form>
            <Link href="/login" className="text-sm underline">
                Retour à la connexion
            </Link>
        </main>
    );
}
