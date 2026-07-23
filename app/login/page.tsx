"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const [error, setError] = useState("");
    const router = useRouter();

    async function submit(formData: FormData) {
        const result = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });

        if (result.error) {
            setError("Email ou mot de passe incorrect.");
            return;
        }

        router.push("/");
        router.refresh();
    }

    return (
        <main className="flex flex-col gap-6 bg-primary p-10 max-w-lg w-full rounded-3xl mx-auto items-center">
            <p className="text-xl font-bold">Connexion</p>
            <p className="text-red-500">{error}</p>
            <form action={submit} className="flex flex-col gap-4 w-full">
                <Input
                    label="email"
                    placeholder="ryan@mail.fr"
                    type="email"
                    className="w-full"
                    name="email"
                />
                <Input
                    name="password"
                    label="mot de passe"
                    placeholder="123456789"
                    type="password"
                    className="w-full"
                />
                <Button className="w-full" type="submit">
                    Se connecter
                </Button>
            </form>
            <Link
                href="/forgot-password"
                className="text-sm text-primary-foreground underline">
                Mot de passe oublié ?
            </Link>
            <p className="text-primary-foreground">
                Vous n'avez pas de compte ?{" "}
                <Link href="/join-us">
                    <span className="underline cursor-pointer">
                        Rejoignez-nous ici !
                    </span>
                </Link>
            </p>
        </main>
    );
}
