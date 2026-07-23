"use client";

import { useState } from "react";
import {
    createHoraire,
    updateHoraire,
    deleteHoraire,
} from "@/app/actions/horaire";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const JOURS = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
];

export function EmployeeHoraires({ horaires }: { horaires: any[] }) {
    const [editId, setEditId] = useState<number | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    async function submitCreate(formData: FormData) {
        setError("");
        setPending(true);
        const res = await createHoraire(formData);
        if (res.error) {
            setError(res.error);
        } else {
            setShowCreate(false);
        }
        setPending(false);
    }

    async function submitUpdate(id: number, formData: FormData) {
        setError("");
        setPending(true);
        const res = await updateHoraire(id, formData);
        if (res.error) {
            setError(res.error);
        } else {
            setEditId(null);
        }
        setPending(false);
    }

    async function remove(id: number) {
        if (!window.confirm("Supprimer cet horaire ?")) return;
        setError("");
        setPending(true);
        const res = await deleteHoraire(id);
        if (res.error) {
            setError(res.error);
        }
        setPending(false);
    }

    return (
        <section>
            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-primary-foreground">
                    Horaires
                </h2>
                <Button
                    type="button"
                    onClick={() => {
                        setShowCreate(!showCreate);
                        setEditId(null);
                    }}>
                    {showCreate ? "Fermer" : "Ajouter"}
                </Button>
            </div>

            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

            {showCreate && (
                <form
                    action={submitCreate}
                    className="mb-6 grid grid-cols-1 gap-3 rounded-xl bg-primary p-4 sm:grid-cols-3">
                    <div className="flex flex-col gap-1">
                        <p className="text-xs uppercase">Jour</p>
                        <select
                            name="jour"
                            required
                            className="h-9 rounded-lg bg-white px-3">
                            <option value="">Sélectionner...</option>
                            {JOURS.map((j) => (
                                <option key={j} value={j}>
                                    {j}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Input
                        label="Ouverture"
                        name="heure_ouverture"
                        type="time"
                        placeholder="09:00"
                        required
                        className="w-full"
                    />
                    <Input
                        label="Fermeture"
                        name="heure_fermeture"
                        type="time"
                        placeholder="18:00"
                        required
                        className="w-full"
                    />
                    <div className="sm:col-span-3">
                        <Button type="submit" disabled={pending}>
                            Créer
                        </Button>
                    </div>
                </form>
            )}

            <ul className="flex flex-col gap-4">
                {horaires.map((h) => (
                    <li
                        key={h.horaire_id}
                        className="border-b border-primary-foreground/10 pb-4 last:border-0">
                        {editId === h.horaire_id ? (
                            <form
                                action={(fd) =>
                                    submitUpdate(h.horaire_id, fd)
                                }
                                className="grid grid-cols-1 gap-3 rounded-xl bg-primary p-4 sm:grid-cols-3">
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs uppercase">Jour</p>
                                    <select
                                        name="jour"
                                        required
                                        defaultValue={h.jour}
                                        className="h-9 rounded-lg bg-white px-3">
                                        {JOURS.map((j) => (
                                            <option key={j} value={j}>
                                                {j}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <Input
                                    label="Ouverture"
                                    name="heure_ouverture"
                                    type="time"
                                    placeholder="09:00"
                                    required
                                    defaultValue={h.heure_ouverture}
                                    className="w-full"
                                />
                                <Input
                                    label="Fermeture"
                                    name="heure_fermeture"
                                    type="time"
                                    placeholder="18:00"
                                    required
                                    defaultValue={h.heure_fermeture}
                                    className="w-full"
                                />
                                <div className="flex gap-2 sm:col-span-3">
                                    <Button type="submit" disabled={pending}>
                                        Enregistrer
                                    </Button>
                                    <button
                                        type="button"
                                        className="text-sm text-primary-foreground/60"
                                        onClick={() => setEditId(null)}>
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="text-primary-foreground">
                                    <span className="font-semibold">
                                        {h.jour}
                                    </span>
                                    {" · "}
                                    {h.heure_ouverture} - {h.heure_fermeture}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="rounded-lg border border-primary-foreground/30 px-3 py-1.5 text-sm"
                                        onClick={() => {
                                            setEditId(h.horaire_id);
                                            setShowCreate(false);
                                        }}>
                                        Modifier
                                    </button>
                                    <button
                                        type="button"
                                        disabled={pending}
                                        className="rounded-lg border border-red-700/40 px-3 py-1.5 text-sm text-red-700"
                                        onClick={() => remove(h.horaire_id)}>
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
}
