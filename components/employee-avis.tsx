"use client";

import { useState } from "react";
import { validateAvis, refuseAvis } from "@/app/actions/avis";
import { Button } from "./ui/button";

export function EmployeeAvis({
    avisList,
}: {
    avisList: {
        avis_id: number;
        note: string;
        description: string;
        statut: string;
        utilisateur: { prenom: string; nom: string };
    }[];
}) {
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    async function valider(id: number) {
        setError("");
        setPending(true);
        const res = await validateAvis(id);
        if (res.error) setError(res.error);
        setPending(false);
    }

    async function refuser(id: number) {
        setError("");
        setPending(true);
        const res = await refuseAvis(id);
        if (res.error) setError(res.error);
        setPending(false);
    }

    return (
        <section>
            <h2 className="mb-4 text-lg font-semibold text-primary-foreground">
                Avis
            </h2>

            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

            {avisList.length === 0 ? (
                <p className="text-primary-foreground/60">Aucun avis.</p>
            ) : (
                <ul className="flex flex-col gap-4">
                    {avisList.map((a) => (
                        <li
                            key={a.avis_id}
                            className="border-b border-primary-foreground/10 pb-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-primary-foreground">
                                        {a.utilisateur.prenom}{" "}
                                        {a.utilisateur.nom} · note {a.note}
                                    </p>
                                    <p className="mt-1 text-sm text-primary-foreground/70">
                                        {a.description}
                                    </p>
                                    <p className="mt-1 text-sm text-indigo-600">
                                        {a.statut}
                                    </p>
                                </div>
                                {a.statut === "En attente" && (
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            disabled={pending}
                                            onClick={() => valider(a.avis_id)}>
                                            Valider
                                        </Button>
                                        <button
                                            type="button"
                                            disabled={pending}
                                            className="rounded-lg border border-red-700/40 px-3 py-1.5 text-sm text-red-700"
                                            onClick={() =>
                                                refuser(a.avis_id)
                                            }>
                                            Refuser
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
