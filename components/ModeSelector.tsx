
import React from 'react';
import { SearchIcon, LightbulbIcon } from './ui/Icons';

type AppMode = 'understand' | 'generate';

interface ModeSelectorProps {
    activeMode: AppMode;
    setActiveMode: (mode: AppMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ activeMode, setActiveMode }) => {
    const isUnderstand = activeMode === 'understand';
    const isGenerate = activeMode === 'generate';

    const commonButtonClass = "w-1/2 p-2.5 text-center font-bold uppercase tracking-wider transition-colors duration-200 rounded-md relative z-10 flex items-center justify-center gap-2";

    return (
        <div className="p-2 bg-brand-metal-dark/50 border-b-4 border-brand-border">
            <div className="relative flex items-center justify-center bg-brand-metal-dark p-1 rounded-md shadow-metal-inset">
                {/* Sliding background */}
                <div
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-brand-primary rounded-md shadow-inner transition-all duration-300 ease-in-out`}
                    style={{
                        transform: isUnderstand ? 'translateX(-50%)' : 'translateX(50%)',
                    }}
                />

                <button
                    onClick={() => setActiveMode('understand')}
                    className={`${commonButtonClass} ${isUnderstand ? 'text-white' : 'text-brand-subtle hover:text-white'}`}
                    aria-pressed={isUnderstand}
                >
                    <SearchIcon className="w-5 h-5" />
                    <span>Understand</span>
                </button>
                <button
                    onClick={() => setActiveMode('generate')}
                    className={`${commonButtonClass} ${isGenerate ? 'text-white' : 'text-brand-subtle hover:text-white'}`}
                    aria-pressed={isGenerate}
                >
                     <LightbulbIcon className="w-5 h-5" />
                    <span>Generate</span>
                </button>
            </div>
        </div>
    );
};