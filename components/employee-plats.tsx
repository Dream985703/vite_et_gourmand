"use client";

import { useState } from "react";
import { createPlat, updatePlat, deletePlat } from "@/app/actions/plat";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function EmployeePlats({
    plats,
    menus,
}: {
    plats: any[];
    menus: any[];
}) {
    const [editId, setEditId] = useState<number | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    async function submitCreate(formData: FormData) {
        setError("");
        setPending(true);
        const res = await createPlat(formData);
        if (res.error) {
            setError(res.error);
        } else {
            setShowCreate(false);
        }
        setPending(false);
    }

    async function submitUpdate(platId: number, formData: FormData) {
        setError("");
        setPending(true);
        const res = await updatePlat(platId, formData);
        if (res.error) {
            setError(res.error);
        } else {
            setEditId(null);
        }
        setPending(false);
    }

    async function remove(platId: number) {
        if (!window.confirm("Supprimer ce plat ?")) return;
        setError("");
        setPending(true);
        const res = await deletePlat(platId);
        if (res.error) {
            setError(res.error);
        }
        setPending(false);
    }

    return (
        <section>
            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-primary-foreground">
                    Plats
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
                    className="mb-6 flex flex-col gap-3 rounded-xl bg-primary p-4">
                    <Input
                        label="Titre du plat"
                        name="titre_plat"
                        type="text"
                        placeholder="Salade"
                        required
                        className="w-full"
                    />
                    <div className="flex flex-col gap-1">
                        <p className="text-xs uppercase">Menu (optionnel)</p>
                        <select
                            name="menu_id"
                            className="h-9 rounded-lg bg-white px-3">
                            <option value="">Aucun</option>
                            {menus.map((m) => (
                                <option key={m.menu_id} value={m.menu_id}>
                                    {m.titre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-xs uppercase">Photo</p>
                        <input
                            type="file"
                            name="photo"
                            accept="image/*"
                            className="text-sm"
                        />
                    </div>
                    <Button type="submit" disabled={pending}>
                        Créer
                    </Button>
                </form>
            )}

            <ul className="flex flex-col gap-4">
                {plats.map((p) => (
                    <li
                        key={p.plat_id}
                        className="border-b border-primary-foreground/10 pb-4 last:border-0">
                        {editId === p.plat_id ? (
                            <form
                                action={(fd) => submitUpdate(p.plat_id, fd)}
                                className="flex flex-col gap-3 rounded-xl bg-primary p-4">
                                <Input
                                    label="Titre du plat"
                                    name="titre_plat"
                                    type="text"
                                    placeholder="Salade"
                                    required
                                    defaultValue={p.titre_plat}
                                    className="w-full"
                                />
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs uppercase">Menu</p>
                                    <select
                                        name="menu_id"
                                        defaultValue={
                                            p.menu[0]?.menu_id ?? ""
                                        }
                                        className="h-9 rounded-lg bg-white px-3">
                                        <option value="">Aucun</option>
                                        {menus.map((m) => (
                                            <option
                                                key={m.menu_id}
                                                value={m.menu_id}>
                                                {m.titre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs uppercase">
                                        Nouvelle photo
                                    </p>
                                    <input
                                        type="file"
                                        name="photo"
                                        accept="image/*"
                                        className="text-sm"
                                    />
                                </div>
                                <div className="flex gap-2">
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
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-primary-foreground">
                                        {p.titre_plat}
                                    </p>
                                    <p className="text-sm text-primary-foreground/70">
                                        {p.menu.length > 0
                                            ? p.menu
                                                  .map(
                                                      (m: { titre: string }) =>
                                                          m.titre,
                                                  )
                                                  .join(", ")
                                            : "Aucun menu lié"}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="rounded-lg border border-primary-foreground/30 px-3 py-1.5 text-sm"
                                        onClick={() => {
                                            setEditId(p.plat_id);
                                            setShowCreate(false);
                                        }}>
                                        Modifier
                                    </button>
                                    <button
                                        type="button"
                                        disabled={pending}
                                        className="rounded-lg border border-red-700/40 px-3 py-1.5 text-sm text-red-700"
                                        onClick={() => remove(p.plat_id)}>
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
