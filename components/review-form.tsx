"use client";

import { useState } from "react";
import { createAvis } from "@/app/actions/avis";
import { Button } from "./ui/button";

export function ReviewForm({ numeroCommande }: { numeroCommande: string }) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [pending, setPending] = useState(false);

    async function submit(formData: FormData) {
        setError("");
        setSuccess(false);
        setPending(true);
        formData.set("numero_commande", numeroCommande);
        const res = await createAvis(formData);
        if (res.error) {
            setError(res.error);
        } else {
            setSuccess(true);
            setOpen(false);
        }
        setPending(false);
    }

    if (success) {
        return (
            <p className="mt-3 text-sm text-green-700">
                Merci ! Votre avis est en attente de validation.
            </p>
        );
    }

    if (!open) {
        return (
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="mt-3 rounded-lg border border-primary-foreground/30 px-3 py-1.5 text-sm text-primary-foreground">
                Donner mon avis
            </button>
        );
    }

    return (
        <form
            action={submit}
            className="mt-4 flex flex-col gap-3 rounded-xl bg-primary p-4">
            <div className="flex flex-col gap-1">
                <p className="text-xs uppercase">Note (1 à 5)</p>
                <select
                    name="note"
                    required
                    className="h-9 rounded-lg bg-white px-3">
                    <option value="">Sélectionner...</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-xs uppercase">Commentaire</p>
                <textarea
                    name="description"
                    required
                    maxLength={255}
                    placeholder="Votre avis"
                    className="min-h-20 rounded-lg bg-white px-3 py-2 text-sm"
                />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-2">
                <Button type="submit" disabled={pending}>
                    Envoyer
                </Button>
                <button
                    type="button"
                    className="text-sm text-primary-foreground/60"
                    onClick={() => setOpen(false)}>
                    Fermer
                </button>
            </div>
        </form>
    );
}
