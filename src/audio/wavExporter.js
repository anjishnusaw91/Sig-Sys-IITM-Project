export function exportWav(
    samples,
    sampleRate
) {
    if (!samples || samples.length === 0) {
        return;
    }

    const bytesPerSample = 2;
    const channels = 1;

    const dataSize =
        samples.length *
        bytesPerSample;

    const buffer =
        new ArrayBuffer(
            44 + dataSize
        );

    const view =
        new DataView(buffer);

    writeString(
        view,
        0,
        "RIFF"
    );

    view.setUint32(
        4,
        36 + dataSize,
        true
    );

    writeString(
        view,
        8,
        "WAVE"
    );

    writeString(
        view,
        12,
        "fmt "
    );

    view.setUint32(
        16,
        16,
        true
    );

    view.setUint16(
        20,
        1,
        true
    );

    view.setUint16(
        22,
        channels,
        true
    );

    view.setUint32(
        24,
        sampleRate,
        true
    );

    view.setUint32(
        28,
        sampleRate *
        channels *
        bytesPerSample,
        true
    );

    view.setUint16(
        32,
        channels *
        bytesPerSample,
        true
    );

    view.setUint16(
        34,
        16,
        true
    );

    writeString(
        view,
        36,
        "data"
    );

    view.setUint32(
        40,
        dataSize,
        true
    );

    for (
        let i = 0;
        i < samples.length;
        i++
    ) {
        const sample =
            Math.max(
                -1,
                Math.min(
                    1,
                    samples[i]
                )
            );

        const pcm =
            sample < 0
                ? sample * 32768
                : sample * 32767;

        view.setInt16(
            44 + i * 2,
            pcm,
            true
        );
    }

    const blob =
        new Blob(
            [buffer],
            {
                type: "audio/wav",
            }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "signal-lab.wav";

    link.click();

    URL.revokeObjectURL(url);
}

function writeString(
    view,
    offset,
    string
) {
    for (
        let i = 0;
        i < string.length;
        i++
    ) {
        view.setUint8(
            offset + i,
            string.charCodeAt(i)
        );
    }
}