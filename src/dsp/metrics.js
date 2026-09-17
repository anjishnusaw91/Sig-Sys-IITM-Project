export function computeSignalMetrics(
    samples,
    sampleRate
) {
    if (
        !samples ||
        samples.length === 0
    ) {
        return {
            rms: 0,
            peak: 0,
            mean: 0,
            sampleCount: 0,
            duration: 0,
        };
    }

    let sum = 0;
    let sumSquares = 0;
    let peak = 0;

    for (
        let i = 0;
        i < samples.length;
        i++
    ) {
        const value = samples[i];

        sum += value;
        sumSquares +=
            value * value;

        const absolute =
            Math.abs(value);

        if (absolute > peak) {
            peak = absolute;
        }
    }

    const sampleCount =
        samples.length;

    const mean =
        sum / sampleCount;

    const rms =
        Math.sqrt(
            sumSquares /
            sampleCount
        );

    const duration =
        sampleCount /
        sampleRate;

    return {
        rms,
        peak,
        mean,
        sampleCount,
        duration,
    };
}