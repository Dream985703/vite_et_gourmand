import { statut_suivi } from "@/app/generated/prisma/client";

export const STATUT_SUIVI_LABELS: Record<statut_suivi, string> = {
    Accepte: "Accepté",
    EnPreparation: "En préparation",
    EnCoursDeLivraison: "En cours de livraison",
    Livre: "Livré",
    EnAttenteDuRetourDeMateriel: "En attente du retour de matériel",
    Terminee: "Terminée",
};

export const STATUT_SUIVI_ORDER: statut_suivi[] = [
    "Accepte",
    "EnPreparation",
    "EnCoursDeLivraison",
    "Livre",
    "EnAttenteDuRetourDeMateriel",
    "Terminee",
];

export function canTrackOrder(statut: string): boolean {
    return (
        statut !== "En attente d'acceptation" && statut !== "Terminée"
    );
}
