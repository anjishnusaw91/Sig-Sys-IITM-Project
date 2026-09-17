function Header({ sampleRate }) {
    return (
        <header className="header">
            <div className="header-brand">
                <div className="header-title-row">
                    <h1>SIGNAL LAB</h1>
                </div>

                <p>
                    Waveform generation · Signal analysis ·
                    Time / Frequency / STFT
                </p>
            </div>

            <div className="header-info">
                <div className="header-info-item">
                    <span>Sample Rate</span>
                    <strong>
                        {(sampleRate / 1000).toFixed(1)} kHz
                    </strong>
                </div>

                <div className="header-divider" />

                <div className="header-info-item">
                    <span>Format</span>
                    <strong>FLOAT32</strong>
                </div>
            </div>
        </header>
    );
}

export default Header;