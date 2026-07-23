"use client";

import { useState } from "react";
import { createMenu, updateMenu, deleteMenu } from "@/app/actions/menu";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function EmployeeMenus({
    menus,
    themes,
    regimes,
}: {
    menus: any[];
    themes: any[];
    regimes: any[];
}) {
    const [editId, setEditId] = useState<number | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    async function submitCreate(formData: FormData) {
        setError("");
        setPending(true);
        const res = await createMenu(formData);
        if (res.error) {
            setError(res.error);
        } else {
            setShowCreate(false);
        }
        setPending(false);
    }

    async function submitUpdate(menuId: number, formData: FormData) {
        setError("");
        setPending(true);
        const res = await updateMenu(menuId, formData);
        if (res.error) {
            setError(res.error);
        } else {
            setEditId(null);
        }
        setPending(false);
    }

    async function remove(menuId: number) {
        if (!window.confirm("Supprimer ce menu ?")) return;
        setError("");
        setPending(true);
        const res = await deleteMenu(menuId);
        if (res.error) {
            setError(res.error);
        }
        setPending(false);
    }

    return (
        <section>
            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-primary-foreground">
                    Menus
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
                    className="mb-6 grid grid-cols-1 gap-3 rounded-xl bg-primary p-4 sm:grid-cols-2">
                    <Input
                        label="Titre"
                        name="titre"
                        type="text"
                        placeholder="Menu été"
                        required
                        className="w-full"
                    />
                    <Input
                        label="Description"
                        name="description"
                        type="text"
                        placeholder="Court texte"
                        required
                        className="w-full"
                    />
                    <Input
                        label="Prix / personne"
                        name="prix_par_personne"
                        type="number"
                        placeholder="15"
                        required
                        className="w-full"
                    />
                    <Input
                        label="Min. personnes"
                        name="nombre_personne_minimum"
                        type="number"
                        placeholder="4"
                        required
                        className="w-full"
                    />
                    <Input
                        label="Stock"
                        name="quantite_restante"
                        type="number"
                        placeholder="20"
                        required
                        className="w-full"
                    />
                    <div className="flex flex-col gap-1">
                        <p className="text-xs uppercase">Thème</p>
                        <select
                            name="theme_id"
                            required
                            className="h-9 rounded-lg bg-white px-3">
                            <option value="">Sélectionner...</option>
                            {themes.map((t) => (
                                <option key={t.theme_id} value={t.theme_id}>
                                    {t.libelle}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-xs uppercase">Régime</p>
                        <select
                            name="regime_id"
                            required
                            className="h-9 rounded-lg bg-white px-3">
                            <option value="">Sélectionner...</option>
                            {regimes.map((r) => (
                                <option key={r.regime_id} value={r.regime_id}>
                                    {r.libelle}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <Button type="submit" disabled={pending}>
                            Créer
                        </Button>
                    </div>
                </form>
            )}

            <ul className="flex flex-col gap-4">
                {menus.map((m) => (
                    <li
                        key={m.menu_id}
                        className="border-b border-primary-foreground/10 pb-4 last:border-0">
                        {editId === m.menu_id ? (
                            <form
                                action={(fd) => submitUpdate(m.menu_id, fd)}
                                className="grid grid-cols-1 gap-3 rounded-xl bg-primary p-4 sm:grid-cols-2">
                                <Input
                                    label="Titre"
                                    name="titre"
                                    type="text"
                                    placeholder="Menu"
                                    required
                                    defaultValue={m.titre}
                                    className="w-full"
                                />
                                <Input
                                    label="Description"
                                    name="description"
                                    type="text"
                                    placeholder="Description"
                                    required
                                    defaultValue={m.description}
                                    className="w-full"
                                />
                                <Input
                                    label="Prix / personne"
                                    name="prix_par_personne"
                                    type="number"
                                    placeholder="15"
                                    required
                                    defaultValue={String(m.prix_par_personne)}
                                    className="w-full"
                                />
                                <Input
                                    label="Min. personnes"
                                    name="nombre_personne_minimum"
                                    type="number"
                                    placeholder="4"
                                    required
                                    defaultValue={String(
                                        m.nombre_personne_minimum,
                                    )}
                                    className="w-full"
                                />
                                <Input
                                    label="Stock"
                                    name="quantite_restante"
                                    type="number"
                                    placeholder="20"
                                    required
                                    defaultValue={String(m.quantite_restante)}
                                    className="w-full"
                                />
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs uppercase">Thème</p>
                                    <select
                                        name="theme_id"
                                        required
                                        defaultValue={m.theme_id}
                                        className="h-9 rounded-lg bg-white px-3">
                                        {themes.map((t) => (
                                            <option
                                                key={t.theme_id}
                                                value={t.theme_id}>
                                                {t.libelle}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs uppercase">Régime</p>
                                    <select
                                        name="regime_id"
                                        required
                                        defaultValue={m.regime_id}
                                        className="h-9 rounded-lg bg-white px-3">
                                        {regimes.map((r) => (
                                            <option
                                                key={r.regime_id}
                                                value={r.regime_id}>
                                                {r.libelle}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-2 sm:col-span-2">
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
                                        {m.titre}
                                    </p>
                                    <p className="text-sm text-primary-foreground/70">
                                        {m.description} · {m.prix_par_personne}{" "}
                                        €/pers · stock {m.quantite_restante}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="rounded-lg border border-primary-foreground/30 px-3 py-1.5 text-sm"
                                        onClick={() => {
                                            setEditId(m.menu_id);
                                            setShowCreate(false);
                                        }}>
                                        Modifier
                                    </button>
                                    <button
                                        type="button"
                                        disabled={pending}
                                        className="rounded-lg border border-red-700/40 px-3 py-1.5 text-sm text-red-700"
                                        onClick={() => remove(m.menu_id)}>
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
