import type { Metadata } from "next";
import { DM_Sans, Erica_One, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";

const dmsans = DM_Sans({
    variable: "--font-dmsans",
    subsets: ["latin"],
});

const erica = Erica_One({
    variable: "--font-erica",
    weight: ["400"],
});

export const metadata: Metadata = {
    title: "Vite & Gourmand",
    description: "Commandez votre menu préféré sur notre site.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="fr"
            className={`${erica.variable} ${dmsans.variable} h-full antialiased font-dmsans`}>
            <body className="min-h-full flex flex-col" suppressHydrationWarning>
                <Header />
                {children}
            </body>
        </html>
    );
}
