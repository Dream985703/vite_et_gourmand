"use client";

import { useState } from "react";
import { createEmployee, setEmployeeActive } from "@/app/actions/admin";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function AdminEmployees({
    employees,
}: {
    employees: {
        utilisateur_id: number;
        email: string;
        prenom: string;
        nom: string;
        actif: boolean;
    }[];
}) {
    const [showCreate, setShowCreate] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [pending, setPending] = useState(false);

    async function submit(formData: FormData) {
        setError("");
        setSuccess("");
        setPending(true);
        const res = await createEmployee(formData);
        if (res.error) {
            setError(res.error);
        } else {
            setSuccess("Compte employé créé. Un mail a été envoyé.");
            setShowCreate(false);
        }
        setPending(false);
    }

    async function toggle(id: number, actif: boolean) {
        setError("");
        setPending(true);
        const res = await setEmployeeActive(id, actif);
        if (res.error) {
            setError(res.error);
        }
        setPending(false);
    }

    return (
        <section>
            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-primary-foreground">
                    Employés
                </h2>
                <Button
                    type="button"
                    onClick={() => setShowCreate(!showCreate)}>
                    {showCreate ? "Fermer" : "Créer un employé"}
                </Button>
            </div>

            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
            {success && (
                <p className="mb-4 text-sm text-green-700">{success}</p>
            )}

            {showCreate && (
                <form
                    action={submit}
                    className="mb-6 flex flex-col gap-3 rounded-xl bg-primary p-4 sm:max-w-md">
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="employe@mail.fr"
                        required
                        className="w-full"
                    />
                    <Input
                        label="Mot de passe"
                        name="password"
                        type="password"
                        placeholder="Mot de passe"
                        required
                        className="w-full"
                    />
                    <p className="text-xs text-primary-foreground/60">
                        Le mot de passe ne sera pas envoyé par mail. Communiquez-le
                        à l&apos;employé vous-même.
                    </p>
                    <Button type="submit" disabled={pending}>
                        Créer
                    </Button>
                </form>
            )}

            {employees.length === 0 ? (
                <p className="text-primary-foreground/60">
                    Aucun employé pour le moment.
                </p>
            ) : (
                <ul className="flex flex-col gap-4">
                    {employees.map((e) => (
                        <li
                            key={e.utilisateur_id}
                            className="flex flex-wrap items-center justify-between gap-3 border-b border-primary-foreground/10 pb-4 last:border-0">
                            <div>
                                <p className="font-semibold text-primary-foreground">
                                    {e.email}
                                </p>
                                <p className="text-sm text-primary-foreground/60">
                                    {e.actif ? "Actif" : "Désactivé"}
                                </p>
                            </div>
                            {e.actif ? (
                                <button
                                    type="button"
                                    disabled={pending}
                                    onClick={() =>
                                        toggle(e.utilisateur_id, false)
                                    }
                                    className="rounded-lg border border-red-700/40 px-3 py-1.5 text-sm text-red-700">
                                    Désactiver
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    disabled={pending}
                                    onClick={() =>
                                        toggle(e.utilisateur_id, true)
                                    }
                                    className="rounded-lg border border-primary-foreground/30 px-3 py-1.5 text-sm">
                                    Réactiver
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
