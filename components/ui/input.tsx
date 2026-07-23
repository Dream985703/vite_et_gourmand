export function Input({
    label,
    placeholder,
    type,
    className,
    name,
    required,
    autoComplete,
    value,
    defaultValue,
    onValueChange,
}: {
    label: string;
    placeholder: string;
    type: string;
    className?: string;
    name: string;
    required?: boolean;
    autoComplete?: string;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
}) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <p className="text-xs uppercase">{label}</p>
            <input
                onChange={(event) => {
                    onValueChange?.(event.target.value);
                }}
                {...(value !== undefined
                    ? { value }
                    : { defaultValue })}
                className="bg-white h-9 px-3 rounded-lg focus:outline-0 text-sm"
                autoComplete={autoComplete}
                placeholder={placeholder}
                type={type}
                required={required}
                name={name}
            />
        </div>
    );
}
