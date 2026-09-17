export function rectangularWindow(N) {
    const window = new Float32Array(N);

    for (let n = 0; n < N; n++) {
        window[n] = 1;
    }

    return window;
}

export function hannWindow(N) {
    const window = new Float32Array(N);

    for (let n = 0; n < N; n++) {
        window[n] =
            0.5 -
            0.5 * Math.cos((2 * Math.PI * n) / (N - 1));
    }

    return window;
}

export function hammingWindow(N) {
    const window = new Float32Array(N);

    for (let n = 0; n < N; n++) {
        window[n] =
            0.54 -
            0.46 * Math.cos((2 * Math.PI * n) / (N - 1));
    }

    return window;
}

export function blackmanWindow(N) {
    const window = new Float32Array(N);

    for (let n = 0; n < N; n++) {
        const phase = (2 * Math.PI * n) / (N - 1);

        window[n] =
            0.42 -
            0.5 * Math.cos(phase) +
            0.08 * Math.cos(2 * phase);
    }

    return window;
}

export function getWindow(type, N) {
    switch (type) {
        case "rectangular":
            return rectangularWindow(N);

        case "hamming":
            return hammingWindow(N);

        case "blackman":
            return blackmanWindow(N);

        case "hann":
        default:
            return hannWindow(N);
    }
}