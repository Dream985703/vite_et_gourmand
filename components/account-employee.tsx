import type { utilisateur } from "@/app/generated/prisma/client";

export async function AccountEmployee({ user }: { user: utilisateur }) {
    return (
        <main className="mx-auto w-full max-w-3xl px-6 py-10">
            <header className="mb-10 border-b border-primary-foreground/15 pb-6">
                <h1 className="font-erica text-3xl text-primary-foreground">
                    Espace employé
                </h1>
                <p className="mt-2 text-primary-foreground/70">
                    Bonjour {user.prenom}
                </p>
            </header>
            <p className="text-primary-foreground/60">À venir.</p>
        </main>
    );
}
