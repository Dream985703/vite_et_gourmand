import Link from "next/link";
import { UsersIcon } from "lucide-react";

export function MenuCard({
    menu,
}: {
    menu: {
        menu_id: number;
        titre: string;
        description: string;
        nombre_personne_minimum: number;
        prix_par_personne: number;
        plats: { plat_id: number }[];
    };
}) {
    let imageSrc =
        "https://www.k-non-restaurant.fr/wp-content/uploads/2024/11/restaurant-saint-girons.jpeg";

    if (menu.plats.length > 0) {
        imageSrc = "/api/plats/" + menu.plats[0].plat_id + "/photo";
    }

    return (
        <Link
            className="w-48 cursor-pointer overflow-hidden rounded-2xl bg-white hover:bg-gray-50"
            href={"/menus/" + menu.menu_id}>
            <img
                src={imageSrc}
                alt={menu.titre}
                className="h-36 w-full object-cover"
            />
            <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold whitespace-nowrap">{menu.titre}</h3>
                    <h3 className="flex items-center gap-1 text-sm whitespace-nowrap">
                        <UsersIcon className="size-3.5" />
                        {menu.nombre_personne_minimum}
                    </h3>
                </div>
                <h3 className="text-xs whitespace-nowrap">{menu.description}</h3>
                <h3 className="text-xl font-black">
                    {Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                    }).format(menu.prix_par_personne)}
                </h3>
            </div>
        </Link>
    );
}
