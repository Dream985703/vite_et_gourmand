export function Slider({
    min,
    max,
    step,
    title,
    value,
    onValueChange,
}: {
    min: number;
    max: number;
    title: string;
    step: number;
    value: number;
    onValueChange: (v: number) => void;
}) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between">
                <p className="text-xs uppercase">{title}</p>
                <p className="text-xs uppercase">{value}</p>
            </div>
            <div className="flex gap-1">
                <p className="text-xs">{min}</p>
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    className="accent-primary-foreground"
                    value={value}
                    onChange={(event) => {
                        onValueChange(Number(event.target.value));
                    }}
                />
                <p className="text-xs">{max}</p>
            </div>
        </div>
    );
}
