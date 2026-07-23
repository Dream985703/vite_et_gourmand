"use client";

import { useState } from "react";
import {
    acceptOrder,
    advanceOrderStatus,
    cancelOrderByEmployee,
} from "@/app/actions/employee-order";
import { STATUT_SUIVI_LABELS } from "@/app/lib/suivi";
import { Button } from "./ui/button";

type OrderItem = {
    numero_commande: string;
    statut: string;
    client_prenom: string;
    client_nom: string;
    client_email: string;
    client_telephone: string;
    nombre_personne: number;
    prix_menu: number;
    prix_livraison: number;
    pret_materiel: boolean;
    motif_annulation: string | null;
    menu: { titre: string };
    suivis: { statut: string }[];
};

const STATUTS_FILTRE = [
    "En attente d'acceptation",
    "Accepté",
    "En préparation",
    "En cours de livraison",
    "Livré",
    "En attente du retour de matériel",
    "Terminée",
    "Annulée",
];

function getNextLabel(order: OrderItem) {
    if (order.statut === "En attente d'acceptation") {
        return "Accepté";
    }

    if (!order.suivis[0]) {
        return null;
    }

    const current = order.suivis[0].statut;

    if (current === "Accepte") return STATUT_SUIVI_LABELS.EnPreparation;
    if (current === "EnPreparation")
        return STATUT_SUIVI_LABELS.EnCoursDeLivraison;
    if (current === "EnCoursDeLivraison") return STATUT_SUIVI_LABELS.Livre;
    if (current === "Livre") {
        if (order.pret_materiel) {
            return STATUT_SUIVI_LABELS.EnAttenteDuRetourDeMateriel;
        }
        return STATUT_SUIVI_LABELS.Terminee;
    }
    if (current === "EnAttenteDuRetourDeMateriel") {
        return STATUT_SUIVI_LABELS.Terminee;
    }

    return null;
}

export function EmployeeOrders({ orders }: { orders: OrderItem[] }) {
    const [statut, setStatut] = useState("");
    const [client, setClient] = useState("");
    const [error, setError] = useState("");
    const [cancelFor, setCancelFor] = useState("");
    const [modeContact, setModeContact] = useState("");
    const [motif, setMotif] = useState("");
    const [pending, setPending] = useState(false);

    const filtered = [];
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        if (statut && order.statut !== statut) {
            continue;
        }
        const q = client.trim().toLowerCase();
        if (q) {
            const name = (
                order.client_prenom +
                " " +
                order.client_nom
            ).toLowerCase();
            const ok =
                name.includes(q) ||
                order.client_email.toLowerCase().includes(q) ||
                order.numero_commande.toLowerCase().includes(q);
            if (!ok) {
                continue;
            }
        }
        filtered.push(order);
    }

    async function onAccept(numero: string) {
        setError("");
        setPending(true);
        const res = await acceptOrder(numero);
        if (res.error) setError(res.error);
        setPending(false);
    }

    async function onAdvance(numero: string) {
        setError("");
        setPending(true);
        const res = await advanceOrderStatus(numero);
        if (res.error) setError(res.error);
        setPending(false);
    }

    async function onCancel(numero: string) {
        setError("");
        setPending(true);
        const res = await cancelOrderByEmployee(numero, modeContact, motif);
        if (res.error) {
            setError(res.error);
        } else {
            setCancelFor("");
            setModeContact("");
            setMotif("");
        }
        setPending(false);
    }

    return (
        <section>
            <h2 className="mb-4 text-lg font-semibold text-primary-foreground">
                Commandes
            </h2>

            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                <div className="flex flex-col gap-1">
                    <p className="text-xs uppercase">Statut</p>
                    <select
                        className="h-9 rounded-lg bg-white px-3"
                        value={statut}
                        onChange={(e) => setStatut(e.target.value)}>
                        <option value="">Tous</option>
                        {STATUTS_FILTRE.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                    <p className="text-xs uppercase">Client</p>
                    <input
                        className="h-9 rounded-lg bg-white px-3 text-sm"
                        placeholder="Nom, email ou n° commande"
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                    />
                </div>
            </div>

            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

            {filtered.length === 0 ? (
                <p className="text-primary-foreground/60">Aucune commande.</p>
            ) : (
                <ul className="flex flex-col gap-6">
                    {filtered.map((order) => {
                        const next = getNextLabel(order);
                        const total = order.prix_menu + order.prix_livraison;

                        return (
                            <li
                                key={order.numero_commande}
                                className="border-b border-primary-foreground/10 pb-6">
                                <p className="font-semibold text-primary-foreground">
                                    {order.numero_commande}
                                </p>
                                <p className="text-sm text-primary-foreground/70">
                                    {order.client_prenom} {order.client_nom} ·{" "}
                                    {order.client_email} ·{" "}
                                    {order.client_telephone}
                                </p>
                                <p className="text-sm text-primary-foreground/70">
                                    {order.menu.titre} · {order.nombre_personne}{" "}
                                    pers. · {total.toFixed(2)} €
                                    {order.pret_materiel
                                        ? " · prêt matériel"
                                        : ""}
                                </p>
                                <p className="text-sm font-medium text-indigo-600">
                                    {order.statut}
                                </p>
                                {order.motif_annulation && (
                                    <p className="text-sm text-red-700">
                                        {order.motif_annulation}
                                    </p>
                                )}

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {order.statut ===
                                        "En attente d'acceptation" && (
                                        <Button
                                            type="button"
                                            disabled={pending}
                                            onClick={() =>
                                                onAccept(order.numero_commande)
                                            }>
                                            Accepter
                                        </Button>
                                    )}

                                    {next &&
                                        order.statut !==
                                            "En attente d'acceptation" &&
                                        order.statut !== "Annulée" &&
                                        order.statut !== "Terminée" && (
                                            <Button
                                                type="button"
                                                disabled={pending}
                                                onClick={() =>
                                                    onAdvance(
                                                        order.numero_commande,
                                                    )
                                                }>
                                                Passer à : {next}
                                            </Button>
                                        )}

                                    {order.statut !== "Annulée" &&
                                        order.statut !== "Terminée" && (
                                            <button
                                                type="button"
                                                disabled={pending}
                                                onClick={() =>
                                                    setCancelFor(
                                                        order.numero_commande,
                                                    )
                                                }
                                                className="cursor-pointer rounded-lg border border-red-700/40 px-3 py-1.5 text-sm text-red-700">
                                                Annuler
                                            </button>
                                        )}
                                </div>

                                {cancelFor === order.numero_commande && (
                                    <div className="mt-4 flex flex-col gap-3 rounded-xl bg-primary p-4">
                                        <p className="text-sm text-primary-foreground/80">
                                            Contactez d&apos;abord le client,
                                            puis indiquez le mode de contact et
                                            le motif.
                                        </p>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs uppercase">
                                                Mode de contact
                                            </p>
                                            <select
                                                className="h-9 rounded-lg bg-white px-3"
                                                value={modeContact}
                                                onChange={(e) =>
                                                    setModeContact(
                                                        e.target.value,
                                                    )
                                                }>
                                                <option value="">
                                                    Sélectionner...
                                                </option>
                                                <option value="GSM">
                                                    Appel GSM
                                                </option>
                                                <option value="Mail">
                                                    Mail
                                                </option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs uppercase">
                                                Motif
                                            </p>
                                            <textarea
                                                className="min-h-20 rounded-lg bg-white px-3 py-2 text-sm"
                                                value={motif}
                                                onChange={(e) =>
                                                    setMotif(e.target.value)
                                                }
                                                placeholder="Motif d'annulation"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                disabled={pending}
                                                onClick={() =>
                                                    onCancel(
                                                        order.numero_commande,
                                                    )
                                                }>
                                                Confirmer l&apos;annulation
                                            </Button>
                                            <button
                                                type="button"
                                                className="text-sm text-primary-foreground/60"
                                                onClick={() =>
                                                    setCancelFor("")
                                                }>
                                                Fermer
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
