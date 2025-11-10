
import React from 'react';
import { AppMode } from '../types';
import { ImageIcon, EyeIcon, FileTextIcon } from './icons';

interface ModeSelectorProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const ModeButton: React.FC<{
    isActive: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}> = ({ isActive, onClick, icon, label }) => {
    const baseClasses = "flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
    const activeClasses = "bg-purple-600 text-white shadow-lg";
    const inactiveClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600";
    
    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
            {icon}
            {label}
        </button>
    )
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="flex justify-center items-center gap-2 md:gap-4 p-1 bg-gray-800 rounded-lg">
      <ModeButton 
        isActive={currentMode === AppMode.Image}
        onClick={() => onModeChange(AppMode.Image)}
        icon={<ImageIcon className="w-5 h-5" />}
        label="Image Gen"
      />
      <ModeButton 
        isActive={currentMode === AppMode.Vision}
        onClick={() => onModeChange(AppMode.Vision)}
        icon={<EyeIcon className="w-5 h-5" />}
        label="Vision"
      />
       <ModeButton 
        isActive={currentMode === AppMode.File}
        onClick={() => onModeChange(AppMode.File)}
        icon={<FileTextIcon className="w-5 h-5" />}
        label="Chat with File"
      />
    </div>
  );
};

export default ModeSelector;
