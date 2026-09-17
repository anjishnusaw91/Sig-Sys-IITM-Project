export function nextPowerOfTwo(n) {
    let p = 1;

    while (p < n) {
        p *= 2;
    }

    return p;
}

export function fft(real, imag) {
    const n = real.length;

    // Bit-reversal permutation
    for (let i = 1, j = 0; i < n; i++) {
        let bit = n >> 1;

        for (; j & bit; bit >>= 1) {
            j ^= bit;
        }

        j ^= bit;

        if (i < j) {
            [real[i], real[j]] = [real[j], real[i]];
            [imag[i], imag[j]] = [imag[j], imag[i]];
        }
    }

    // Cooley-Tukey butterfly stages
    for (let length = 2; length <= n; length <<= 1) {
        const angle = -2 * Math.PI / length;

        const wReal = Math.cos(angle);
        const wImag = Math.sin(angle);

        for (let i = 0; i < n; i += length) {
            let currentReal = 1;
            let currentImag = 0;

            for (let j = 0; j < length / 2; j++) {
                const uReal = real[i + j];
                const uImag = imag[i + j];

                const vReal =
                    real[i + j + length / 2] * currentReal -
                    imag[i + j + length / 2] * currentImag;

                const vImag =
                    real[i + j + length / 2] * currentImag +
                    imag[i + j + length / 2] * currentReal;

                real[i + j] = uReal + vReal;
                imag[i + j] = uImag + vImag;

                real[i + j + length / 2] = uReal - vReal;
                imag[i + j + length / 2] = uImag - vImag;

                const nextReal =
                    currentReal * wReal -
                    currentImag * wImag;

                const nextImag =
                    currentReal * wImag +
                    currentImag * wReal;

                currentReal = nextReal;
                currentImag = nextImag;
            }
        }
    }

    return { real, imag };
}