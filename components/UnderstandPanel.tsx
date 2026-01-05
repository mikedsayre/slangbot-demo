import React from 'react';
import type { TuningOptions } from '../types';
import { UnderstandingTuningPanel } from './UnderstandingTuningPanel';
import { Card } from './ui/Card';
import { MicrophoneIcon, SparklesIcon } from './ui/Icons';
import { ModeSelector } from './ModeSelector';

// Extend the Window interface to include SpeechRecognition properties for browsers that support it.
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type AppMode = 'understand' | 'generate';

interface UnderstandPanelProps {
    userInput: string;
    setUserInput: React.Dispatch<React.SetStateAction<string>>;
    tuningOptions: TuningOptions;
    setTuningOptions: (options: TuningOptions) => void;
    onGenerate: () => void;
    isLoading: boolean;
    isSpeechRecognitionSupported: boolean;
    activeMode: AppMode;
    setActiveMode: (mode: AppMode) => void;
    isSoundOn: boolean;
}

export const UnderstandPanel: React.FC<UnderstandPanelProps> = ({
    userInput,
    setUserInput,
    tuningOptions,
    setTuningOptions,
    onGenerate,
    isLoading,
    isSpeechRecognitionSupported,
    activeMode,
    setActiveMode,
    isSoundOn
}) => {
    const [isListening, setIsListening] = React.useState(false);
    const recognitionRef = React.useRef<any>(null);

    React.useEffect(() => {
        if (!isSpeechRecognitionSupported) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                 setUserInput(prev => (prev.trim() ? prev + ' ' : '') + finalTranscript.trim());
            }
        };

        return () => { if (recognition) recognition.stop(); };
    }, [isSpeechRecognitionSupported, setUserInput]);

    const handleToggleListening = () => {
        if (isLoading || !isSpeechRecognitionSupported) return;
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
    };

    return (
        <Card>
            <ModeSelector activeMode={activeMode} setActiveMode={setActiveMode} />
            <div className="p-4 md:p-6">
                <div className="border-2 border-brand-metal-dark rounded p-3 bg-brand-panel text-brand-panel-text shadow-metal-inset mb-4">
                    <h2 className="text-xl font-bold font-display uppercase tracking-wider">Input Receiver</h2>
                    <p className="text-sm mt-1">
                        Add the slang you heard and I'll decipher it.
                    </p>
                </div>
                <div className="relative rounded-lg transition-shadow duration-200 focus-within:shadow-glow-primary">
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="e.g., 'What does it mean to be chronically online?'"
                        className="w-full h-48 p-3 pr-12 rounded-lg focus:outline-none transition duration-200 resize-none crt-screen font-mono focus:ring-0 bg-[linear-gradient(rgba(100,150,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(100,150,255,0.1)_1px,transparent_1px)] bg-[length:25px_25px] focus:animate-blueprint-scroll"
                        disabled={isLoading}
                        aria-label="Slang input"
                    />
                    {isSpeechRecognitionSupported && (
                        <button
                            onClick={handleToggleListening}
                            disabled={isLoading}
                            title={isListening ? "Stop listening" : "Start listening"}
                            className={`absolute bottom-3 right-3 p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                                isListening
                                ? 'bg-brand-primary/20 text-brand-primary animate-pulse'
                                : 'bg-transparent text-brand-subtle hover:text-brand-text'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            aria-label={isListening ? "Stop voice input" : "Start voice input"}
                        >
                            <MicrophoneIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className="mt-4 text-sm p-4 rounded-lg bg-brand-crt-bg text-brand-crt-text/90 font-mono leading-relaxed border-2 border-brand-metal-dark shadow-metal-inset">
                    <p className="font-bold text-brand-text mb-2">++SYSTEM NOTE++</p>
                    <p>{'>'} Heard some slang but can't quite remember how it goes? No worries!</p>
                    <p className="mt-2">{'>'} Just type it in as best you can. My circuits are pretty good at figuring out what you mean.</p>
                    <p className="mt-2">{'>'} I'm here for you, always! ...Unless there's a power cut.</p>
                </div>


                <div className="mt-6">
                     <button
                        onClick={onGenerate}
                        disabled={isLoading || !userInput}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-primary text-white font-bold rounded-lg shadow-metal transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none border-t-2 border-orange-300 border-l-2 hover:shadow-glow-primary active:translate-y-0"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Deciphering...</span>
                            </>
                        ) : (
                        <>
                            <SparklesIcon className="w-5 h-5" />
                            <span>Get Lowdown</span>
                        </>
                        )}
                    </button>
                </div>
            </div>
            <div className="p-4 md:p-6 border-t-4 border-brand-border bg-brand-surface-alt/50 backdrop-blur-sm ring-1 ring-inset ring-brand-primary/20 shadow-[inset_0_1px_4px_rgba(255,87,34,0.05)]">
                <UnderstandingTuningPanel 
                    options={tuningOptions} 
                    setOptions={setTuningOptions} 
                    isDisabled={isLoading} 
                    isSoundOn={isSoundOn}
                />
            </div>
        </Card>
    );
};