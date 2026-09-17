import { nextPowerOfTwo, fft } from "./fft";
import { getWindow } from "./windows";

export function computeSTFT(
    samples,
    windowSize = 1024,
    hopSize = 256,
    windowType = "hann",
    sampleRate = 44100
) {
    const window =
        getWindow(
            windowType,
            windowSize
        );

    const fftSize =
        nextPowerOfTwo(windowSize);

    const binCount =
        fftSize / 2;

    const frames = [];
    const times = [];

    for (
        let start = 0;
        start + windowSize <= samples.length;
        start += hopSize
    ) {
        const real =
            new Float32Array(
                fftSize
            );

        const imag =
            new Float32Array(
                fftSize
            );

        for (
            let n = 0;
            n < windowSize;
            n++
        ) {
            real[n] =
                samples[start + n] *
                window[n];
        }

        fft(real, imag);

        const magnitudeDb =
            new Float32Array(
                binCount
            );

        for (
            let k = 0;
            k < binCount;
            k++
        ) {
            const magnitude =
                Math.sqrt(
                    real[k] * real[k] +
                    imag[k] * imag[k]
                ) / fftSize;

            magnitudeDb[k] =
                20 *
                Math.log10(
                    magnitude + 1e-12
                );
        }

        frames.push(
            magnitudeDb
        );

        times.push(
            (start +
                windowSize / 2) /
            sampleRate
        );
    }

    const frequencies =
        new Float32Array(
            binCount
        );

    for (
        let k = 0;
        k < binCount;
        k++
    ) {
        frequencies[k] =
            (k * sampleRate) /
            fftSize;
    }

    return {
        frames,
        times,
        frequencies,
        fftSize,
        windowSize,
        hopSize,
        sampleRate,

        frequencyResolution:
            sampleRate / fftSize,

        timeResolution:
            hopSize / sampleRate,
    };
}