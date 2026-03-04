import React from 'react';
import { Layout } from './components/Layout';
import { ContentInput } from './components/ContentInput';
import { PlatformSelector } from './components/PlatformSelector';
import { ResultsDisplay } from './components/ResultsDisplay';
import { useOptimizer } from './hooks/useOptimizer';
import { useClipboard } from './hooks/useClipboard';

const App: React.FC = () => {
  const {
    state,
    setInputText,
    setSelectedPlatform,
    setSelectedTone,
    setActiveResultIndex,
    handleOptimize,
    handleOptimizeAll,
    canOptimize,
    canOptimizeAll,
  } = useOptimizer();
  const { copied, copyToClipboard } = useClipboard();

  const handleCopy = () => {
    const resultToCopy = state.allResults
      ? (state.allResults[state.activeResultIndex] ?? state.allResults[0])
      : state.result;
    if (resultToCopy) {
      const tags = resultToCopy.hashtags.map(t => t.startsWith('#') ? t : `#${t}`).join(' ');
      copyToClipboard(`${resultToCopy.content}\n\n${tags}`);
    }
  };

  const isAwake = state.selectedPlatform !== null;

  return (
    <Layout isAwake={isAwake}>
      <div className="flex flex-col space-y-12">
        <ContentInput
          inputText={state.inputText}
          onInputChange={setInputText}
          selectedTone={state.selectedTone}
          onToneChange={setSelectedTone}
          error={state.error}
          onRetry={state.error?.retryable ? handleOptimize : undefined}
        />

        <PlatformSelector
          selectedPlatform={state.selectedPlatform}
          onPlatformSelect={setSelectedPlatform}
          onOptimize={handleOptimize}
          onOptimizeAll={handleOptimizeAll}
          isLoading={state.isLoading}
          isLoadingAll={state.isLoadingAll}
          canOptimize={canOptimize}
          canOptimizeAll={canOptimizeAll}
        />

        <ResultsDisplay
          result={state.result}
          allResults={state.allResults}
          activeResultIndex={state.activeResultIndex}
          onSelectResult={setActiveResultIndex}
          isLoading={state.isLoading}
          isLoadingAll={state.isLoadingAll}
          copied={copied}
          onCopy={handleCopy}
        />
      </div>
    </Layout>
  );
};

export default App;
