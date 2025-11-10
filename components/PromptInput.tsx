
import React, { useRef } from 'react';
import { AppMode } from '../types';
import { ImageIcon, FileTextIcon, SendIcon, XCircleIcon } from './icons';

interface PromptInputProps {
  mode: AppMode;
  prompt: string;
  setPrompt: (prompt: string) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  textFile: File | null;
  setTextFile: (file: File | null) => void;
  isLoading: boolean;
  onSubmit: () => void;
  clearInputs: () => void;
}

const PromptInput: React.FC<PromptInputProps> = ({
  mode,
  prompt,
  setPrompt,
  imageFile,
  setImageFile,
  textFile,
  setTextFile,
  isLoading,
  onSubmit,
  clearInputs,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const placeholderText: { [key in AppMode]: string } = {
    [AppMode.Image]: 'A futuristic cityscape with flying cars...',
    [AppMode.Vision]: 'What is in this image? Describe it in detail.',
    [AppMode.File]: 'Summarize this document in three bullet points.',
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const AttachmentPill: React.FC<{ file: File; onClear: () => void }> = ({ file, onClear }) => (
    <div className="absolute bottom-14 left-2 flex items-center gap-2 bg-purple-500/30 text-purple-200 text-xs px-2 py-1 rounded-full animate-fade-in">
      <span>{file.name}</span>
      <button onClick={onClear} className="hover:text-white transition-colors">
        <XCircleIcon className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="relative">
      {mode === AppMode.Vision && imageFile && <AttachmentPill file={imageFile} onClear={() => setImageFile(null)} />}
      {mode === AppMode.File && textFile && <AttachmentPill file={textFile} onClear={() => setTextFile(null)} />}

      <div className="flex items-center gap-2 bg-gray-800 border border-gray-600 rounded-xl p-2 shadow-inner focus-within:ring-2 focus-within:ring-purple-500 transition-all duration-200">
        {mode === AppMode.Vision && (
          <>
            <input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              className="hidden"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
            <button
              onClick={() => imageInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
              aria-label="Upload image"
            >
              <ImageIcon className="w-6 h-6" />
            </button>
          </>
        )}
        {mode === AppMode.File && (
          <>
            <input
              type="file"
              accept=".txt,.md,.js,.ts,.py,.html,.css,.json"
              ref={textInputRef}
              className="hidden"
              onChange={(e) => setTextFile(e.target.files?.[0] || null)}
            />
            <button
              onClick={() => textInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
              aria-label="Upload text file"
            >
              <FileTextIcon className="w-6 h-6" />
            </button>
          </>
        )}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText[mode]}
          rows={1}
          disabled={isLoading}
          className="flex-grow bg-transparent focus:outline-none resize-none disabled:opacity-50 text-gray-200 placeholder-gray-500"
          style={{ maxHeight: '100px', overflowY: 'auto' }}
        />
        <button
          onClick={onSubmit}
          disabled={isLoading || !prompt}
          className="p-2 rounded-lg bg-purple-600 text-white disabled:bg-gray-600 disabled:opacity-50 hover:bg-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500"
          aria-label="Submit prompt"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default PromptInput;
