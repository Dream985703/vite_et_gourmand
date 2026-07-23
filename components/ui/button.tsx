import { ReactNode } from "react";

export function Button({
    children,
    className,
    type,
    disabled,
    onClick,
}: {
    children: ReactNode;
    className?: string;
    disabled?: boolean;
    type?: "submit" | "reset" | "button" | undefined;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={`bg-primary-foreground text-white px-3 py-2 rounded-lg h-fit cursor-pointer hover:opacity-90 disabled:opacity-35 disabled:cursor-not-allowed ${className}`}>
            {children}
        </button>
    );
}
