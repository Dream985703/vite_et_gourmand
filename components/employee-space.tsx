"use client";

import { useState } from "react";
import { EmployeeOrders } from "./employee-orders";
import { EmployeeMenus } from "./employee-menus";
import { EmployeePlats } from "./employee-plats";
import { EmployeeHoraires } from "./employee-horaires";
import { EmployeeAvis } from "./employee-avis";

export function EmployeeSpace({
    orders,
    menus,
    themes,
    regimes,
    plats,
    horaires,
    avisList,
}: {
    orders: any[];
    menus: any[];
    themes: any[];
    regimes: any[];
    plats: any[];
    horaires: any[];
    avisList: any[];
}) {
    const [tab, setTab] = useState("commandes");

    return (
        <div>
            <div className="mb-10 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => setTab("commandes")}
                    className={
                        tab === "commandes"
                            ? "rounded-lg bg-primary-foreground px-3 py-1.5 text-sm text-white"
                            : "rounded-lg border border-primary-foreground/30 px-3 py-1.5 text-sm text-primary-foreground"
                    }>
                    Commandes
                </button>
                <button
                    type="button"
                    onClick={() => setTab("menus")}
                    className={
                        tab === "menus"
                            ? "rounded-lg bg-primary-foreground px-3 py-1.5 text-sm text-white"
                            : "rounded-lg border border-primary-foreground/30 px-3 py-1.5 text-sm text-primary-foreground"
                    }>
                    Menus
                </button>
                <button
                    type="button"
                    onClick={() => setTab("plats")}
                    className={
                        tab === "plats"
                            ? "rounded-lg bg-primary-foreground px-3 py-1.5 text-sm text-white"
                            : "rounded-lg border border-primary-foreground/30 px-3 py-1.5 text-sm text-primary-foreground"
                    }>
                    Plats
                </button>
                <button
                    type="button"
                    onClick={() => setTab("horaires")}
                    className={
                        tab === "horaires"
                            ? "rounded-lg bg-primary-foreground px-3 py-1.5 text-sm text-white"
                            : "rounded-lg border border-primary-foreground/30 px-3 py-1.5 text-sm text-primary-foreground"
                    }>
                    Horaires
                </button>
                <button
                    type="button"
                    onClick={() => setTab("avis")}
                    className={
                        tab === "avis"
                            ? "rounded-lg bg-primary-foreground px-3 py-1.5 text-sm text-white"
                            : "rounded-lg border border-primary-foreground/30 px-3 py-1.5 text-sm text-primary-foreground"
                    }>
                    Avis
                </button>
            </div>

            {tab === "commandes" && <EmployeeOrders orders={orders} />}
            {tab === "menus" && (
                <EmployeeMenus
                    menus={menus}
                    themes={themes}
                    regimes={regimes}
                />
            )}
            {tab === "plats" && (
                <EmployeePlats plats={plats} menus={menus} />
            )}
            {tab === "horaires" && <EmployeeHoraires horaires={horaires} />}
            {tab === "avis" && <EmployeeAvis avisList={avisList} />}
        </div>
    );
}
