import React from 'react';
import { LightbulbIcon, QuoteIcon } from './ui/Icons';
import type { GenerationType } from '../types';

interface GenerationTypeSelectorProps {
    activeType: GenerationType;
    setActiveType: (type: GenerationType) => void;
}

export const GenerationTypeSelector: React.FC<GenerationTypeSelectorProps> = ({ activeType, setActiveType }) => {
    const isWord = activeType === 'Word';
    const isSaying = activeType === 'Saying';

    const commonButtonClass = "flex-1 p-2 text-center font-bold text-xs uppercase tracking-wider transition-colors duration-200 rounded-md relative z-10 flex items-center justify-evenly";

    return (
        <div className="relative flex items-center justify-center bg-brand-metal-dark p-1 rounded-md shadow-metal-inset w-48 h-10">
            {/* Sliding background */}
            <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-brand-secondary rounded-md shadow-inner transition-all duration-300 ease-in-out`}
                style={{
                    transform: isWord ? 'translateX(-50%)' : 'translateX(50%)',
                }}
            />
            <button
                onClick={() => setActiveType('Word')}
                className={`${commonButtonClass} ${isWord ? 'text-white' : 'text-brand-subtle hover:text-white'}`}
                aria-pressed={isWord}
            >
                <LightbulbIcon className="w-4 h-4" />
                <span>Word</span>
            </button>
            <button
                onClick={() => setActiveType('Saying')}
                className={`${commonButtonClass} ${isSaying ? 'text-white' : 'text-brand-subtle hover:text-white'}`}
                aria-pressed={isSaying}
            >
                <QuoteIcon className="w-4 h-4" />
                <span>Saying</span>
            </button>
        </div>
    );
};