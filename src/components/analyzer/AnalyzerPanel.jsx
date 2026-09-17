import Panel from "../common/Panel";
import TimeDomainPlot from "./TimeDomainPlot";
import FrequencyDomainPlot from "./FrequencyDomainPlot";
import Spectrogram from "./Spectrogram";
import SignalStats from "./SignalStats";
import AnalyzerMeta from "./AnalyzerMeta";

function AnalyzerPanel({
    samples,
    sampleRate,
    windowType,
    onWindowTypeChange,
}) {
    return (
        <Panel title="Analyzer">
            {!samples ? (
                <div className="empty-state">
                    Generate a signal to begin analysis.
                </div>
            ) : (
                <>
                    <div className="window-control">
                        <label htmlFor="window-select">
                            Window
                        </label>

                        <select
                            id="window-select"
                            value={windowType}
                            onChange={(event) =>
                                onWindowTypeChange(
                                    event.target.value
                                )
                            }
                        >
                            <option value="rectangular">
                                Rectangular
                            </option>

                            <option value="hann">
                                Hann
                            </option>

                            <option value="hamming">
                                Hamming
                            </option>

                            <option value="blackman">
                                Blackman
                            </option>
                        </select>
                    </div>
                    <AnalyzerMeta
                        samples={samples}
                        sampleRate={sampleRate}
                    />
                    <SignalStats
                        samples={samples}
                        sampleRate={sampleRate}
                    />

                    <TimeDomainPlot
                        samples={samples}
                        sampleRate={sampleRate}
                    />

                    <FrequencyDomainPlot
                        samples={samples}
                        sampleRate={sampleRate}
                        windowType={windowType}
                    />

                    <Spectrogram
                        samples={samples}
                        sampleRate={sampleRate}
                        windowType={windowType}
                    />
                </>
            )}
        </Panel>
    );
}

export default AnalyzerPanel;