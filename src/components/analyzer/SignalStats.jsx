import { useMemo } from "react";

import StatBadge from "../common/StatBadge";

import {
    computeSignalMetrics,
} from "../../dsp/metrics";

function SignalStats({
    samples,
    sampleRate,
}) {
    const metrics = useMemo(
        () =>
            computeSignalMetrics(
                samples,
                sampleRate
            ),
        [
            samples,
            sampleRate,
        ]
    );

    return (
        <div className="signal-stats">
            <StatBadge
                label="RMS"
                value={metrics.rms.toFixed(4)}
            />

            <StatBadge
                label="Peak"
                value={metrics.peak.toFixed(4)}
            />

            <StatBadge
                label="DC / Mean"
                value={metrics.mean.toFixed(4)}
            />
        </div>
    );
}

export default SignalStats;