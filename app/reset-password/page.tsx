"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/app/actions/password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Suspense } from "react";

function ResetForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token") || "";
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    async function submit(formData: FormData) {
        setError("");
        setPending(true);
        formData.set("token", token);
        const res = await resetPassword(formData);
        if (res.error) {
            setError(res.error);
            setPending(false);
            return;
        }
        router.push("/login");
    }

    if (!token) {
        return <p className="text-red-500">Lien invalide.</p>;
    }

    return (
        <>
            {error && <p className="text-red-500">{error}</p>}
            <form action={submit} className="flex w-full flex-col gap-4">
                <Input
                    label="nouveau mot de passe"
                    placeholder="Mot de passe"
                    type="password"
                    name="password"
                    required
                    className="w-full"
                />
                <Input
                    label="confirmer"
                    placeholder="Confirmer"
                    type="password"
                    name="confirm-password"
                    required
                    className="w-full"
                />
                <Button className="w-full" type="submit" disabled={pending}>
                    Réinitialiser
                </Button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <main className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 rounded-3xl bg-primary p-10">
            <p className="text-xl font-bold">Nouveau mot de passe</p>
            <Suspense fallback={<p>Chargement...</p>}>
                <ResetForm />
            </Suspense>
            <Link href="/login" className="text-sm underline">
                Retour à la connexion
            </Link>
        </main>
    );
}
