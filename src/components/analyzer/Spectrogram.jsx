import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    computeSTFT,
} from "../../dsp/stft";

import PlotFrame from "./PlotFrame";

function Spectrogram({
    samples,
    sampleRate,
    windowType,
}) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    const [panActive, setPanActive] =
        useState(false);

    const [viewStartTime, setViewStartTime] =
        useState(0);

    const [
        viewStartFrequency,
        setViewStartFrequency,
    ] = useState(0);

    const [viewDuration, setViewDuration] =
        useState(1);

    const [
        viewFrequencyRange,
        setViewFrequencyRange,
    ] = useState(8000);

    const [dragging, setDragging] =
        useState(false);

    const dragStartRef =
        useRef(null);

    const stft = useMemo(
        () =>
            computeSTFT(
                samples,
                1024,
                256,
                windowType,
                sampleRate
            ),
        [
            samples,
            windowType,
            sampleRate,
        ]
    );

    const totalTime =
        stft.times.length > 0
            ? stft.times[
            stft.times.length - 1
            ] +
            1024 /
            (2 * sampleRate)
            : 0;

    const maxFrequency =
        sampleRate / 2;

    const frameDuration =
        256 / sampleRate;

    const draw = () => {
        const canvas =
            canvasRef.current;

        const container =
            containerRef.current;

        if (
            !canvas ||
            !container
        ) {
            return;
        }

        const rect =
            container.getBoundingClientRect();

        const width =
            Math.max(
                1,
                rect.width
            );

        const height = 420;

        const dpr =
            window.devicePixelRatio || 1;

        canvas.width =
            width * dpr;

        canvas.height =
            height * dpr;

        canvas.style.width =
            `${width}px`;

        canvas.style.height =
            `${height}px`;

        const ctx =
            canvas.getContext("2d");

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        /*
         * =========================
         * PLOT AREA
         * =========================
         */

        const margin = {
            left: 76,
            right: 24,
            top: 28,
            bottom: 54,
        };

        const plotWidth =
            width -
            margin.left -
            margin.right;

        const plotHeight =
            height -
            margin.top -
            margin.bottom;

        const viewEndTime =
            viewStartTime +
            viewDuration;

        const viewEndFrequency =
            viewStartFrequency +
            viewFrequencyRange;

        const xForTime =
            (time) =>
                margin.left +
                (
                    (
                        time -
                        viewStartTime
                    ) /
                    viewDuration
                ) *
                plotWidth;

        const yForFrequency =
            (frequency) =>
                margin.top +
                (
                    (
                        viewEndFrequency -
                        frequency
                    ) /
                    viewFrequencyRange
                ) *
                plotHeight;

        /*
         * =========================
         * BACKGROUND
         * =========================
         */

        ctx.fillStyle = "#07100d";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );

        /*
         * =========================
         * SPECTROGRAM CELLS
         * =========================
         */

        const rows =
            stft.frequencies.length;

        const cols =
            stft.frames.length;

        const minDb = -90;
        const maxDb = 0;

        for (
            let frame = 0;
            frame < cols;
            frame++
        ) {
            const time =
                stft.times[frame];

            const nextTime =
                time +
                frameDuration;

            if (
                nextTime <
                viewStartTime ||
                time >
                viewEndTime
            ) {
                continue;
            }

            const x =
                xForTime(time);

            const x2 =
                xForTime(nextTime);

            for (
                let k = 0;
                k < rows;
                k++
            ) {
                const frequency =
                    stft.frequencies[k];

                const nextFrequency =
                    frequency +
                    sampleRate /
                    stft.fftSize;

                if (
                    nextFrequency <
                    viewStartFrequency ||
                    frequency >
                    viewEndFrequency
                ) {
                    continue;
                }

                const db =
                    stft.frames[
                    frame
                    ][k];

                const normalized =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            (
                                db -
                                minDb
                            ) /
                            (
                                maxDb -
                                minDb
                            )
                        )
                    );

                const hue =
                    240 -
                    normalized * 240;

                ctx.fillStyle =
                    `hsl(${hue}, 85%, ${18 +
                    normalized * 55
                    }%)`;

                const y =
                    yForFrequency(
                        nextFrequency
                    );

                const y2 =
                    yForFrequency(
                        frequency
                    );

                ctx.fillRect(
                    x,
                    y,
                    Math.max(
                        1,
                        x2 - x + 1
                    ),
                    Math.max(
                        1,
                        y2 - y + 1
                    )
                );
            }
        }

        /*
         * =========================
         * GRID
         * =========================
         */

        ctx.strokeStyle =
            "rgba(180, 255, 220, 0.12)";

        ctx.lineWidth = 1;

        const timeStep =
            viewDuration <= 1
                ? 0.1
                : 0.5;

        for (
            let time =
                Math.ceil(
                    viewStartTime /
                    timeStep
                ) *
                timeStep;

            time <= viewEndTime;

            time += timeStep
        ) {
            const x =
                xForTime(time);

            ctx.beginPath();

            ctx.moveTo(
                x,
                margin.top
            );

            ctx.lineTo(
                x,
                margin.top +
                plotHeight
            );

            ctx.stroke();
        }

        const frequencyStep =
            viewFrequencyRange <= 4000
                ? 500
                : 2000;

        for (
            let frequency =
                Math.ceil(
                    viewStartFrequency /
                    frequencyStep
                ) *
                frequencyStep;

            frequency <=
            viewEndFrequency;

            frequency +=
            frequencyStep
        ) {
            const y =
                yForFrequency(
                    frequency
                );

            ctx.beginPath();

            ctx.moveTo(
                margin.left,
                y
            );

            ctx.lineTo(
                margin.left +
                plotWidth,
                y
            );

            ctx.stroke();
        }

        /*
         * =========================
         * AXES
         * =========================
         */

        ctx.strokeStyle =
            "rgba(210, 255, 230, 0.46)";

        ctx.lineWidth = 1;

        ctx.beginPath();

        ctx.moveTo(
            margin.left,
            margin.top
        );

        ctx.lineTo(
            margin.left,
            margin.top +
            plotHeight
        );

        ctx.lineTo(
            margin.left +
            plotWidth,
            margin.top +
            plotHeight
        );

        ctx.stroke();

        /*
         * =========================
         * TICK LABELS
         * =========================
         */

        ctx.fillStyle =
            "rgba(225, 255, 238, 0.82)";

        ctx.font =
            '12px Inter, system-ui, -apple-system, "Segoe UI", sans-serif';

        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        for (
            let time =
                Math.ceil(
                    viewStartTime /
                    timeStep
                ) *
                timeStep;

            time <= viewEndTime;

            time += timeStep
        ) {
            const x =
                xForTime(time);

            ctx.fillText(
                `${time.toFixed(1)} s`,
                x,
                height -
                margin.bottom +
                12
            );
        }

        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

        for (
            let frequency =
                Math.ceil(
                    viewStartFrequency /
                    frequencyStep
                ) *
                frequencyStep;

            frequency <=
            viewEndFrequency;

            frequency +=
            frequencyStep
        ) {
            const y =
                yForFrequency(
                    frequency
                );

            const label =
                frequency >= 1000
                    ? `${(
                        frequency /
                        1000
                    ).toFixed(
                        frequency % 1000 === 0
                            ? 0
                            : 1
                    )} kHz`
                    : `${frequency} Hz`;

            ctx.fillText(
                label,
                margin.left - 12,
                y
            );
        }

        /*
         * =========================
         * AXIS TITLES
         * =========================
         */

        ctx.fillStyle =
            "rgba(225, 255, 238, 0.90)";

        ctx.font =
            '12px Inter, system-ui, -apple-system, "Segoe UI", sans-serif';

        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";

        ctx.fillText(
            "TIME (s)",
            margin.left +
            plotWidth / 2,
            height - 6
        );

        ctx.save();

        ctx.translate(
            18,
            margin.top +
            plotHeight / 2
        );

        ctx.rotate(
            -Math.PI / 2
        );

        ctx.fillText(
            "FREQUENCY (Hz)",
            0,
            0
        );

        ctx.restore();
    };

    useEffect(() => {
        draw();
    }, [
        stft,
        viewStartTime,
        viewStartFrequency,
        viewDuration,
        viewFrequencyRange,
    ]);

    useEffect(() => {
        const observer =
            new ResizeObserver(() => {
                draw();
            });

        if (
            containerRef.current
        ) {
            observer.observe(
                containerRef.current
            );
        }

        return () =>
            observer.disconnect();
    }, [
        stft,
        viewStartTime,
        viewStartFrequency,
        viewDuration,
        viewFrequencyRange,
    ]);

    /*
     * =========================
     * PAN
     * =========================
     */

    useEffect(() => {
        const handleMouseMove =
            (event) => {
                if (!dragging) {
                    return;
                }

                const dx =
                    event.clientX -
                    dragStartRef.current.x;

                const dy =
                    event.clientY -
                    dragStartRef.current.y;

                const width =
                    containerRef.current
                        ?.clientWidth || 1;

                const height = 420;

                const timeDelta =
                    (dx / width) *
                    viewDuration;

                const frequencyDelta =
                    (dy / height) *
                    viewFrequencyRange;

                let newTime =
                    dragStartRef.current.time -
                    timeDelta;

                let newFrequency =
                    dragStartRef.current.frequency +
                    frequencyDelta;

                newTime =
                    Math.max(
                        0,
                        Math.min(
                            newTime,
                            Math.max(
                                0,
                                totalTime -
                                viewDuration
                            )
                        )
                    );

                newFrequency =
                    Math.max(
                        0,
                        Math.min(
                            newFrequency,
                            Math.max(
                                0,
                                maxFrequency -
                                viewFrequencyRange
                            )
                        )
                    );

                setViewStartTime(
                    newTime
                );

                setViewStartFrequency(
                    newFrequency
                );
            };

        const handleMouseUp = () => {
            setDragging(false);
        };

        window.addEventListener(
            "mousemove",
            handleMouseMove
        );

        window.addEventListener(
            "mouseup",
            handleMouseUp
        );

        return () => {
            window.removeEventListener(
                "mousemove",
                handleMouseMove
            );

            window.removeEventListener(
                "mouseup",
                handleMouseUp
            );
        };
    }, [
        dragging,
        viewDuration,
        viewFrequencyRange,
        totalTime,
        maxFrequency,
    ]);

    const handleMouseDown = (
        event
    ) => {
        if (!panActive) {
            return;
        }

        dragStartRef.current = {
            x: event.clientX,
            y: event.clientY,
            time: viewStartTime,
            frequency:
                viewStartFrequency,
        };

        setDragging(true);
    };

    /*
     * =========================
     * RESET
     * =========================
     */

    const handleReset = () => {
        setViewStartTime(0);

        setViewStartFrequency(0);

        setViewDuration(
            Math.min(
                1,
                Math.max(
                    0.1,
                    totalTime
                )
            )
        );

        setViewFrequencyRange(
            Math.min(
                8000,
                maxFrequency
            )
        );
    };

    return (
        <PlotFrame
            title="Spectrogram"
            panActive={panActive}
            onPanToggle={() =>
                setPanActive(
                    (active) =>
                        !active
                )
            }
            onReset={handleReset}
        >
            <div
                ref={containerRef}
                className={
                    dragging
                        ? "plot-canvas-area pan-active"
                        : "plot-canvas-area"
                }
                onMouseDown={
                    handleMouseDown
                }
            >
                <canvas
                    ref={canvasRef}
                />
            </div>

            <div className="plot-meta">
                <span>
                    <strong>FFT</strong>
                    {stft.fftSize.toLocaleString()}
                </span>

                <span>
                    <strong>Δf</strong>
                    {(
                        sampleRate /
                        stft.fftSize
                    ).toFixed(2)}{" "}
                    Hz
                </span>

                <span>
                    <strong>Hop</strong>
                    {(
                        (
                            256 /
                            sampleRate
                        ) *
                        1000
                    ).toFixed(2)}{" "}
                    ms
                </span>

                <span>
                    <strong>Window</strong>
                    {windowType}
                </span>
            </div>
        </PlotFrame>
    );
}

export default Spectrogram;