

import React, { useState, useEffect } from 'react';
import type { GenerationOptions, FormalityStylePreset } from '../types';
import { ERAS, WORD_STYLES, FORMALITY_STYLES, MOD_SOUNDS } from '../constants';
import { Tooltip } from './ui/Tooltip';
import { BeakerIcon, QuestionCircleIcon, BlurOnIcon, TrendingUpIcon, WaterDropIcon, EmergencyIcon } from './ui/Icons';
import { Dial } from './ui/Dial';
import { playSound } from '../services/audioService';

interface GenerationTuningPanelProps {
    options: GenerationOptions;
    setOptions: (options: GenerationOptions) => void;
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


export const GenerationTuningPanel: React.FC<GenerationTuningPanelProps> = ({ options, setOptions, isDisabled, isSoundOn }) => {
    const isPresetEra = (ERAS as readonly string[]).includes(options.era);
    const isCustomEraVisible = !isPresetEra || options.era === "Custom...";

    const isPresetWordStyle = (WORD_STYLES as readonly string[]).includes(options.wordStyle);
    const isCustomWordStyleVisible = !isPresetWordStyle || options.wordStyle === "Custom...";
    
    const isPresetFormality = (FORMALITY_STYLES as readonly string[]).includes(options.formality);
    const isCustomFormalityVisible = !isPresetFormality || options.formality === "Custom...";

    const [mods, setMods] = useState({
        quantumFlux: false,
        hyperbole: false,
        deionizer: false,
        nonsense: false,
    });
    const [glitchingMod, setGlitchingMod] = useState<string | null>(null);
    const [clickCounts, setClickCounts] = useState({ nonsense: 0 });

    // Effect for random, chaotic mod deactivation
    useEffect(() => {
        const interval = setInterval(() => {
            const activeMods = (Object.keys(mods) as Array<keyof typeof mods>).filter(k => mods[k]);
            if (activeMods.length === 0 || glitchingMod) return;

            // 15% chance to glitch every 5 seconds
            if (Math.random() < 0.15) {
                const modToGlitch = activeMods[Math.floor(Math.random() * activeMods.length)];
                setGlitchingMod(modToGlitch); // Trigger visual glitch animation
                
                // After the animation, turn the mod off
                setTimeout(() => {
                    setMods(prev => ({ ...prev, [modToGlitch]: false }));
                    setGlitchingMod(null);
                    if (isSoundOn) playSound(MOD_SOUNDS[modToGlitch].off);
                }, 600); // 3 * 200ms flicker animation
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [mods, glitchingMod, isSoundOn]);


    const handleOptionChange = <K extends keyof GenerationOptions,>(key: K, value: GenerationOptions[K]) => {
        setOptions({ ...options, [key]: value });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, field: 'era' | 'wordStyle' | 'formality') => {
        const value = e.target.value;
        handleOptionChange(field, value === 'Custom...' ? '' : value);
    };
    
    const handleModToggle = (mod: keyof typeof mods) => {
        const willBeOn = !mods[mod];
        if (isSoundOn) {
            const sound = willBeOn ? MOD_SOUNDS[mod].on : MOD_SOUNDS[mod].off;
            playSound(sound);
        }
        if (mod === 'nonsense') {
            setClickCounts(prev => ({...prev, nonsense: willBeOn ? prev.nonsense + 1 : 0 }));
        }
        setMods(prev => ({...prev, [mod]: willBeOn}));
    };
    
    let nonsenseAnimationClass = '';
    if (mods.nonsense) {
        nonsenseAnimationClass = clickCounts.nonsense > 4 ? 'animate-shake' : 'animate-pulse';
    }

    const commonInputClass = "w-full p-2 bg-brand-panel border-2 border-brand-metal-dark text-brand-panel-text rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none transition duration-200 disabled:opacity-50 shadow-metal-inset";

    return (
        <div>
            <div className="border-2 border-brand-metal-dark rounded p-3 bg-brand-panel text-brand-panel-text shadow-metal-inset mb-6">
                <div className="flex items-center gap-3">
                    <BeakerIcon className="w-8 h-8 text-brand-secondary" />
                    <div>
                        <h3 className="text-xl font-bold font-display uppercase tracking-wider">Slang Synthesizer</h3>
                        <p className="text-sm mt-1 text-brand-secondary/80 font-mono">
                            // INVENTI0N_ENGINE_CONTROLS //
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                {/* Dials */}
                 <div className="grid grid-cols-2 gap-4 items-start justify-items-center md:col-span-2">
                    <Dial
                        id="creativity"
                        label="Creativity"
                        tooltip="Controls my creative core. 'Plausible' for grounded ideas, 'Absurd' for pure chaos. Crank it to 11 for maximum weirdness."
                        min={1}
                        max={11}
                        step={1}
                        value={options.creativity}
                        onChange={(val) => handleOptionChange('creativity', val)}
                        disabled={isDisabled}
                        startLabel="Plausible"
                        endLabel="Absurd"
                    />
                    <Dial
                        id="humor"
                        label="Humor"
                        tooltip="Adjusts my humor circuits. 'Deadpan' for dry wit, 'Absurd' for goofy, chaotic results. Go on, make me laugh."
                        min={1}
                        max={11}
                        step={1}
                        value={options.humor}
                        onChange={(val) => handleOptionChange('humor', val)}
                        disabled={isDisabled}
                        startLabel="Deadpan"
                        endLabel="Absurd"
                    />
                </div>


                {/* Era */}
                <div className="md:col-span-1">
                    <LabelWithTooltip htmlFor="era" label="Era / Genre" tooltip="What time period or subculture should this slang come from? This sets the theme." />
                     <select
                        id="era"
                        value={isPresetEra ? options.era : 'Custom...'}
                        onChange={(e) => handleSelectChange(e, 'era')}
                        disabled={isDisabled}
                        className={commonInputClass}
                    >
                        {ERAS.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                    {isCustomEraVisible && (
                        <input
                            id="era-input"
                            type="text"
                            placeholder="e.g., Pirate Captain"
                            value={isPresetEra ? '' : options.era}
                            onChange={(e) => handleOptionChange('era', e.target.value)}
                            disabled={isDisabled}
                            className={`${commonInputClass} mt-2`}
                            autoFocus
                        />
                    )}
                </div>

                {/* Word Style */}
                <div className="md:col-span-1">
                    <LabelWithTooltip htmlFor="wordStyle" label="Word Style" tooltip="What kind of word should be created? 'Catchy & Short' for something viral, or 'Weird & Complex' for a mouthful." />
                     <select
                        id="wordStyle"
                        value={isPresetWordStyle ? options.wordStyle : 'Custom...'}
                        onChange={(e) => handleSelectChange(e, 'wordStyle')}
                        disabled={isDisabled}
                        className={commonInputClass}
                    >
                        {WORD_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {isCustomWordStyleVisible && (
                        <input
                            id="wordStyle-input"
                            type="text"
                            placeholder="e.g., A single onomatopoeia"
                            value={isPresetWordStyle ? '' : options.wordStyle}
                            onChange={(e) => handleOptionChange('wordStyle', e.target.value)}
                            disabled={isDisabled}
                            className={`${commonInputClass} mt-2`}
                            autoFocus
                        />
                    )}
                </div>
                
                {/* Formality */}
                <div className="md:col-span-2">
                    <LabelWithTooltip htmlFor="formality" label="Formality" tooltip="What's the social context? Is this something you'd say to your boss, or shout at a concert?" />
                     <select
                        id="formality"
                        value={isPresetFormality ? options.formality : 'Custom...'}
                        onChange={(e) => handleSelectChange(e, 'formality')}
                        disabled={isDisabled}
                        className={commonInputClass}
                    >
                        {FORMALITY_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                     {isCustomFormalityVisible && (
                        <input
                            id="formality-input"
                            type="text"
                            placeholder="e.g., Slang for a royal court"
                            value={isPresetFormality ? '' : options.formality}
                            onChange={(e) => handleOptionChange('formality', e.target.value as FormalityStylePreset)}
                            disabled={isDisabled}
                            className={`${commonInputClass} mt-2`}
                            autoFocus
                        />
                    )}
                </div>

                 {/* Experimental Mods */}
                <div className="md:col-span-2 mt-8 pt-6 border-t-2 border-dashed border-brand-metal-dark/50">
                    <div className="flex items-center space-x-2 mb-4">
                        <label className="block text-sm font-medium text-brand-subtle uppercase tracking-wider">
                            Duct-Taped Mods
                        </label>
                        <Tooltip text="These experimental, highly unstable calibrators are bolted directly onto the core logic. Their effects are... unpredictable. Use with caution. And enthusiasm.">
                            <QuestionCircleIcon className="h-4 w-4 text-brand-subtle cursor-help" />
                        </Tooltip>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center text-center">
                        <Tooltip text="Tries to align the slang with the sub-atomic quantum foam of the zeitgeist. Sometimes it just makes the lights flicker and turns itself off. Highly unreliable.">
                            <button
                                onClick={() => handleModToggle('quantumFlux')}
                                className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-metal border-4 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    mods.quantumFlux 
                                    ? 'bg-purple-600 border-purple-400 text-white' 
                                    : 'bg-brand-surface-alt border-brand-metal-dark text-brand-subtle hover:border-purple-500 hover:text-white'
                                } ${glitchingMod === 'quantumFlux' ? 'animate-fast-flicker' : ''}`}
                                disabled={isDisabled}
                            >
                                <BlurOnIcon className={`w-8 h-8 transition-all ${mods.quantumFlux ? 'animate-pulse' : ''}`} />
                                <span className="text-xs mt-1 font-mono">Q-Flux</span>
                            </button>
                        </Tooltip>
                        
                        <Tooltip text="WARNING: Engaging the hyperbole matrix may cause uncontrollable exaggeration. The 'off' switch has a 50/50 chance of actually working.">
                            <button
                                onClick={() => handleModToggle('hyperbole')}
                                className={`w-20 h-20 rounded-lg flex flex-col items-center justify-center transition-all duration-300 shadow-metal border-4 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    mods.hyperbole 
                                    ? 'bg-amber-500 border-amber-300 text-white' 
                                    : 'bg-brand-surface-alt border-brand-metal-dark text-brand-subtle hover:border-amber-400 hover:text-white'
                                } ${glitchingMod === 'hyperbole' ? 'animate-fast-flicker' : ''}`}
                                disabled={isDisabled}
                            >
                                <TrendingUpIcon className={`w-8 h-8 transition-all ${mods.hyperbole ? 'animate-bounce' : ''}`} />
                                <span className="text-xs mt-1 font-mono">Hyper</span>
                            </button>
                        </Tooltip>

                        <Tooltip text="A de-cringer. We think. The semantic ion filter is held in place with a paperclip and a prayer. It buzzes ominously when active.">
                            <button
                                onClick={() => handleModToggle('deionizer')}
                                className={`w-20 h-20 flex flex-col items-center justify-center transition-all duration-300 shadow-metal border-4 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${
                                    mods.deionizer 
                                    ? 'bg-sky-500 border-sky-300 text-white' 
                                    : 'bg-brand-surface-alt border-brand-metal-dark text-brand-subtle hover:border-sky-400 hover:text-white'
                                } ${glitchingMod === 'deionizer' ? 'animate-fast-flicker' : ''}`}
                                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                                disabled={isDisabled}
                            >
                                {mods.deionizer && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>}
                                <WaterDropIcon className="w-8 h-8" />
                                <span className="text-xs mt-1 font-mono">De-Ion</span>
                            </button>
                        </Tooltip>
                        
                        <Tooltip text="Injects pure, unadulterated nonsense. What happens if you keep pressing it? Probably nothing bad. Probably.">
                            <button
                                onClick={() => handleModToggle('nonsense')}
                                className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-metal border-4 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    mods.nonsense 
                                    ? 'bg-brand-primary border-orange-300 text-white' 
                                    : 'bg-brand-surface-alt border-brand-metal-dark text-brand-subtle hover:border-brand-primary hover:text-white'
                                } ${nonsenseAnimationClass} ${glitchingMod === 'nonsense' ? 'animate-fast-flicker' : ''}`}
                                disabled={isDisabled}
                            >
                                <EmergencyIcon className="w-8 h-8" />
                                <span className="text-xs mt-1 font-mono">Inject</span>
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    );
};