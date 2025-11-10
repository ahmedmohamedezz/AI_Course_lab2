
import React from 'react';
import { SparklesIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 shadow-md">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 flex items-center justify-center gap-2">
          <SparklesIcon className="w-7 h-7" />
          <span>Gemini Creative Suite</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
