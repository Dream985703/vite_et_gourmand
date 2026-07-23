"use client";
import { menu, regime, theme } from "@/app/generated/prisma/browser";
import { useState } from "react";
import { MenuCard } from "./menu-card";
import { Select } from "./ui/select";
import { Slider } from "./ui/slider";

export function MenuSection({
    menus,
    themes,
    regimes,
}: {
    themes: theme[];
    menus: menu[];
    regimes: regime[];
}) {
    const [selectedThemeId, setThemeId] = useState<number | null>(null);
    const [selectedRegimeId, setSelectedRegimeId] = useState<number | null>(
        null,
    );

    const maxPrice = menus
        .sort(
            (menuA, menuB) => menuB.prix_par_personne - menuA.prix_par_personne,
        )
        .at(0)?.prix_par_personne;

    const minPrice = menus
        .sort(
            (menuA, menuB) => menuA.prix_par_personne - menuB.prix_par_personne,
        )
        .at(0)?.prix_par_personne;

    const maxNbPersonnes = menus
        .sort(
            (menuA, menuB) =>
                menuB.nombre_personne_minimum - menuA.nombre_personne_minimum,
        )
        .at(0)?.nombre_personne_minimum;

    const minNbPersonnes = menus
        .sort(
            (menuA, menuB) =>
                menuA.nombre_personne_minimum - menuB.nombre_personne_minimum,
        )
        .at(0)?.nombre_personne_minimum;

    const [selectedMinPrice, setSelectedMinPrice] = useState<number>(
        minPrice ?? 0,
    );
    const [selectedMaxPrice, setSelectedMaxPrice] = useState<number>(
        maxPrice ?? 100000,
    );

    const [selectedMinNbPersonnes, setSelectedMinNbPersonnes] =
        useState<number>(maxNbPersonnes ?? 0);

    return (
        <section className="flex gap-8 bg-primary rounded-tl-4xl rounded-br-4xl p-10">
            <div className="flex flex-col gap-8 w-full">
                <div className="flex justify-between">
                    <div className="flex gap-4 font-normal select-none items-end">
                        <article
                            className={`cursor-pointer text-primary-foreground ${selectedThemeId === null ? "font-black text-xl" : ""}`}
                            onClick={() => {
                                setThemeId(null);
                            }}>
                            Tout
                        </article>
                        {themes.map((theme) => (
                            <article
                                key={theme.theme_id}
                                className={`cursor-pointer text-primary-foreground ${selectedThemeId === theme.theme_id ? "font-black text-xl" : ""}`}
                                onClick={() => {
                                    setThemeId(theme.theme_id);
                                }}>
                                {theme.libelle}
                            </article>
                        ))}
                    </div>
                </div>
                <div className="flex flex-wrap gap-4">
                    {menus
                        .filter(
                            (menu) =>
                                !selectedThemeId ||
                                menu.theme_id === selectedThemeId,
                        )
                        .filter(
                            (menu) =>
                                !selectedRegimeId ||
                                menu.regime_id === selectedRegimeId,
                        )
                        .filter(
                            (menu) =>
                                menu.prix_par_personne <=
                                    (selectedMaxPrice ?? 100000) &&
                                menu.prix_par_personne >=
                                    (selectedMinPrice ?? 0),
                        )
                        .filter(
                            (menu) =>
                                menu.nombre_personne_minimum <=
                                selectedMinNbPersonnes,
                        )
                        .map((menu) => (
                            <MenuCard menu={menu} key={menu.menu_id} />
                        ))}
                </div>
            </div>
            <div className="flex flex-col bg-white/20 rounded-xl gap-4 font-normal select-none p-6">
                <Select
                    title="Régime"
                    options={[
                        {
                            label: "Tous",
                            value: "",
                        },
                        ...regimes.map((regime) => ({
                            label: regime.libelle,
                            value: regime.regime_id.toString(),
                        })),
                    ]}
                    value={
                        selectedRegimeId ? selectedRegimeId.toString() : null
                    }
                    onValueChange={(v) => {
                        if (v === "") {
                            setSelectedRegimeId(null);
                        } else {
                            setSelectedRegimeId(Number(v));
                        }
                    }}
                />
                <Slider
                    title="Prix min"
                    min={minPrice ?? 0}
                    step={0.01}
                    max={maxPrice ?? 100000}
                    value={selectedMinPrice}
                    onValueChange={(v) => {
                        setSelectedMinPrice(v);
                    }}
                />
                <Slider
                    title="Prix max"
                    min={minPrice ?? 0}
                    step={0.01}
                    max={maxPrice ?? 100000}
                    value={selectedMaxPrice}
                    onValueChange={(v) => {
                        setSelectedMaxPrice(v);
                    }}
                />
                <Slider
                    title="Nombre de personnes minimum"
                    min={minNbPersonnes ?? 0}
                    step={1}
                    max={maxNbPersonnes ?? 100000}
                    value={selectedMinNbPersonnes}
                    onValueChange={(v) => {
                        setSelectedMinNbPersonnes(v);
                    }}
                />
            </div>
        </section>
    );
}
