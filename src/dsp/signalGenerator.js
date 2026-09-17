import { SAMPLE_RATE } from "../utils/constants";

export function sinc(x) {
    return x === 0
        ? 1
        : Math.sin(Math.PI * x) / (Math.PI * x);
}

export function generateSignal(config) {
    const {
        waveform,
        frequency,
        amplitude,
        duration,
        dutyCycle,
        startFrequency,
        endFrequency,
    } = config;

    const sampleCount = Math.round(duration * SAMPLE_RATE);
    const samples = new Float32Array(sampleCount);

    const duty = dutyCycle / 100;
    const chirpRate =
        (endFrequency - startFrequency) / duration;

    for (let n = 0; n < sampleCount; n++) {
        const t = n / SAMPLE_RATE;

        let sample = 0;

        if (waveform === "sine") {
            sample =
                Math.sin(2 * Math.PI * frequency * t);
        }

        else if (waveform === "square") {
            const phase = (frequency * t) % 1;
            sample = phase < duty ? 1 : -1;
        }

        else if (waveform === "triangle") {
            sample =
                (2 / Math.PI) *
                Math.asin(
                    Math.sin(2 * Math.PI * frequency * t)
                );
        }

        else if (waveform === "chirp") {
            const phase =
                2 *
                Math.PI *
                (
                    startFrequency * t +
                    (chirpRate / 2) * t * t
                );

            sample = Math.sin(phase);
        }

        else if (waveform === "sinc") {
            sample =
                sinc(
                    2 * frequency * (t - duration / 2)
                );
        }

        samples[n] = amplitude * sample;
    }

    return samples;
}