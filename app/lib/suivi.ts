import { statut_suivi } from "@/app/generated/prisma/client";

export const STATUT_SUIVI_LABELS: Record<statut_suivi, string> = {
    Accepte: "Accepté",
    EnPreparation: "En préparation",
    EnCoursDeLivraison: "En cours de livraison",
    Livre: "Livré",
    EnAttenteDuRetourDeMateriel: "En attente du retour de matériel",
    Terminee: "Terminée",
};

export function canTrackOrder(statut: string) {
    if (statut === "En attente d'acceptation") return false;
    if (statut === "Terminée") return false;
    if (statut === "Annulée") return false;
    return true;
}
