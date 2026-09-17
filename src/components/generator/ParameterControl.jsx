function ParameterControl({
    label,
    value,
    min,
    max,
    step,
    unit = "",
    onChange,
}) {
    return (
        <div className="parameter-control">
            <div className="parameter-label">
                <span>{label}</span>

                <span>
                    {value}
                    {unit}
                </span>
            </div>

            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(event) =>
                    onChange(Number(event.target.value))
                }
            />
        </div>
    );
}

export default ParameterControl;