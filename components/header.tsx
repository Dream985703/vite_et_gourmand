import { auth } from "@/app/auth";
import { UserIcon } from "lucide-react";
import Link from "next/link";

export async function Header() {
    const session = await auth();

    return (
        <header className="flex  p-6 justify-between">
            <h1 className="text-primary-foreground font-erica text-2xl">
                <Link href="/">Vite & Gourmand</Link>
            </h1>
            <nav className="flex gap-8 items-center">
                <Link
                    href="/menus"
                    className="text-primary-foreground font-semibold">
                    Menus
                </Link>
                <Link
                    href="/contact"
                    className="text-primary-foreground font-semibold">
                    Contact
                </Link>
                {session?.user ? (
                    <Link href={`/account`} className="bg-primary px-3 py-2 rounded-lg flex gap-1 items-center cursor-pointer hover:opacity-90">                        <UserIcon className="size-4" />
                        {session.user.name}
                    </Link>
                ) : (
                    <Link
                        href="/login"
                        className="text-white bg-primary-foreground px-3 py-1.5 rounded-lg font-semibold">
                        Connexion
                    </Link>
                )}
            </nav>
        </header>
    );
}
