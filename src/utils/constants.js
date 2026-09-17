export const SAMPLE_RATE = 44100;

export const DEFAULT_SIGNAL = {
    waveform: "sine",
    frequency: 440,
    amplitude: 0.8,
    duration: 1,
    dutyCycle: 50,
    startFrequency: 200,
    endFrequency: 3000,
};

export const STFT_CONFIG = {
    windowSize: 1024,
    hopSize: 256,
    maxFrequency: 8000,
};