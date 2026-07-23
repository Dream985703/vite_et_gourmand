"use client";

import { useState, useTransition } from "react";
import { cancelOrder } from "@/app/actions/order";

export function CancelOrderButton({
    numeroCommande,
}: {
    numeroCommande: string;
}) {
    const [error, setError] = useState("");
    const [pending, startTransition] = useTransition();

    function handleCancel() {
        const confirmed = window.confirm(
            `Annuler la commande ${numeroCommande} ? Cette action est définitive.`,
        );
        if (!confirmed) return;

        setError("");
        startTransition(async () => {
            const res = await cancelOrder(numeroCommande);
            if (res.error) {
                setError(res.error);
            }
        });
    }

    return (
        <div className="flex flex-col items-start gap-1">
            <button
                type="button"
                disabled={pending}
                onClick={handleCancel}
                className="cursor-pointer rounded-lg border border-red-700/40 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
                {pending ? "Annulation…" : "Annuler"}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
