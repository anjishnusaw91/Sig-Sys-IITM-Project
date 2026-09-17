import {
    useEffect,
    useRef,
    useState,
} from "react";

import PlotFrame from "./PlotFrame";

function TimeDomainPlot({
    samples,
    sampleRate,
}) {
    const canvasRef = useRef(null);

    const [panActive, setPanActive] =
        useState(false);

    const [viewStart, setViewStart] =
        useState(0);

    const [viewDuration, setViewDuration] =
        useState(0.04);

    const dragRef = useRef(null);

    const signalDuration =
        samples.length / sampleRate;

    const actualViewDuration =
        Math.min(
            viewDuration,
            signalDuration
        );

    const maxStart =
        Math.max(
            0,
            signalDuration -
            actualViewDuration
        );

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        const draw = () => {
            const rect =
                canvas.getBoundingClientRect();

            const dpr =
                window.devicePixelRatio || 1;

            const width =
                Math.max(1, rect.width);

            const height = 300;

            canvas.width =
                width * dpr;

            canvas.height =
                height * dpr;

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

            const left = 64;
            const right = 20;
            const top = 24;
            const bottom = 42;

            const plotWidth =
                width -
                left -
                right;

            const plotHeight =
                height -
                top -
                bottom;

            /*
             * =========================
             * BACKGROUND
             * =========================
             */

            ctx.fillStyle = "#090d11";

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
                "rgba(148, 163, 184, 0.10)";

            ctx.lineWidth = 1;

            const horizontalLines = 4;

            for (
                let i = 0;
                i <= horizontalLines;
                i++
            ) {
                const y =
                    top +
                    (i / horizontalLines) *
                    plotHeight;

                ctx.beginPath();

                ctx.moveTo(
                    left,
                    y
                );

                ctx.lineTo(
                    width - right,
                    y
                );

                ctx.stroke();
            }

            const verticalLines = 8;

            for (
                let i = 0;
                i <= verticalLines;
                i++
            ) {
                const x =
                    left +
                    (i / verticalLines) *
                    plotWidth;

                ctx.beginPath();

                ctx.moveTo(
                    x,
                    top
                );

                ctx.lineTo(
                    x,
                    height - bottom
                );

                ctx.stroke();
            }

            /*
             * =========================
             * AXES
             * =========================
             */

            const zeroY =
                top +
                plotHeight / 2;

            ctx.strokeStyle =
                "rgba(170, 190, 205, 0.42)";

            ctx.lineWidth = 1;

            ctx.beginPath();

            ctx.moveTo(
                left,
                zeroY
            );

            ctx.lineTo(
                width - right,
                zeroY
            );

            ctx.stroke();

            ctx.beginPath();

            ctx.moveTo(
                left,
                top
            );

            ctx.lineTo(
                left,
                height - bottom
            );

            ctx.stroke();

            /*
             * =========================
             * Y AXIS LABELS
             * =========================
             */

            ctx.fillStyle =
                "#8b9aaa";

            ctx.font =
                '12px Inter, system-ui, -apple-system, "Segoe UI", sans-serif';

            ctx.textAlign = "right";
            ctx.textBaseline = "middle";

            ctx.fillText(
                "1.0",
                left - 10,
                top
            );

            ctx.fillText(
                "0",
                left - 10,
                zeroY
            );

            ctx.fillText(
                "-1.0",
                left - 10,
                height - bottom
            );

            /*
             * =========================
             * X AXIS LABELS
             * =========================
             */

            ctx.textAlign = "center";
            ctx.textBaseline = "top";

            const tickCount = 4;

            for (
                let i = 0;
                i <= tickCount;
                i++
            ) {
                const ratio =
                    i / tickCount;

                const time =
                    viewStart +
                    ratio *
                    actualViewDuration;

                const x =
                    left +
                    ratio *
                    plotWidth;

                ctx.fillText(
                    `${(
                        time * 1000
                    ).toFixed(1)} ms`,
                    x,
                    height -
                    bottom +
                    10
                );
            }

            /*
             * =========================
             * WAVEFORM
             * =========================
             */

            const startSample =
                Math.max(
                    0,
                    Math.floor(
                        viewStart *
                        sampleRate
                    )
                );

            const endSample =
                Math.min(
                    samples.length,
                    Math.ceil(
                        (
                            viewStart +
                            actualViewDuration
                        ) *
                        sampleRate
                    )
                );

            const sampleCount =
                endSample -
                startSample;

            if (sampleCount > 0) {
                ctx.beginPath();

                for (
                    let i = 0;
                    i < sampleCount;
                    i++
                ) {
                    const sampleIndex =
                        startSample + i;

                    const time =
                        sampleIndex /
                        sampleRate;

                    const x =
                        left +
                        (
                            (
                                time -
                                viewStart
                            ) /
                            actualViewDuration
                        ) *
                        plotWidth;

                    const y =
                        zeroY -
                        samples[
                        sampleIndex
                        ] *
                        (
                            plotHeight /
                            2
                        );

                    if (i === 0) {
                        ctx.moveTo(
                            x,
                            y
                        );
                    } else {
                        ctx.lineTo(
                            x,
                            y
                        );
                    }
                }

                ctx.strokeStyle =
                    "#9acbff";

                ctx.lineWidth = 1.8;

                ctx.lineJoin = "round";
                ctx.lineCap = "round";

                ctx.stroke();
            }

            /*
             * =========================
             * AXIS TITLES
             * =========================
             */

            ctx.fillStyle =
                "#9aa8b7";

            ctx.font =
                '11px Inter, system-ui, -apple-system, "Segoe UI", sans-serif';

            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";

            ctx.fillText(
                "TIME",
                left +
                plotWidth / 2,
                height - 5
            );

            ctx.save();

            ctx.translate(
                18,
                top +
                plotHeight / 2
            );

            ctx.rotate(
                -Math.PI / 2
            );

            ctx.fillText(
                "AMPLITUDE",
                0,
                0
            );

            ctx.restore();
        };

        draw();

        const observer =
            new ResizeObserver(draw);

        observer.observe(canvas);

        return () => {
            observer.disconnect();
        };
    }, [
        samples,
        sampleRate,
        viewStart,
        actualViewDuration,
    ]);

    /*
     * =========================
     * PAN START
     * =========================
     */

    const handlePointerDown = (
        event
    ) => {
        if (!panActive) return;

        const canvas =
            canvasRef.current;

        canvas.setPointerCapture(
            event.pointerId
        );

        dragRef.current = {
            pointerId:
                event.pointerId,
            startX:
                event.clientX,
            originalStart:
                viewStart,
        };
    };

    /*
     * =========================
     * PAN MOVE
     * =========================
     */

    const handlePointerMove = (
        event
    ) => {
        if (
            !panActive ||
            !dragRef.current
        ) {
            return;
        }

        const canvas =
            canvasRef.current;

        const rect =
            canvas.getBoundingClientRect();

        const deltaX =
            event.clientX -
            dragRef.current.startX;

        const deltaTime =
            (deltaX / rect.width) *
            actualViewDuration;

        const newStart =
            dragRef.current.originalStart -
            deltaTime;

        const clampedStart =
            Math.max(
                0,
                Math.min(
                    maxStart,
                    newStart
                )
            );

        setViewStart(
            clampedStart
        );
    };

    /*
     * =========================
     * PAN END
     * =========================
     */

    const handlePointerUp = () => {
        dragRef.current = null;
    };

    /*
     * =========================
     * RESET
     * =========================
     */

    const resetView = () => {
        setViewStart(0);

        setViewDuration(
            Math.min(
                0.04,
                signalDuration
            )
        );
    };

    const startMs =
        viewStart * 1000;

    const endMs =
        (
            viewStart +
            actualViewDuration
        ) *
        1000;

    return (
        <PlotFrame
            title={`Time Domain · ${startMs.toFixed(
                1
            )}–${endMs.toFixed(1)} ms`}
            panActive={panActive}
            onPanToggle={() =>
                setPanActive(
                    (active) =>
                        !active
                )
            }
            onReset={resetView}
        >
            <canvas
                ref={canvasRef}
                onPointerDown={
                    handlePointerDown
                }
                onPointerMove={
                    handlePointerMove
                }
                onPointerUp={
                    handlePointerUp
                }
                onPointerCancel={
                    handlePointerUp
                }
                onPointerLeave={
                    handlePointerUp
                }
            />
        </PlotFrame>
    );
}

export default TimeDomainPlot;