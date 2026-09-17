import { useRef, useState } from "react";
import {
    Maximize2,
    Minimize2,
    Move,
    RotateCcw,
} from "lucide-react";

function PlotFrame({
    title,
    children,
    panActive,
    onPanToggle,
    onReset,
}) {
    const frameRef = useRef(null);

    const [fullscreen, setFullscreen] =
        useState(false);

    const toggleFullscreen = async () => {
        if (!document.fullscreenElement) {
            await frameRef.current?.requestFullscreen();
            setFullscreen(true);
        } else {
            await document.exitFullscreen();
            setFullscreen(false);
        }
    };

    return (
        <div
            ref={frameRef}
            className={
                fullscreen
                    ? "plot-frame fullscreen"
                    : "plot-frame"
            }
        >
            <div className="plot-header">
                <h3>{title}</h3>

                <div className="plot-toolbar">
                    <button
                        type="button"
                        className={
                            panActive
                                ? "plot-tool active"
                                : "plot-tool"
                        }
                        title="Pan"
                        onClick={onPanToggle}
                    >
                        <Move size={14} />
                    </button>

                    <button
                        type="button"
                        className="plot-tool"
                        title="Reset view"
                        onClick={onReset}
                    >
                        <RotateCcw size={14} />
                    </button>

                    <button
                        type="button"
                        className="plot-tool"
                        title={
                            fullscreen
                                ? "Exit fullscreen"
                                : "Fullscreen"
                        }
                        onClick={toggleFullscreen}
                    >
                        {fullscreen ? (
                            <Minimize2 size={14} />
                        ) : (
                            <Maximize2 size={14} />
                        )}
                    </button>
                </div>
            </div>

            <div
                className={
                    panActive
                        ? "plot-canvas-area pan-active"
                        : "plot-canvas-area"
                }
            >
                {children}
            </div>
        </div>
    );
}

export default PlotFrame;