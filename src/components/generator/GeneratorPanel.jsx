import { useState } from "react";

import Panel from "../common/Panel";
import Button from "../common/Button";

import ParameterControl from "./ParameterControl";
import WaveformSelector from "./WaveformSelector";

import { generateSignal } from "../../dsp/signalGenerator";

import {
    playSignal,
    stopSignal,
} from "../../audio/audioPlayer";

import { exportWav } from "../../audio/wavExporter";
import { decodeAudioFile } from "../../audio/audioDecoder";

import { SAMPLE_RATE } from "../../utils/constants";

function GeneratorPanel({
    config,
    samples,
    sampleRate,
    onConfigChange,
    onSignalGenerated,
}) {
    const [
        loadingAudio,
        setLoadingAudio,
    ] = useState(false);

    const updateConfig = (
        key,
        value
    ) => {
        onConfigChange({
            ...config,
            [key]: value,
        });
    };

    const handleGenerate = () => {
        const newSamples =
            generateSignal(config);

        onSignalGenerated(
            newSamples,
            SAMPLE_RATE
        );
    };

    const handleAudioUpload = async (
        event
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) return;

        try {
            setLoadingAudio(true);

            const decoded =
                await decodeAudioFile(
                    file
                );

            onSignalGenerated(
                decoded.samples,
                decoded.sampleRate
            );
        } catch (error) {
            console.error(
                "Audio decoding failed:",
                error
            );

            alert(
                "Unable to decode this audio file."
            );
        } finally {
            setLoadingAudio(false);
            event.target.value = "";
        }
    };

    /*
     * Play the signal currently
     * displayed by the analyzer.
     */
    const handlePlay = () => {
        if (
            !samples ||
            samples.length === 0
        ) {
            return;
        }

        playSignal(
            samples,
            sampleRate
        );
    };

    const handleStop = () => {
        stopSignal();
    };

    /*
     * Export the signal currently
     * displayed by the analyzer.
     */
    const handleExport = () => {
        if (
            !samples ||
            samples.length === 0
        ) {
            return;
        }

        exportWav(
            samples,
            sampleRate
        );
    };

    const isChirp =
        config.waveform === "chirp";

    const isSquare =
        config.waveform === "square";

    return (
        <Panel title="Generator">

            <WaveformSelector
                value={config.waveform}
                onChange={(value) =>
                    updateConfig(
                        "waveform",
                        value
                    )
                }
            />

            {!isChirp && (
                <ParameterControl
                    label="Frequency"
                    value={config.frequency}
                    min={20}
                    max={8000}
                    step={1}
                    unit=" Hz"
                    onChange={(value) =>
                        updateConfig(
                            "frequency",
                            value
                        )
                    }
                />
            )}

            {isChirp && (
                <>
                    <ParameterControl
                        label="Start Frequency"
                        value={
                            config.startFrequency
                        }
                        min={20}
                        max={8000}
                        step={1}
                        unit=" Hz"
                        onChange={(value) =>
                            updateConfig(
                                "startFrequency",
                                value
                            )
                        }
                    />

                    <ParameterControl
                        label="End Frequency"
                        value={
                            config.endFrequency
                        }
                        min={20}
                        max={8000}
                        step={1}
                        unit=" Hz"
                        onChange={(value) =>
                            updateConfig(
                                "endFrequency",
                                value
                            )
                        }
                    />
                </>
            )}

            {isSquare && (
                <ParameterControl
                    label="Duty Cycle"
                    value={
                        config.dutyCycle
                    }
                    min={5}
                    max={95}
                    step={1}
                    unit="%"
                    onChange={(value) =>
                        updateConfig(
                            "dutyCycle",
                            value
                        )
                    }
                />
            )}

            <ParameterControl
                label="Amplitude"
                value={
                    config.amplitude
                }
                min={0.05}
                max={1}
                step={0.01}
                onChange={(value) =>
                    updateConfig(
                        "amplitude",
                        value
                    )
                }
            />

            <ParameterControl
                label="Duration"
                value={
                    config.duration
                }
                min={0.2}
                max={3}
                step={0.1}
                unit=" s"
                onChange={(value) =>
                    updateConfig(
                        "duration",
                        value
                    )
                }
            />

            <Button
                primary
                onClick={handleGenerate}
            >
                Generate + Analyze
            </Button>

            <div className="audio-upload">
                <label
                    htmlFor="audio-file"
                    className="button"
                >
                    {loadingAudio
                        ? "Loading..."
                        : "Upload Audio"}
                </label>

                <input
                    id="audio-file"
                    type="file"
                    accept="audio/*"
                    onChange={
                        handleAudioUpload
                    }
                    disabled={
                        loadingAudio
                    }
                />
            </div>

            <div className="generator-actions">
                <Button
                    onClick={handlePlay}
                    disabled={
                        !samples ||
                        samples.length === 0
                    }
                >
                    Play
                </Button>

                <Button
                    onClick={handleStop}
                >
                    Stop
                </Button>

                <Button
                    onClick={handleExport}
                    disabled={
                        !samples ||
                        samples.length === 0
                    }
                >
                    Export WAV
                </Button>
            </div>

        </Panel>
    );
}

export default GeneratorPanel;