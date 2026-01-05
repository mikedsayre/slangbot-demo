import React, { useState, useEffect } from 'react';
import type { TuningOptions } from '../types';
import { TONES, FORMATS, RECIPIENT_PRESETS, LANGUAGES, AMPLIFIER_SOUNDS } from '../constants';
import { Tooltip } from './ui/Tooltip';
import { TuneIcon, QuestionCircleIcon, RadarIcon, DnaIcon, HeartPulseIcon } from './ui/Icons';
import { Dial } from './ui/Dial';
import { playSound } from '../services/audioService';

interface UnderstandingTuningPanelProps {
    options: TuningOptions;
    setOptions: (options: TuningOptions) => void;
    isDisabled: boolean;
    isSoundOn: boolean;
}

const LabelWithTooltip: React.FC<{htmlFor: string; label: string; tooltip: string;}> = ({htmlFor, label, tooltip}) => (
    <div className="flex items-center space-x-1.5 mb-2">
        <label htmlFor={htmlFor} className="block text-sm font-medium text-brand-subtle uppercase tracking-wider">
            {label}
        </label>
        <Tooltip text={tooltip}>
            <QuestionCircleIcon className="h-4 w-4 text-brand-subtle cursor-help" />
        </Tooltip>
    </div>
);


export const UnderstandingTuningPanel: React.FC<UnderstandingTuningPanelProps> = ({ options, setOptions, isDisabled, isSoundOn }) => {
    const isPresetPersona = (RECIPIENT_PRESETS as readonly string[]).includes(options.persona);
    const isCustomPersonaVisible = !isPresetPersona || options.persona === "Custom...";

    const [amplifiers, setAmplifiers] = useState({
        scanner: false,
        probe: false,
        analyzer: false,
    });

    const handleOptionChange = <K extends keyof TuningOptions,>(key: K, value: TuningOptions[K]) => {
        setOptions({ ...options, [key]: value });
    };
    
    const handlePersonaSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        handleOptionChange('persona', value === 'Custom...' ? '' : value);
    };

    const handleAmplifierToggle = (amp: keyof typeof amplifiers) => {
        const willBeOn = !amplifiers[amp];
        if (isSoundOn) {
            const sound = willBeOn ? AMPLIFIER_SOUNDS[amp].on : AMPLIFIER_SOUNDS[amp].off;
            playSound(sound);
        }
        setAmplifiers(prev => ({...prev, [amp]: willBeOn}));
    }

    const commonInputClass = "w-full p-2 bg-brand-panel border-2 border-brand-metal-dark text-brand-panel-text rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none transition duration-200 disabled:opacity-50 shadow-metal-inset";

    return (
        <div>
            <div className="border-2 border-brand-metal-dark rounded p-3 bg-brand-panel text-brand-panel-text shadow-metal-inset mb-6">
                <div className="flex items-center gap-3">
                    <TuneIcon className="w-8 h-8 text-brand-primary" />
                    <div>
                        <h3 className="text-xl font-bold font-display uppercase tracking-wider">Vibe Check Console</h3>
                        <p className="text-sm mt-1">
                            Calibrate the response parameters.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                {/* Dials */}
                <div className="grid grid-cols-2 gap-4 items-start justify-items-center md:col-span-2">
                    <Dial
                        id="complexity"
                        label="Intel Depth"
                        tooltip="How deep should I go? 'Shallow' for a quick scan, 'Deep' for a full core dump. Go to 11 for a scholarly dissertation!"
                        min={1}
                        max={11}
                        step={1}
                        value={options.complexity}
                        onChange={(val) => handleOptionChange('complexity', val)}
                        disabled={isDisabled}
                        startLabel="Shallow"
                        endLabel="Deep"
                    />
                    <Dial
                        id="verbosity"
                        label="Data Stream"
                        tooltip="How much should I say? From a quick 'TL;DR' to a full 'Essay'. Go to 11 for the unabridged director's cut."
                        min={1}
                        max={11}
                        step={1}
                        value={options.verbosity}
                        onChange={(val) => handleOptionChange('verbosity', val)}
                        disabled={isDisabled}
                        startLabel="TL;DR"
                        endLabel="Essay"
                    />
                </div>

                {/* Persona */}
                 <div className="space-y-2">
                    <LabelWithTooltip htmlFor="persona" label="Recipient Profile" tooltip="Who am I talking to? This changes the context and style of my explanation." />
                    <select
                        id="persona-select"
                        value={isPresetPersona ? options.persona : 'Custom...'}
                        onChange={handlePersonaSelectChange}
                        disabled={isDisabled}
                        className={commonInputClass}
                    >
                        {RECIPIENT_PRESETS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {isCustomPersonaVisible && (
                         <input
                            id="persona-input"
                            type="text"
                            placeholder="e.g., A film noir detective"
                            value={isPresetPersona ? '' : options.persona}
                            onChange={(e) => handleOptionChange('persona', e.target.value)}
                            disabled={isDisabled}
                            className={`${commonInputClass} mt-2`}
                            autoFocus
                        />
                    )}
                </div>


                {/* Tone */}
                <div>
                    <LabelWithTooltip htmlFor="tone" label="Tonal Matrix" tooltip="Set the vibe for the explanation. 'Sassy & Fun' for my usual personality, 'Scholarly' for a serious take." />
                    <select
                        id="tone"
                        value={options.tone}
                        onChange={(e) => handleOptionChange('tone', e.target.value as TuningOptions['tone'])}
                        disabled={isDisabled}
                        className={commonInputClass}
                    >
                        {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                 {/* Language */}
                <div>
                    <LabelWithTooltip htmlFor="language" label="Response Language" tooltip="In what language should I explain the slang? 'Auto-Detect' will try to use the language of the slang term itself." />
                    <select
                        id="language"
                        value={options.language}
                        onChange={(e) => handleOptionChange('language', e.target.value as TuningOptions['language'])}
                        disabled={isDisabled}
                        className={commonInputClass}
                    >
                        {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                </div>


                {/* Format */}
                <div>
                    <LabelWithTooltip htmlFor="format" label="Output Format" tooltip="How should the tea be served? As a flowing 'Paragraph', quick 'Bullet Points', or something more structured?" />
                    <select
                        id="format"
                        value={options.format}
                        onChange={(e) => handleOptionChange('format', e.target.value as TuningOptions['format'])}
                        disabled={isDisabled}
                        className={commonInputClass}
                    >
                        {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>
                
                {/* Negative Prompt */}
                <div className="md:col-span-2">
                    <LabelWithTooltip htmlFor="negativePrompt" label="No-Go Zone" tooltip="What topics, words, or concepts should I absolutely avoid in my explanation?" />
                    <input
                        id="negativePrompt"
                        type="text"
                        placeholder="e.g., swearing, politics"
                        value={options.negativePrompt}
                        onChange={(e) => handleOptionChange('negativePrompt', e.target.value)}
                        disabled={isDisabled}
                        className={commonInputClass}
                    />
                </div>

                {/* Cognitive Amplifiers */}
                <div className="md:col-span-2 mt-8 pt-6 border-t-2 border-dashed border-brand-metal-dark/50">
                     <div className="flex items-center space-x-2 mb-4">
                        <label className="block text-sm font-medium text-brand-subtle uppercase tracking-wider">
                            Cognitive Amplifiers
                        </label>
                        <Tooltip text="Engage these optional sub-systems to enhance the contextual analysis. Or just press them because the buttons are fun. Your call.">
                            <QuestionCircleIcon className="h-4 w-4 text-brand-subtle cursor-help" />
                        </Tooltip>
                    </div>
                     <div className="grid grid-cols-3 gap-4 justify-items-center text-center">
                        <Tooltip text="Scans the social matrix for related memes and viral context. May cause a slight buzzing sound.">
                             <button
                                onClick={() => handleAmplifierToggle('scanner')}
                                disabled={isDisabled}
                                className={`w-24 h-10 flex items-center justify-center gap-2 rounded-md transition-all duration-300 shadow-metal border-2 ${amplifiers.scanner ? 'bg-sky-500 text-white border-sky-300' : 'bg-brand-surface-alt text-brand-subtle border-brand-metal-dark hover:border-sky-400 hover:text-white'}`}
                            >
                                <RadarIcon className={`w-5 h-5 ${amplifiers.scanner ? 'animate-pulse' : ''}`}/>
                                <span className="text-xs font-mono">Scanner</span>
                            </button>
                        </Tooltip>
                         <Tooltip text="Traces the word's linguistic DNA through etymological databases. Results may vary.">
                             <button
                                onClick={() => handleAmplifierToggle('probe')}
                                disabled={isDisabled}
                                className={`w-24 h-10 flex items-center justify-center gap-2 rounded-md transition-all duration-300 shadow-metal border-2 ${amplifiers.probe ? 'bg-purple-600 text-white border-purple-400' : 'bg-brand-surface-alt text-brand-subtle border-brand-metal-dark hover:border-purple-500 hover:text-white'}`}
                            >
                                <DnaIcon className={`w-5 h-5 ${amplifiers.probe ? 'animate-spin' : ''}`} style={{animationDuration: '3s'}}/>
                                <span className="text-xs font-mono">Probe</span>
                            </button>
                        </Tooltip>
                         <Tooltip text="Gauges the emotional 'vibe' of the slang, from positive to negative. Accuracy is not guaranteed.">
                             <button
                                onClick={() => handleAmplifierToggle('analyzer')}
                                disabled={isDisabled}
                                className={`w-24 h-10 flex items-center justify-center gap-2 rounded-md transition-all duration-300 shadow-metal border-2 ${amplifiers.analyzer ? 'bg-rose-500 text-white border-rose-300' : 'bg-brand-surface-alt text-brand-subtle border-brand-metal-dark hover:border-rose-400 hover:text-white'}`}
                            >
                                <HeartPulseIcon className={`w-5 h-5 ${amplifiers.analyzer ? 'animate-ping' : ''}`} style={{animationDuration: '1.5s'}}/>
                                <span className="text-xs font-mono">Analyzer</span>
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    );
};