"use client";

import { useState } from "react";
import { MenuCard } from "./menu-card";
import { Select } from "./ui/select";
import { Slider } from "./ui/slider";

export function MenuSection({
    menus,
    themes,
    regimes,
}: {
    themes: any[];
    menus: any[];
    regimes: any[];
}) {
    const [selectedThemeId, setThemeId] = useState<number | null>(null);
    const [selectedRegimeId, setSelectedRegimeId] = useState<number | null>(
        null,
    );

    let maxPrice = 0;
    let minPrice = 0;
    let maxNbPersonnes = 0;
    let minNbPersonnes = 0;

    if (menus.length > 0) {
        maxPrice = menus[0].prix_par_personne;
        minPrice = menus[0].prix_par_personne;
        maxNbPersonnes = menus[0].nombre_personne_minimum;
        minNbPersonnes = menus[0].nombre_personne_minimum;

        for (let i = 0; i < menus.length; i++) {
            if (menus[i].prix_par_personne > maxPrice) {
                maxPrice = menus[i].prix_par_personne;
            }
            if (menus[i].prix_par_personne < minPrice) {
                minPrice = menus[i].prix_par_personne;
            }
            if (menus[i].nombre_personne_minimum > maxNbPersonnes) {
                maxNbPersonnes = menus[i].nombre_personne_minimum;
            }
            if (menus[i].nombre_personne_minimum < minNbPersonnes) {
                minNbPersonnes = menus[i].nombre_personne_minimum;
            }
        }
    }

    const [selectedMinPrice, setSelectedMinPrice] = useState(minPrice);
    const [selectedMaxPrice, setSelectedMaxPrice] = useState(maxPrice);
    const [selectedMinNbPersonnes, setSelectedMinNbPersonnes] =
        useState(maxNbPersonnes);

    const filtered = [];
    for (let i = 0; i < menus.length; i++) {
        const menu = menus[i];
        if (selectedThemeId && menu.theme_id !== selectedThemeId) {
            continue;
        }
        if (selectedRegimeId && menu.regime_id !== selectedRegimeId) {
            continue;
        }
        if (
            menu.prix_par_personne > selectedMaxPrice ||
            menu.prix_par_personne < selectedMinPrice
        ) {
            continue;
        }
        if (menu.nombre_personne_minimum > selectedMinNbPersonnes) {
            continue;
        }
        filtered.push(menu);
    }

    return (
        <section className="flex gap-8 rounded-tl-4xl rounded-br-4xl bg-primary p-10">
            <div className="flex w-full flex-col gap-8">
                <div className="flex justify-between">
                    <div className="flex items-end gap-4 font-normal select-none">
                        <article
                            className={
                                selectedThemeId === null
                                    ? "cursor-pointer text-xl font-black text-primary-foreground"
                                    : "cursor-pointer text-primary-foreground"
                            }
                            onClick={() => setThemeId(null)}>
                            Tout
                        </article>
                        {themes.map((theme) => (
                            <article
                                key={theme.theme_id}
                                className={
                                    selectedThemeId === theme.theme_id
                                        ? "cursor-pointer text-xl font-black text-primary-foreground"
                                        : "cursor-pointer text-primary-foreground"
                                }
                                onClick={() => setThemeId(theme.theme_id)}>
                                {theme.libelle}
                            </article>
                        ))}
                    </div>
                </div>
                <div className="flex flex-wrap gap-4">
                    {filtered.map((menu) => (
                        <MenuCard menu={menu} key={menu.menu_id} />
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl bg-white/20 p-6 font-normal select-none">
                <Select
                    title="Régime"
                    options={[
                        { label: "Tous", value: "" },
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
                    min={minPrice}
                    step={0.01}
                    max={maxPrice || 100}
                    value={selectedMinPrice}
                    onValueChange={(v) => setSelectedMinPrice(v)}
                />
                <Slider
                    title="Prix max"
                    min={minPrice}
                    step={0.01}
                    max={maxPrice || 100}
                    value={selectedMaxPrice}
                    onValueChange={(v) => setSelectedMaxPrice(v)}
                />
                <Slider
                    title="Nombre de personnes minimum"
                    min={minNbPersonnes}
                    step={1}
                    max={maxNbPersonnes || 100}
                    value={selectedMinNbPersonnes}
                    onValueChange={(v) => setSelectedMinNbPersonnes(v)}
                />
            </div>
        </section>
    );
}
