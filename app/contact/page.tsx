"use client";

import { useState } from "react";
import { sendContactMessage } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [pending, setPending] = useState(false);

    async function submit(formData: FormData) {
        setError("");
        setSuccess(false);
        setPending(true);
        const res = await sendContactMessage(formData);
        if (res.error) {
            setError(res.error);
        } else {
            setSuccess(true);
        }
        setPending(false);
    }

    return (
        <main className="mx-auto flex w-full max-w-lg flex-col gap-6 rounded-3xl bg-primary p-10">
            <h1 className="text-center text-xl font-bold">Contact</h1>
            <p className="text-center text-sm text-primary-foreground/70">
                Envoyez-nous un message, nous vous répondrons par email.
            </p>
            {error && <p className="text-red-500">{error}</p>}
            {success && (
                <p className="text-green-700">
                    Message envoyé. Nous vous répondrons bientôt.
                </p>
            )}
            <form action={submit} className="flex flex-col gap-4">
                <Input
                    label="Titre"
                    name="titre"
                    type="text"
                    placeholder="Sujet"
                    required
                    className="w-full"
                />
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="vous@mail.fr"
                    required
                    className="w-full"
                />
                <div className="flex flex-col gap-1">
                    <p className="text-xs uppercase">Description</p>
                    <textarea
                        name="description"
                        required
                        placeholder="Votre message"
                        className="min-h-28 rounded-lg bg-white px-3 py-2 text-sm"
                    />
                </div>
                <Button type="submit" disabled={pending}>
                    Envoyer
                </Button>
            </form>
        </main>
    );
}
