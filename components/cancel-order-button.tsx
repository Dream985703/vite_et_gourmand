"use client";

import { useState } from "react";
import { cancelOrder } from "@/app/actions/order";

export function CancelOrderButton({
    numeroCommande,
}: {
    numeroCommande: string;
}) {
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    async function handleCancel() {
        const ok = window.confirm(
            "Annuler la commande " + numeroCommande + " ?",
        );
        if (!ok) return;

        setError("");
        setPending(true);
        const res = await cancelOrder(numeroCommande);
        if (res.error) {
            setError(res.error);
        }
        setPending(false);
    }

    return (
        <div className="flex flex-col items-start gap-1">
            <button
                type="button"
                disabled={pending}
                onClick={handleCancel}
                className="cursor-pointer rounded-lg border border-red-700/40 px-3 py-1.5 text-sm text-red-700">
                {pending ? "Annulation…" : "Annuler"}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
