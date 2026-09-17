const WAVEFORMS = [
    {
        value: "sine",
        label: "Sinusoid",
    },
    {
        value: "square",
        label: "Square",
    },
    {
        value: "triangle",
        label: "Triangle",
    },
    {
        value: "chirp",
        label: "Chirp",
    },
    {
        value: "sinc",
        label: "Sinc",
    },
];

function WaveformSelector({ value, onChange }) {
    return (
        <div className="parameter-control">
            <div className="parameter-label">
                <span>Waveform</span>
            </div>

            <select
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
            >
                {WAVEFORMS.map((waveform) => (
                    <option
                        key={waveform.value}
                        value={waveform.value}
                    >
                        {waveform.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default WaveformSelector;