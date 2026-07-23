"use client";

import { useState } from "react";
import { utilisateur } from "@/app/generated/prisma/browser";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { updateProfile } from "@/app/actions/profile";

export function ProfileForm({ user }: { user: utilisateur }) {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [pending, setPending] = useState(false);

    async function submit(formData: FormData) {
        setError("");
        setPending(true);
        setSuccess(false);

        const result = await updateProfile(formData);
        if (result.error) {
            setError(result.error);
            setPending(false);
            return;
        }
        setSuccess(true);
        setPending(false);
    }

    return (
        <form action={submit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                    label="Prénom"
                    placeholder="Ryan"
                    type="text"
                    name="firstname"
                    required
                    autoComplete="given-name"
                    defaultValue={user.prenom}
                    className="w-full"
                />
                <Input
                    label="Nom"
                    placeholder="Perque"
                    type="text"
                    name="lastname"
                    required
                    autoComplete="family-name"
                    defaultValue={user.nom}
                    className="w-full"
                />
                <Input
                    label="Email"
                    placeholder="ryan@mail.fr"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    defaultValue={user.email}
                    className="w-full"
                />
                <Input
                    label="Téléphone"
                    placeholder="0612345678"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    defaultValue={user.telephone}
                    className="w-full"
                />
                <Input
                    label="Adresse"
                    placeholder="1 Rue de la Paix"
                    type="text"
                    name="adress"
                    autoComplete="street-address"
                    defaultValue={user.adresse_postale}
                    className="w-full sm:col-span-2"
                />
                <Input
                    label="Ville"
                    placeholder="Bordeaux"
                    type="text"
                    name="city"
                    autoComplete="address-level2"
                    defaultValue={user.ville}
                    className="w-full"
                />
                <Input
                    label="Pays"
                    placeholder="France"
                    type="text"
                    name="country"
                    autoComplete="country-name"
                    defaultValue={user.pays}
                    className="w-full"
                />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && (
                <p className="text-sm text-green-700">
                    Informations mises à jour.
                </p>
            )}

            <Button type="submit" disabled={pending} className="w-fit">
                {pending ? "Enregistrement…" : "Enregistrer"}
            </Button>
        </form>
    );
}
