export type SelectOption = { label: string; value: string };

export function Select({
    options,
    title,
    value,
    onValueChange,
    className,
}: {
    title: string;
    options: SelectOption[];
    value: string | null;
    className?: string;
    onValueChange: (v: string) => void;
}) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <p className="text-xs uppercase">{title}</p>
            <select
                onChange={(event) => {
                    onValueChange(event.target.value);
                }}
                className="bg-white px-3 h-9 rounded-lg"
                value={value ?? ""}>
                <option value={""}>Sélectionner...</option>
                {options.map((option) => (
                    <option value={option.value} key={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
