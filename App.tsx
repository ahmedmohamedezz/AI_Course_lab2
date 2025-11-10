
import React, { useState, useCallback } from 'react';
import { AppMode, ResultData } from './types';
import * as geminiService from './services/geminiService';
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import PromptInput from './components/PromptInput';
import ResultDisplay from './components/ResultDisplay';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.Image);
  const [prompt, setPrompt] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [textFile, setTextFile] = useState<File | null>(null);

  const [result, setResult] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setPrompt('');
    setImageFile(null);
    setTextFile(null);
    setResult(null);
  };
  
  const clearInputs = () => {
      setPrompt('');
      setImageFile(null);
      setTextFile(null);
  }

  const handleSubmit = useCallback(async () => {
    if (isLoading || !prompt) return;

    setIsLoading(true);
    setResult(null);

    try {
      let response: ResultData | null = null;
      switch (mode) {
        case AppMode.Image:
          response = await geminiService.generateImage(prompt);
          break;
        case AppMode.Vision:
          if (!imageFile) throw new Error('Please upload an image to analyze.');
          response = await geminiService.getVisionResponse(prompt, imageFile);
          break;
        case AppMode.File:
          if (!textFile) throw new Error('Please upload a file to chat with.');
          response = await geminiService.chatWithFile(prompt, textFile);
          break;
        default:
          throw new Error('Invalid application mode selected.');
      }
      setResult(response);
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred.';
      setResult({ type: 'error', content: errorMessage });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, mode, imageFile, textFile, isLoading]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="flex-grow overflow-auto p-4 md:p-6">
        <ResultDisplay isLoading={isLoading} result={result} />
      </main>
      <footer className="sticky bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 p-4">
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-4">
          <ModeSelector currentMode={mode} onModeChange={handleModeChange} />
          <PromptInput
            mode={mode}
            prompt={prompt}
            setPrompt={setPrompt}
            imageFile={imageFile}
            setImageFile={setImageFile}
            textFile={textFile}
            setTextFile={setTextFile}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            clearInputs={clearInputs}
          />
        </div>
      </footer>
    </div>
  );
};

export default App;
