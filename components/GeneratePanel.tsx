

import React from 'react';
import type { GenerationOptions, GenerationType } from '../types';
import { Card } from './ui/Card';
import { BeakerIcon } from './ui/Icons';
import { ModeSelector } from './ModeSelector';
import { GenerationTuningPanel } from './GenerationTuningPanel';
import { LANGUAGES } from '../constants';
import { Tooltip } from './ui/Tooltip';
import { GenerationTypeSelector } from './GenerationTypeSelector';


type AppMode = 'understand' | 'generate';

interface GeneratePanelProps {
    seedConcept: string;
    setSeedConcept: React.Dispatch<React.SetStateAction<string>>;
    generationOptions: GenerationOptions;
    setGenerationOptions: (options: GenerationOptions) => void;
    onGenerate: () => void;
    isLoading: boolean;
    activeMode: AppMode;
    setActiveMode: (mode: AppMode) => void;
    isSoundOn: boolean;
}

export const GeneratePanel: React.FC<GeneratePanelProps> = ({
    seedConcept,
    setSeedConcept,
    generationOptions,
    setGenerationOptions,
    onGenerate,
    isLoading,
    activeMode,
    setActiveMode,
    isSoundOn
}) => {

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setGenerationOptions({ ...generationOptions, language: e.target.value as GenerationOptions['language'] });
    };
    
    const handleGenTypeChange = (type: GenerationType) => {
        setGenerationOptions({ ...generationOptions, generationType: type });
    }

    return (
        <Card>
            <ModeSelector activeMode={activeMode} setActiveMode={setActiveMode} />
            <div className="p-4 md:p-6">
                <div className="border-2 border-brand-metal-dark rounded p-3 bg-brand-panel text-brand-panel-text shadow-metal-inset mb-4">
                     <div className="flex justify-between items-start gap-4">
                        <div>
                            <h2 className="text-xl font-bold font-display uppercase tracking-wider">Seed Concept</h2>
                            <p className="text-sm mt-1">
                                Give my Slang Synthesizer a spark of an idea.
                            </p>
                        </div>
                        <div className="flex-shrink-0 flex flex-col items-end gap-2">
                             <GenerationTypeSelector activeType={generationOptions.generationType} setActiveType={handleGenTypeChange} />
                             <Tooltip text="In what language should I invent this slang?">
                                <select
                                    id="gen-language"
                                    value={generationOptions.language}
                                    onChange={handleLanguageChange}
                                    disabled={isLoading}
                                    className="w-48 p-2 h-10 bg-brand-surface border-2 border-brand-metal-dark text-brand-text rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none transition duration-200 disabled:opacity-50 shadow-metal-inset font-sans text-sm"
                                    aria-label="Generation language"
                                >
                                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </Tooltip>
                        </div>
                    </div>
                </div>
                <div className="relative rounded-lg transition-shadow duration-200 focus-within:shadow-glow-primary">
                    <textarea
                        value={seedConcept}
                        onChange={(e) => setSeedConcept(e.target.value)}
                        placeholder="e.g., 'a cat who is also a DJ' or 'the specific sadness of a Sunday evening'..."
                        className="w-full h-24 p-3 rounded-lg focus:outline-none transition duration-200 resize-none crt-screen font-mono focus:ring-0 bg-[linear-gradient(rgba(46,255,115,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(46,255,115,0.05)_1px,transparent_1px),linear-gradient(rgba(46,255,115,0.03)_4px,transparent_4px),linear-gradient(90deg,rgba(46,255,115,0.03)_4px,transparent_4px)] bg-[length:50px_50px,50px_50px,10px_10px,10px_10px] focus:animate-circuit-pulse"
                        disabled={isLoading}
                        aria-label="Slang generation seed concept"
                    />
                </div>
                
                <div className="mt-4 text-sm p-4 rounded-lg bg-brand-crt-bg text-brand-crt-text/90 font-mono leading-relaxed border-2 border-brand-metal-dark shadow-metal-inset">
                    <p className="font-bold text-brand-text mb-2">++PRO-TIPS++</p>
                    <p>> The weirder the concept, the better the slang.</p>
                    <p className="mt-2">> Try combining two unrelated things, like "a sad lamp" or "spicy software".</p>
                    <p className="mt-2">> My synthesizer runs on pure imagination (and electricity).</p>
                </div>

                <div className="mt-6">
                     <button
                        onClick={onGenerate}
                        disabled={isLoading || !seedConcept}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 text-white font-bold rounded-lg shadow-metal transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none border-t-2 border-green-400 border-l-2 hover:shadow-glow-green active:translate-y-0 active:bg-green-500"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Inventing...</span>
                            </>
                        ) : (
                        <>
                            <BeakerIcon className="w-5 h-5" />
                            <span>Cook Up Slang</span>
                        </>
                        )}
                    </button>
                </div>
            </div>
            <div className="p-4 md:p-6 border-t-4 border-brand-border bg-brand-surface-alt/50 backdrop-blur-sm ring-1 ring-inset ring-brand-secondary/20 shadow-[inset_0_1px_4px_rgba(46,255,115,0.05)]">
                <GenerationTuningPanel 
                    options={generationOptions} 
                    setOptions={setGenerationOptions} 
                    isDisabled={isLoading} 
                    isSoundOn={isSoundOn}
                />
            </div>
        </Card>
    );
};