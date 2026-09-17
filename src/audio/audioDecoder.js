export async function decodeAudioFile(file) {
    if (!file) {
        return null;
    }

    const arrayBuffer =
        await file.arrayBuffer();

    const audioContext =
        new AudioContext();

    try {
        const audioBuffer =
            await audioContext.decodeAudioData(
                arrayBuffer
            );

        const channelCount =
            audioBuffer.numberOfChannels;

        const length =
            audioBuffer.length;

        const samples =
            new Float32Array(length);

        if (channelCount === 1) {
            samples.set(
                audioBuffer.getChannelData(0)
            );
        } else {
            for (let i = 0; i < length; i++) {
                let sum = 0;

                for (
                    let channel = 0;
                    channel < channelCount;
                    channel++
                ) {
                    sum +=
                        audioBuffer.getChannelData(
                            channel
                        )[i];
                }

                samples[i] =
                    sum / channelCount;
            }
        }

        return {
            samples,
            sampleRate:
                audioBuffer.sampleRate,
            duration:
                audioBuffer.duration,
            channels:
                channelCount,
        };
    } finally {
        await audioContext.close();
    }
}