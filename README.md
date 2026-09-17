# Signal Lab — Signal & Systems IITM Project

A web-based signal generator and DSP analyzer developed as part of the
Signal & Systems course project at IIT Madras.

Signal Lab allows users to generate standard continuous-time-inspired
discrete signals, visualize them in the time domain, analyze their
frequency-domain representation using the Fast Fourier Transform (FFT),
and study time-varying frequency content using the Short-Time Fourier
Transform (STFT).

The application also supports audio-file analysis, browser playback,
and WAV export.

---

## Features

### Signal Generation

Signal Lab supports:

- Sine waves
- Square waves
- Triangle waves
- Chirp signals
- Sinc signals

Configurable parameters include:

- Frequency
- Start/end frequency for chirps
- Amplitude
- Duration
- Duty cycle for square waves

The default generated sampling rate is:

```text
Fs = 44.1 kHz
```

### Signal Analysis

Generated or uploaded signals can be analyzed through:

#### Time Domain

Displays the amplitude of the signal as a function of time.

#### Frequency Domain

Uses an FFT-based spectrum analyzer to display the one-sided magnitude
spectrum.

Supported analysis windows:

- Rectangular
- Hann
- Hamming
- Blackman

The analyzer applies windowing and coherent-gain correction for the
displayed one-sided amplitude spectrum.

#### STFT / Spectrogram

The Short-Time Fourier Transform provides a time-frequency
representation of the signal.

Current configuration:

```text
Window size : 1024 samples
Hop size    : 256 samples
```

The spectrogram is particularly useful for signals whose frequency
changes over time, such as chirps.

### Signal Statistics

For the currently analyzed signal, Signal Lab calculates:

- RMS
- Peak amplitude
- DC / Mean

It also displays signal metadata including:

- Sampling frequency
- Nyquist frequency
- Number of samples
- Signal duration

### Audio Support

The application can decode locally selected audio files using the
browser's Web Audio API.

Uploaded audio is:

- Decoded by the browser.
- Converted to a mono signal when necessary.
- Passed to the same analysis pipeline used for generated signals.
- Analyzed using its actual sampling rate.

The application also provides:

- Browser playback
- Stop control
- WAV export

---

## System Architecture

### Software Architecture

The project is organized into separate layers for the user interface,
DSP algorithms, audio processing, and shared utilities.

```text
src/
│
├── audio/
│   ├── audioPlayer.js
│   ├── audioDecoder.js
│   └── wavExporter.js
│
├── components/
│   ├── analyzer/
│   │   ├── AnalyzerPanel.jsx
│   │   ├── AnalyzerMeta.jsx
│   │   ├── FrequencyDomainPlot.jsx
│   │   ├── PlotFrame.jsx
│   │   ├── SignalStats.jsx
│   │   ├── Spectrogram.jsx
│   │   └── TimeDomainPlot.jsx
│   │
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Panel.jsx
│   │   └── StatBadge.jsx
│   │
│   ├── generator/
│   │   ├── GeneratorPanel.jsx
│   │   ├── ParameterControl.jsx
│   │   └── WaveformSelector.jsx
│   │
│   ├── layout/
│   │   ├── AppShell.jsx
│   │   └── Header.jsx
│   │
│   └── ui/
│       └── VivaCheatSheet.jsx
│
├── dsp/
│   ├── fft.js
│   ├── metrics.js
│   ├── signalGenerator.js
│   ├── spectrum.js
│   ├── stft.js
│   └── windows.js
│
├── utils/
│   └── constants.js
│
├── App.jsx
├── main.jsx
└── index.css
```

### DSP Pipeline

The core processing pipeline can be summarized as:

```text
             Input Signal
                  │
        ┌─────────┴─────────┐
        │                   │
   Generated Signal     Audio File
        │                   │
        │              Audio Decoder
        │                   │
        └─────────┬─────────┘
                  │
             Sample Array
                  │
        ┌─────────┼─────────┐
        │         │         │
       RMS       FFT       STFT
        │         │         │
        │      Windowing    │
        │         │      Windowing
        │         │         │
        │    Magnitude      │
        │    Spectrum       │
        │         │         │
        └─────────┼─────────┘
                  │
             Visualization
                  │
        ┌─────────┼─────────┐
        │         │         │
     Time Plot  Spectrum  Spectrogram
```

---

## FFT Implementation

The frequency-domain analyzer uses an iterative radix-2
Cooley–Tukey FFT implementation.

For an input containing N samples, the application selects the next
power-of-two FFT size when required.

The frequency resolution is:

```text
Δf = Fs / N
```

For example, with:

```text
Fs = 44100 Hz
N  = 65536
```

the frequency resolution is approximately:

```text
Δf ≈ 0.673 Hz
```

The displayed spectrum is limited to the positive-frequency half of
the FFT.

---

## STFT

The STFT divides the signal into overlapping short-time frames.

For the current implementation:

```text
Window size = 1024 samples
Hop size    = 256 samples
Fs          = 44100 Hz
```

The frequency resolution is:

```text
Δf = Fs / 1024
   ≈ 43.07 Hz
```

The time separation between consecutive STFT frames is:

```text
Δt = 256 / 44100
   ≈ 5.80 ms
```

This provides a time-frequency representation suitable for observing
signals such as chirps.

---

## Windowing

The frequency-domain analyzer supports four window functions:

- Rectangular
- Hann
- Hamming
- Blackman

Windowing reduces spectral leakage caused by analyzing a finite-length
segment of a signal.

Different windows provide different trade-offs between:

- Main-lobe width
- Sidelobe attenuation
- Frequency resolution
- Spectral leakage

The application allows these effects to be observed directly in the
frequency-domain visualization.

---

## Validation

The implementation was tested using analytically predictable signals.

### Sine Wave

For a sinusoid with amplitude A:

```text
RMS = A / √2
```

For:

```text
A = 0.8
```

the expected RMS is approximately:

```text
0.5657
```

### Square Wave

For a symmetric 50% duty-cycle square wave:

```text
RMS = A
```

For:

```text
A = 0.8
```

the expected RMS is:

```text
0.8
```

### Triangle Wave

For a symmetric triangle wave:

```text
RMS = A / √3
```

For:

```text
A = 0.8
```

the expected RMS is approximately:

```text
0.4619
```

### Chirp

A chirp signal was tested using:

```text
Start frequency = 200 Hz
End frequency   = 3000 Hz
Duration        = 1 s
```

The resulting spectrogram exhibits the expected time-varying
frequency trajectory.

### Audio Input

Audio files were tested to verify that:

- The decoded sampling rate is preserved.
- Nyquist frequency is calculated from the actual sampling rate.
- Signal duration is calculated from the decoded sample count.
- The same DSP analysis pipeline can process uploaded audio.

---

## Technology Stack

- React
- Vite
- JavaScript
- HTML5 Canvas
- Web Audio API
- Lucide React
- FFT / DSP algorithms implemented in JavaScript

No external DSP server is required. Signal generation and analysis are
performed client-side in the browser.

---

## Running Locally

### Requirements

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/anjishnusaw91/Sig-Sys-IITM-Project.git
cd Sig-Sys-IITM-Project
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application can then be opened using the local URL displayed by
Vite.

### Production Build

Create a production build with:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Deployment

The application is designed to be deployed as a static frontend.

Recommended deployment configuration:

```text
Framework       : Vite
Build Command   : npm run build
Output Directory: dist
```

The project can be deployed through Vercel with GitHub integration.

---

## Project Context

This project was developed for the Signal & Systems course project
(SP24) at IIT Madras.

The project focuses on applying fundamental DSP concepts through an
interactive web-based signal generation and analysis environment.

---

## Author

**Anjishnu Saw**
Signal & Systems — IIT Madras

---

## License

This project is intended for academic and educational use.