import {
    nextPowerOfTwo,
    fft,
} from "./fft";

import {
    getWindow,
} from "./windows";

export function computeSpectrum(
    samples,
    sampleRate,
    windowType = "hann"
) {
    const originalLength =
        samples.length;

    const N =
        nextPowerOfTwo(
            originalLength
        );

    /*
     * Window the original signal.
     */
    const window =
        getWindow(
            windowType,
            originalLength
        );

    /*
     * Coherent gain correction.
     *
     * For a sinusoid, the sum of the
     * window coefficients determines
     * how much its amplitude is reduced.
     */
    let windowSum = 0;

    for (
        let n = 0;
        n < originalLength;
        n++
    ) {
        windowSum += window[n];
    }

    /*
     * Prevent division by zero for
     * pathological window definitions.
     */
    const normalization =
        windowSum > 0
            ? windowSum
            : 1;

    const real =
        new Float32Array(N);

    const imag =
        new Float32Array(N);

    /*
     * Apply the window.
     */
    for (
        let n = 0;
        n < originalLength;
        n++
    ) {
        real[n] =
            samples[n] *
            window[n];
    }

    /*
     * Zero-padding is already provided
     * by the larger FFT arrays.
     */
    fft(real, imag);

    /*
     * Positive-frequency half.
     *
     * N/2 excludes the Nyquist bin here,
     * so every bin except DC receives
     * the usual factor-of-two correction
     * for a one-sided amplitude spectrum.
     */
    const binCount =
        N / 2;

    const frequencies =
        new Float32Array(
            binCount
        );

    const magnitude =
        new Float32Array(
            binCount
        );

    const magnitudeDb =
        new Float32Array(
            binCount
        );

    for (
        let k = 0;
        k < binCount;
        k++
    ) {
        frequencies[k] =
            (
                k *
                sampleRate
            ) / N;

        const fftMagnitude =
            Math.sqrt(
                real[k] *
                real[k] +
                imag[k] *
                imag[k]
            );

        let amplitude =
            fftMagnitude /
            normalization;

        if (k > 0) {
            amplitude *= 2;
        }

        magnitude[k] =
            amplitude;

        magnitudeDb[k] =
            20 *
            Math.log10(
                amplitude +
                1e-12
            );
    }

    return {
        frequencies,

        magnitude,

        magnitudeDb,

        fftSize: N,

        frequencyResolution:
            sampleRate / N,

        sampleRate,

        windowType,

        windowCoherentGain:
            windowSum /
            originalLength,
    };
}