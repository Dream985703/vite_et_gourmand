"use client";

import { menu, utilisateur } from "@/app/generated/prisma/browser";
import { Select } from "./ui/select";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { confirmOrder, updateOrder } from "@/app/actions/order";
import { useRouter } from "next/navigation";

const RESTAURANT_LAT = 44.8637713;
const RESTAURANT_LON = -0.6272116;
const GEOCODE_DEBOUNCE_MS = 500;

type Point = { lat: number; lon: number };

async function getLatLongOfAddress(address: string): Promise<Point | null> {
    const query = new URLSearchParams({
        q: address,
    });

    const results = await fetch(
        `https://api-adresse.data.gouv.fr/search/?${query.toString()}`,
    ).then((res) => res.json());

    const res = results.features.at(0).geometry.coordinates;

    return { lat: parseFloat(res.at(0)), lon: parseFloat(res.at(1)) };
}

async function getDistanceMeters(point: Point): Promise<number> {
    const data = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${RESTAURANT_LON},${RESTAURANT_LAT};${point.lat},${point.lon}?overview=false`,
    ).then((res) => res.json());

    return data.routes.at(0).distance;
}

export type OrderForm = {
    menu_id: number | null;
    client_mail: string;
    client_lastname: string;
    client_firstname: string;
    client_phone: string;
    nb_personnes: number;
    date: string;
    adress: string;
    city: string;
    hour: string;
    pret_materiel: boolean;
};

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
});

function defaultForm(
    user: utilisateur | null,
    preselectedMenuId: string | null,
    initialValues?: Partial<OrderForm>,
): OrderForm {
    return {
        menu_id: preselectedMenuId ? Number(preselectedMenuId) : null,
        client_firstname: user?.prenom ?? "",
        client_lastname: user?.nom ?? "",
        client_mail: user?.email ?? "",
        client_phone: user?.telephone ?? "",
        nb_personnes: 1,
        date: new Date().toISOString().split("T").at(0) ?? "",
        hour: "00:00",
        adress: user?.adresse_postale ?? "",
        city: user?.ville ?? "",
        pret_materiel: false,
        ...initialValues,
    };
}

export function OrderForm({
    menus,
    user,
    preselectedMenuId,
    mode = "create",
    orderNumber,
    initialValues,
}: {
    menus: menu[];
    user: utilisateur | null;
    preselectedMenuId: string | null;
    mode?: "create" | "edit";
    orderNumber?: string;
    initialValues?: Partial<OrderForm>;
}) {
    const router = useRouter();
    const isEdit = mode === "edit";
    const [meters, setMeters] = useState<number>(0);
    const [error, setError] = useState("");
    const [form, setForm] = useState<OrderForm>(() =>
        defaultForm(user, preselectedMenuId, initialValues),
    );

    const selectedMenu = menus.find((m) => m.menu_id === form.menu_id) ?? null;
    const prixParPersonne = selectedMenu?.prix_par_personne ?? null;
    const minPersonnes = selectedMenu?.nombre_personne_minimum ?? null;

    const hasFiveMore = form.nb_personnes - (minPersonnes ?? 0) >= 5;

    const totalPriceBeforeReduction =
        (prixParPersonne ?? 0) * form.nb_personnes;

    const reduction = hasFiveMore ? totalPriceBeforeReduction * 0.1 : 0;

    const normalizedCity = form.city.toLowerCase().trim();

    const majoration =
        !normalizedCity || normalizedCity === "bordeaux"
            ? 0
            : 5 + (0.59 * meters) / 1000;

    const totalAfterReductionAndMajorations =
        totalPriceBeforeReduction - reduction + majoration;

    useEffect(() => {
        const address = form.adress.trim();
        const city = form.city.trim();

        if (!address || !city) {
            setMeters(0);
            return;
        }

        let cancelled = false;

        const timeoutId = setTimeout(async () => {
            try {
                const point = await getLatLongOfAddress(`${address} ${city}`);
                if (cancelled || !point) return;

                const distance = await getDistanceMeters(point);
                if (cancelled) return;

                setMeters(distance);
            } catch {
                if (!cancelled) setMeters(0);
            }
        }, GEOCODE_DEBOUNCE_MS);

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [form.adress, form.city]);

    const onSubmit = async () => {
        setError("");
        const prixMenu = totalPriceBeforeReduction - reduction;

        const res = isEdit
            ? await updateOrder(
                orderNumber!,
                form,
                prixMenu,
                majoration,
            )
            : await confirmOrder(form, prixMenu, majoration);

        if (res.error) {
            setError(res.error);
            return;
        }

        if (isEdit) {
            router.push("/account");
            router.refresh();
        } else {
            alert("OK");
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto items-center bg-primary p-10 rounded-2xl">
            <p className="text-3xl font-erica">
                {isEdit ? "Modifier la commande" : "Commander"}
            </p>
            {isEdit && orderNumber && (
                <p className="text-sm text-primary-foreground/70">
                    {orderNumber}
                </p>
            )}
            <p className="text-red-500">{error}</p>
            <div className="grid grid-cols-2 gap-4 w-full">
                {isEdit ? (
                    <div className="flex flex-col gap-1 w-full">
                        <p className="text-xs uppercase">Menu</p>
                        <p className="bg-white/70 h-9 px-3 rounded-lg text-sm flex items-center text-primary-foreground/70">
                            {selectedMenu
                                ? `${selectedMenu.titre} (${selectedMenu.prix_par_personne}€)`
                                : "-"}
                        </p>
                    </div>
                ) : (
                    <Select
                        className="w-full"
                        onValueChange={(v) => {
                            setForm((previous) => ({
                                ...previous,
                                menu_id: Number(v),
                            }));
                        }}
                        value={form.menu_id?.toString() ?? null}
                        title="Menu"
                        options={menus.map((menu) => ({
                            label: `${menu.titre} (${menu.prix_par_personne}€)`,
                            value: menu.menu_id.toString(),
                        }))}
                    />
                )}
                <Input
                    className="w-full"
                    label={`Nombre de personnes ${selectedMenu
                            ? `(min. ${selectedMenu.nombre_personne_minimum})`
                            : ""
                        }`}
                    name="nb_personnes"
                    placeholder="18"
                    type="number"
                    required
                    value={form.nb_personnes.toString()}
                    onValueChange={(v) => {
                        setForm((prev) => ({
                            ...prev,
                            nb_personnes: Number(v),
                        }));
                    }}
                />
                <Input
                    className="w-full"
                    label="Prénom du client"
                    name="firstname"
                    placeholder="Ryan"
                    type="text"
                    autoComplete="given_name"
                    required
                    value={form.client_firstname}
                    onValueChange={(v) => {
                        setForm((prev) => ({ ...prev, client_firstname: v }));
                    }}
                />
                <Input
                    className="w-full"
                    label="Nom du client"
                    name="lastname"
                    placeholder="Perque"
                    type="text"
                    autoComplete="family_name"
                    required
                    value={form.client_lastname}
                    onValueChange={(v) => {
                        setForm((prev) => ({ ...prev, client_lastname: v }));
                    }}
                />
                <Input
                    className="w-full"
                    label="Mail du client"
                    name="mail"
                    placeholder="ryan@mail.com"
                    type="mail"
                    autoComplete="mail"
                    required
                    value={form.client_mail}
                    onValueChange={(v) => {
                        setForm((prev) => ({ ...prev, client_mail: v }));
                    }}
                />
                <Input
                    className="w-full"
                    label="Numéro de GSM du client"
                    name="phone"
                    placeholder="0612345678"
                    type="phone"
                    autoComplete="tel"
                    required
                    value={form.client_phone}
                    onValueChange={(v) => {
                        setForm((prev) => ({ ...prev, client_phone: v }));
                    }}
                />
                <Input
                    className="w-full"
                    label="Date de la prestation"
                    name="date"
                    placeholder="01/01/2026"
                    type="date"
                    required
                    value={form.date}
                    onValueChange={(v) => {
                        setForm((prev) => ({ ...prev, date: v }));
                    }}
                />
                <Input
                    className="w-full"
                    label="Heure de la prestation"
                    name="time"
                    placeholder="12:00"
                    type="time"
                    required
                    value={form.hour}
                    onValueChange={(v) => {
                        setForm((prev) => ({ ...prev, hour: v }));
                    }}
                />
                <Input
                    className="w-full"
                    label="Adresse de la prestation"
                    name="adress"
                    placeholder="1 Rue de la Paix"
                    type="text"
                    required
                    value={form.adress}
                    onValueChange={(v) => {
                        setForm((prev) => ({ ...prev, adress: v }));
                    }}
                />
                <Input
                    className="w-full"
                    label="Ville de la prestation"
                    name="city"
                    placeholder="Bordeaux"
                    type="text"
                    required
                    value={form.city}
                    onValueChange={(v) => {
                        setForm((prev) => ({ ...prev, city: v }));
                    }}
                />
                <label className="col-span-2 flex items-center gap-3 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={form.pret_materiel}
                        onChange={(e) => {
                            setForm((prev) => ({
                                ...prev,
                                pret_materiel: e.target.checked,
                            }));
                        }}
                        className="size-4 accent-primary-foreground"
                    />
                    <span className="text-sm">Prêt de matériel</span>
                </label>
            </div>
            <hr className="h-px bg-primary-foreground w-full opacity-30 my-5" />
            <div className="flex flex-col gap-1 w-full">
                <p className="font-bold">Résumé :</p>
                <div className="flex justify-between">
                    <p>Prix du menu</p>
                    {form.menu_id !== null && (
                        <p>{currencyFormatter.format(prixParPersonne!)}</p>
                    )}
                </div>
                <div className="flex justify-between">
                    <p>Nombre de personnes</p>
                    <p>{form.nb_personnes}</p>
                </div>
                <div className="flex justify-between">
                    <p>Prêt de matériel</p>
                    <p>{form.pret_materiel ? "Oui" : "Non"}</p>
                </div>
                {Boolean(hasFiveMore || majoration) && (
                    <div className="flex justify-between">
                        <p className="font-bold">
                            Total avant réductions/majorations
                        </p>
                        <p>
                            {currencyFormatter.format(
                                totalPriceBeforeReduction,
                            )}
                        </p>
                    </div>
                )}
                {hasFiveMore && (
                    <div className="flex justify-between">
                        <p>Réduction spéciale (+5 personnes que le min.)</p>
                        <p>-{currencyFormatter.format(reduction)}</p>
                    </div>
                )}
                {Boolean(majoration) && (
                    <div className="flex justify-between">
                        <p>
                            Majoration (hors Bordeaux. -{" "}
                            {Math.round(meters / 1000)} kms)
                        </p>
                        <p>+{currencyFormatter.format(majoration)}</p>
                    </div>
                )}
                {form.menu_id !== null && (
                    <div className="flex justify-between">
                        <p className="font-bold">Total</p>
                        <p>
                            {currencyFormatter.format(
                                totalAfterReductionAndMajorations,
                            )}
                        </p>
                    </div>
                )}
            </div>
            <Button
                className="w-full"
                disabled={selectedMenu === null}
                onClick={() => {
                    onSubmit();
                }}>
                {isEdit ? "Enregistrer les modifications" : "Commander"}
            </Button>
        </div>
    );
}
