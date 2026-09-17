import { useState } from "react";

import Header from "./components/layout/Header";
import GeneratorPanel from "./components/generator/GeneratorPanel";
import AnalyzerPanel from "./components/analyzer/AnalyzerPanel";

import {
  DEFAULT_SIGNAL,
  SAMPLE_RATE,
} from "./utils/constants";

function App() {
  const [signalConfig, setSignalConfig] =
    useState(DEFAULT_SIGNAL);

  const [samples, setSamples] =
    useState(null);

  const [sampleRate, setSampleRate] =
    useState(SAMPLE_RATE);

  const [windowType, setWindowType] =
    useState("hann");

  const handleSignalGenerated = (
    newSamples,
    newSampleRate = SAMPLE_RATE
  ) => {
    setSamples(newSamples);
    setSampleRate(newSampleRate);
  };

  return (
    <div className="app">
      <Header sampleRate={sampleRate} />

      <main className="app-layout">
        <GeneratorPanel
          config={signalConfig}
          samples={samples}
          sampleRate={sampleRate}
          onConfigChange={setSignalConfig}
          onSignalGenerated={handleSignalGenerated}
        />

        <AnalyzerPanel
          samples={samples}
          sampleRate={sampleRate}
          windowType={windowType}
          onWindowTypeChange={
            setWindowType
          }
        />
      </main>
    </div>
  );
}

export default App;