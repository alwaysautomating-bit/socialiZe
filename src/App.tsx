import React from 'react';
import { Layout } from './components/Layout';
import { ContentInput } from './components/ContentInput';
import { PlatformSelector } from './components/PlatformSelector';
import { ResultsDisplay } from './components/ResultsDisplay';
import { useOptimizer } from './hooks/useOptimizer';
import { useClipboard } from './hooks/useClipboard';

const App: React.FC = () => {
  const { state, setInputText, setSelectedPlatform, setSelectedTone, handleOptimize, canOptimize } = useOptimizer();
  const { copied, copyToClipboard } = useClipboard();

  const handleCopy = () => {
    if (state.result) {
      const tags = state.result.hashtags.map(t => t.startsWith('#') ? t : `#${t}`).join(' ');
      copyToClipboard(`${state.result.content}\n\n${tags}`);
    }
  };

  return (
    <Layout>
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
          isLoading={state.isLoading}
          canOptimize={canOptimize}
        />

        <ResultsDisplay
          result={state.result}
          isLoading={state.isLoading}
          copied={copied}
          onCopy={handleCopy}
        />
      </div>
    </Layout>
  );
};

export default App;
