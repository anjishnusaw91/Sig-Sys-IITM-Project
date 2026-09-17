import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    computeSpectrum,
} from "../../dsp/spectrum";

import PlotFrame from "./PlotFrame";

function FrequencyDomainPlot({
    samples,
    sampleRate,
    windowType,
}) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    const [panActive, setPanActive] =
        useState(false);

    const [viewStart, setViewStart] =
        useState(0);

    const [viewWidth, setViewWidth] =
        useState(8000);

    const [dragging, setDragging] =
        useState(false);

    const dragStartRef =
        useRef(null);

    const spectrum = useMemo(
        () =>
            computeSpectrum(
                samples,
                sampleRate,
                windowType
            ),
        [
            samples,
            sampleRate,
            windowType,
        ]
    );

    const maxFrequency =
        spectrum.frequencies[
        spectrum.frequencies.length - 1
        ];

    const peakIndex =
        spectrum.magnitude.reduce(
            (
                maxIndex,
                value,
                index,
                array
            ) =>
                value >
                    array[maxIndex]
                    ? index
                    : maxIndex,
            0
        );

    const peakFrequency =
        spectrum.frequencies[
        peakIndex
        ];

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

        const height = 360;

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
            left: 72,
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

        const viewEnd =
            viewStart +
            viewWidth;

        const minDb = -100;
        const maxDb = 0;

        const xForFrequency =
            (frequency) =>
                margin.left +
                (
                    (
                        frequency -
                        viewStart
                    ) /
                    viewWidth
                ) *
                plotWidth;

        const yForDb =
            (db) =>
                margin.top +
                (
                    (
                        maxDb -
                        db
                    ) /
                    (
                        maxDb -
                        minDb
                    )
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
         * GRID
         * =========================
         */

        ctx.strokeStyle =
            "rgba(120, 255, 190, 0.10)";

        ctx.lineWidth = 1;

        const frequencyStep =
            viewWidth <= 2000
                ? 250
                : viewWidth <= 5000
                    ? 1000
                    : 2000;

        for (
            let frequency =
                Math.ceil(
                    viewStart /
                    frequencyStep
                ) *
                frequencyStep;

            frequency <= viewEnd;

            frequency +=
            frequencyStep
        ) {
            const x =
                xForFrequency(
                    frequency
                );

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

        for (
            let db = minDb;
            db <= maxDb;
            db += 20
        ) {
            const y =
                yForDb(db);

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
            "rgba(180, 255, 220, 0.42)";

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
            "rgba(210, 255, 230, 0.78)";

        ctx.font =
            '12px Inter, system-ui, -apple-system, "Segoe UI", sans-serif';

        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        for (
            let frequency =
                Math.ceil(
                    viewStart /
                    frequencyStep
                ) *
                frequencyStep;

            frequency <= viewEnd;

            frequency +=
            frequencyStep
        ) {
            const x =
                xForFrequency(
                    frequency
                );

            ctx.fillText(
                frequency >= 1000
                    ? `${(
                        frequency /
                        1000
                    ).toFixed(
                        frequency % 1000 === 0
                            ? 0
                            : 1
                    )} kHz`
                    : `${frequency} Hz`,
                x,
                height -
                margin.bottom +
                12
            );
        }

        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

        for (
            let db = minDb;
            db <= maxDb;
            db += 20
        ) {
            const y =
                yForDb(db);

            ctx.fillText(
                `${db} dB`,
                margin.left - 12,
                y
            );
        }

        /*
         * =========================
         * SPECTRUM
         * =========================
         */

        ctx.strokeStyle =
            "#76ffb0";

        ctx.lineWidth = 1.7;

        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        ctx.beginPath();

        let started = false;

        for (
            let k = 0;
            k <
            spectrum.frequencies.length;
            k++
        ) {
            const frequency =
                spectrum.frequencies[k];

            if (
                frequency <
                viewStart ||
                frequency >
                viewEnd
            ) {
                continue;
            }

            const db =
                Math.max(
                    minDb,
                    spectrum.magnitudeDb[k]
                );

            const x =
                xForFrequency(
                    frequency
                );

            const y =
                yForDb(db);

            if (!started) {
                ctx.moveTo(x, y);
                started = true;
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.stroke();

        /*
         * =========================
         * PEAK MARKER
         * =========================
         */

        if (
            peakFrequency >=
            viewStart &&
            peakFrequency <=
            viewEnd
        ) {
            const peakX =
                xForFrequency(
                    peakFrequency
                );

            const peakDb =
                spectrum.magnitudeDb[
                peakIndex
                ];

            const peakY =
                yForDb(
                    Math.max(
                        minDb,
                        peakDb
                    )
                );

            ctx.strokeStyle =
                "rgba(255, 220, 120, 0.72)";

            ctx.setLineDash([
                5,
                5,
            ]);

            ctx.beginPath();

            ctx.moveTo(
                peakX,
                margin.top
            );

            ctx.lineTo(
                peakX,
                margin.top +
                plotHeight
            );

            ctx.stroke();

            ctx.setLineDash([]);

            /*
             * Peak label background
             */

            const peakLabel =
                `Peak ${peakFrequency.toFixed(
                    1
                )} Hz`;

            ctx.font =
                '11px Inter, system-ui, -apple-system, "Segoe UI", sans-serif';

            const textWidth =
                ctx.measureText(
                    peakLabel
                ).width;

            const labelX =
                Math.min(
                    peakX + 10,
                    width -
                    textWidth -
                    18
                );

            const labelY =
                Math.max(
                    peakY - 14,
                    margin.top +
                    8
                );

            ctx.fillStyle =
                "rgba(10, 14, 18, 0.88)";

            ctx.fillRect(
                labelX - 5,
                labelY - 11,
                textWidth + 10,
                20
            );

            ctx.fillStyle =
                "#ffe08a";

            ctx.textAlign = "left";
            ctx.textBaseline =
                "middle";

            ctx.fillText(
                peakLabel,
                labelX,
                labelY
            );
        }

        /*
         * =========================
         * AXIS TITLES
         * =========================
         */

        ctx.fillStyle =
            "rgba(210, 255, 230, 0.88)";

        ctx.font =
            '12px Inter, system-ui, -apple-system, "Segoe UI", sans-serif';

        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";

        ctx.fillText(
            "FREQUENCY (Hz)",
            margin.left +
            plotWidth / 2,
            height - 6
        );

        ctx.save();

        ctx.translate(
            17,
            margin.top +
            plotHeight / 2
        );

        ctx.rotate(
            -Math.PI / 2
        );

        ctx.fillText(
            "MAGNITUDE (dB)",
            0,
            0
        );

        ctx.restore();
    };

    useEffect(() => {
        draw();
    }, [
        spectrum,
        viewStart,
        viewWidth,
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
        spectrum,
        viewStart,
        viewWidth,
    ]);

    /*
     * =========================
     * PAN
     * =========================
     */

    useEffect(() => {
        const handleMouseMove =
            (event) => {
                if (!dragging) return;

                const dx =
                    event.clientX -
                    dragStartRef.current.x;

                const width =
                    containerRef.current
                        ?.clientWidth || 1;

                const frequencyDelta =
                    (dx / width) *
                    viewWidth;

                let newStart =
                    dragStartRef.current.start -
                    frequencyDelta;

                newStart =
                    Math.max(
                        0,
                        Math.min(
                            newStart,
                            maxFrequency -
                            viewWidth
                        )
                    );

                setViewStart(
                    newStart
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
        viewWidth,
        maxFrequency,
    ]);

    const handleMouseDown = (
        event
    ) => {
        if (!panActive) return;

        dragStartRef.current = {
            x: event.clientX,
            start: viewStart,
        };

        setDragging(true);
    };

    const handleReset = () => {
        setViewStart(0);

        setViewWidth(
            Math.min(
                8000,
                maxFrequency
            )
        );
    };

    return (
        <PlotFrame
            title="Frequency Domain"
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
                    {spectrum.fftSize.toLocaleString()}
                </span>

                <span>
                    <strong>Δf</strong>
                    {spectrum.frequencyResolution.toFixed(
                        2
                    )}{" "}
                    Hz
                </span>

                <span>
                    <strong>Window</strong>
                    {windowType}
                </span>
            </div>
        </PlotFrame>
    );
}

export default FrequencyDomainPlot;