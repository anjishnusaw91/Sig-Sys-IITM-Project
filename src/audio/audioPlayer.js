let audioContext = null;
let currentSource = null;

function getAudioContext() {
    if (!audioContext) {
        audioContext = new AudioContext();
    }

    return audioContext;
}

export async function playSignal(samples, sampleRate) {
    if (!samples || samples.length === 0) {
        return;
    }

    const context = getAudioContext();

    if (context.state === "suspended") {
        await context.resume();
    }

    stopSignal();

    const buffer =
        context.createBuffer(
            1,
            samples.length,
            sampleRate
        );

    buffer.copyToChannel(
        samples,
        0
    );

    const source =
        context.createBufferSource();

    source.buffer = buffer;

    source.connect(
        context.destination
    );

    source.onended = () => {
        if (currentSource === source) {
            currentSource = null;
        }
    };

    currentSource = source;

    source.start();
}

export function stopSignal() {
    if (!currentSource) {
        return;
    }

    try {
        currentSource.stop();
    } catch {
        // Source may already have stopped.
    }

    currentSource.disconnect();
    currentSource = null;
}