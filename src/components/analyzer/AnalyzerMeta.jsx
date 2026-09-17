function AnalyzerMeta({
    samples,
    sampleRate,
}) {
    const sampleCount =
        samples?.length ?? 0;

    const duration =
        sampleCount > 0
            ? sampleCount / sampleRate
            : 0;

    const nyquist =
        sampleRate / 2;

    return (
        <div className="analyzer-meta">
            <div>
                <span>Fs</span>
                <strong>
                    {(sampleRate / 1000).toFixed(1)} kHz
                </strong>
            </div>

            <div>
                <span>Nyquist</span>
                <strong>
                    {(nyquist / 1000).toFixed(2)} kHz
                </strong>
            </div>

            <div>
                <span>Samples</span>
                <strong>
                    {sampleCount.toLocaleString()}
                </strong>
            </div>

            <div>
                <span>Duration</span>
                <strong>
                    {duration.toFixed(2)} s
                </strong>
            </div>
        </div>
    );
}

export default AnalyzerMeta;