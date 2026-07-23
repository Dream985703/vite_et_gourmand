"use client";

import { useState } from "react";

type StatOrder = {
    numero_commande: string;
    menu_id: number;
    menu_titre: string;
    date_commande: string;
    prix_menu: number;
    prix_livraison: number;
    statut: string;
};

type MenuOption = {
    menu_id: number;
    titre: string;
};

export function AdminStats({
    orders,
    menus,
}: {
    orders: StatOrder[];
    menus: MenuOption[];
}) {
    const [menuId, setMenuId] = useState("");
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");

    const filtered = [];
    for (let i = 0; i < orders.length; i++) {
        const o = orders[i];
        if (o.statut === "Annulée") {
            continue;
        }
        if (menuId && String(o.menu_id) !== menuId) {
            continue;
        }
        const d = o.date_commande.slice(0, 10);
        if (dateDebut && d < dateDebut) {
            continue;
        }
        if (dateFin && d > dateFin) {
            continue;
        }
        filtered.push(o);
    }

    const stats: {
        menu_id: number;
        titre: string;
        count: number;
        ca: number;
    }[] = [];

    for (let i = 0; i < filtered.length; i++) {
        const o = filtered[i];
        let found = null as null | (typeof stats)[number];
        for (let j = 0; j < stats.length; j++) {
            if (stats[j].menu_id === o.menu_id) {
                found = stats[j];
            }
        }
        if (found) {
            found.count = found.count + 1;
            found.ca = found.ca + o.prix_menu + o.prix_livraison;
        } else {
            stats.push({
                menu_id: o.menu_id,
                titre: o.menu_titre,
                count: 1,
                ca: o.prix_menu + o.prix_livraison,
            });
        }
    }

    let maxCount = 1;
    let totalCa = 0;
    for (let i = 0; i < stats.length; i++) {
        if (stats[i].count > maxCount) {
            maxCount = stats[i].count;
        }
        totalCa = totalCa + stats[i].ca;
    }

    return (
        <section>
            <h2 className="mb-4 text-lg font-semibold text-primary-foreground">
                Statistiques
            </h2>

            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <div className="flex flex-col gap-1">
                    <p className="text-xs uppercase">Menu</p>
                    <select
                        className="h-9 rounded-lg bg-white px-3"
                        value={menuId}
                        onChange={(e) => setMenuId(e.target.value)}>
                        <option value="">Tous</option>
                        {menus.map((m) => (
                            <option key={m.menu_id} value={m.menu_id}>
                                {m.titre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-xs uppercase">Du</p>
                    <input
                        type="date"
                        className="h-9 rounded-lg bg-white px-3 text-sm"
                        value={dateDebut}
                        onChange={(e) => setDateDebut(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-xs uppercase">Au</p>
                    <input
                        type="date"
                        className="h-9 rounded-lg bg-white px-3 text-sm"
                        value={dateFin}
                        onChange={(e) => setDateFin(e.target.value)}
                    />
                </div>
            </div>

            <div className="mb-10">
                <h3 className="mb-4 text-sm font-semibold text-primary-foreground">
                    Commandes par menu
                </h3>
                {stats.length === 0 ? (
                    <p className="text-primary-foreground/60">
                        Aucune donnée.
                    </p>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {stats.map((m) => (
                            <li key={m.menu_id}>
                                <div className="mb-1 flex justify-between gap-2 text-sm">
                                    <span className="text-primary-foreground">
                                        {m.titre}
                                    </span>
                                    <span className="text-primary-foreground/60">
                                        {m.count}
                                    </span>
                                </div>
                                <div className="h-3 rounded-full bg-primary-foreground/10">
                                    <div
                                        className="h-3 rounded-full bg-primary-foreground"
                                        style={{
                                            width:
                                                (m.count / maxCount) * 100 +
                                                "%",
                                        }}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div>
                <h3 className="mb-4 text-sm font-semibold text-primary-foreground">
                    Chiffre d&apos;affaires par menu
                </h3>
                <p className="mb-4 text-sm text-primary-foreground/70">
                    Total : {totalCa.toFixed(2)} €
                </p>
                {stats.length === 0 ? (
                    <p className="text-primary-foreground/60">
                        Aucune donnée.
                    </p>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {stats.map((m) => (
                            <li
                                key={m.menu_id}
                                className="flex flex-wrap items-center justify-between gap-2 border-b border-primary-foreground/10 pb-3">
                                <span className="text-primary-foreground">
                                    {m.titre}
                                </span>
                                <span className="font-semibold text-primary-foreground">
                                    {m.ca.toFixed(2)} €
                                    <span className="ml-2 text-sm font-normal text-primary-foreground/50">
                                        ({m.count} commande
                                        {m.count > 1 ? "s" : ""})
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}
