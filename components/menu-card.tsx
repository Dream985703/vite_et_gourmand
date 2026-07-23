import { menu } from "@/app/generated/prisma/browser";
import { UsersIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function MenuCard({ menu }: { menu: menu }) {
    return (
        <Link
            className="w-48 bg-white hover:bg-gray-50 rounded-2xl overflow-hidden cursor-pointer"
            href={`/menus/${menu.menu_id}`}>
            <Image
                src="https://www.k-non-restaurant.fr/wp-content/uploads/2024/11/restaurant-saint-girons.jpeg"
                alt={menu.titre}
                width={1024}
                height={760}
                className="w-full h-36 object-cover"
            />
            <div className="flex flex-col gap-2 p-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold whitespace-nowrap">
                        {menu.titre}
                    </h3>
                    <h3 className="flex gap-1 items-center text-sm whitespace-nowrap">
                        <UsersIcon className="size-3.5" />
                        {menu.nombre_personne_minimum}
                    </h3>
                </div>
                <h3 className="text-xs whitespace-nowrap">
                    {menu.description}
                </h3>
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
