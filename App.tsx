

import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { UnderstandPanel } from './components/UnderstandPanel';
import { OutputPanel } from './components/OutputPanel';
import { getSlangExplanation, generateNewSlang } from './services/geminiService';
import { speak, stopSpeaking } from './services/audioService';
import type { TuningOptions, HistoryItem, SharedRecipe, GenerationOptions, NewSlangResult, SharedGenerationRecipe } from './types';
import { DEFAULT_TUNING_OPTIONS, DEFAULT_GENERATION_OPTIONS } from './constants';
import { HistoryPanel } from './components/HistoryPanel';
import { HelpModal } from './components/HelpModal';
import { GeneratePanel } from './components/GeneratePanel';
import { ImagePreviewModal } from './components/ImagePreviewModal';

type AppMode = 'understand' | 'generate';

const PRELOADED_EXAMPLE: {
    userInput: string;
    tuningOptions: TuningOptions;
    generatedPrompt: string;
} = {
  userInput: `What's the tea with 'rizz'? I keep hearing it everywhere.`,
  tuningOptions: {
    ...DEFAULT_TUNING_OPTIONS,
    persona: 'A Confused Parent',
    tone: 'Simple & Clear',
    format: 'Bullet Points',
    complexity: 4,
    verbosity: 5,
    negativePrompt: ''
  },
  generatedPrompt: `**Alright, let's break down 'rizz'!**

It's one of the biggest slang terms to come out of Gen Z culture recently.

* **What it means:** 'Rizz' is short for 'charisma.' It's someone's skill in charming or attracting a romantic partner. Think of it as your game, your charm, your romantic superpower.
* **How it's used:**
    * You can 'have' 'rizz': "That guy has insane rizz, he got her number in seconds."
    * You can 'use' 'rizz' on someone (as a verb): "I'm going to go rizz them up."
    * It can be a scale: "My 'rizz' is at an all-time low today."
* **Origin:** The term was popularized by streamer Kai Cenat and has since exploded across platforms like TikTok. It's a perfect example of how internet culture can create and spread new language at lightning speed.

So, in short, if someone has 'rizz', they're effortlessly charming and magnetic.`
};

const App: React.FC = () => {
    const [activeMode, setActiveMode] = useState<AppMode>('understand');
    
    // State for "Understand" mode
    const [userInput, setUserInput] = useState<string>(PRELOADED_EXAMPLE.userInput);
    const [tuningOptions, setTuningOptions] = useState<TuningOptions>(PRELOADED_EXAMPLE.tuningOptions);
    const [generatedPrompt, setGeneratedPrompt] = useState<string | NewSlangResult>(PRELOADED_EXAMPLE.generatedPrompt);
    
    // State for "Generate" mode
    const [seedConcept, setSeedConcept] = useState<string>('The feeling when your code works on the first try');
    const [generationOptions, setGenerationOptions] = useState<GenerationOptions>(DEFAULT_GENERATION_OPTIONS);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(false);
    const [isGlitching, setIsGlitching] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isSoundOn, setIsSoundOn] = useState(true);
    const [speakingTextId, setSpeakingTextId] = useState<string | null>(null);

    useEffect(() => {
        setIsSpeechRecognitionSupported('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
        try {
            const storedHistory = localStorage.getItem('slangbotHistory');
            if (storedHistory) setHistory(JSON.parse(storedHistory));

            const storedSoundPref = localStorage.getItem('slangbotSound');
            if (storedSoundPref !== null) {
                setIsSoundOn(JSON.parse(storedSoundPref));
            }

        } catch (e) {
            console.error("Failed to load settings from localStorage", e);
        }

        try {
            const urlParams = new URLSearchParams(window.location.search);
            const slangData = urlParams.get('slang');
            const recipeData = urlParams.get('recipe');

            if (slangData) {
                const decodedRecipe = atob(slangData);
                const parsedRecipe: SharedRecipe = JSON.parse(decodedRecipe);
                setUserInput(parsedRecipe.userInput);
                setTuningOptions(parsedRecipe.tuningOptions);
                setGeneratedPrompt('');
                setError(null);
                setActiveMode('understand');
                window.history.replaceState({}, document.title, window.location.pathname);
            } else if (recipeData) {
                const decodedRecipe = atob(recipeData);
                const parsedRecipe: SharedGenerationRecipe = JSON.parse(decodedRecipe);
                setSeedConcept(parsedRecipe.seedConcept);
                setGenerationOptions(parsedRecipe.generationOptions);
                setGeneratedPrompt('');
                setError(null);
                setActiveMode('generate');
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } catch (e) {
            console.error("Failed to load shared content from URL", e);
        }
    }, []);

    // Random Glitch Effect
    useEffect(() => {
        let glitchTimeout: number;

        const scheduleGlitch = () => {
            const delay = Math.random() * 20000 + 20000; // 20-40 seconds
            glitchTimeout = window.setTimeout(() => {
                setIsGlitching(true);
                setTimeout(() => setIsGlitching(false), Math.random() * 150 + 100); // Glitch for 100-250ms
                scheduleGlitch();
            }, delay);
        };
        
        scheduleGlitch();
        return () => clearTimeout(glitchTimeout);
    }, []);

    const saveHistory = (newHistory: HistoryItem[]) => {
        setHistory(newHistory);
        localStorage.setItem('slangbotHistory', JSON.stringify(newHistory));
    };
    
    const setSoundPreference = (newIsSoundOn: boolean) => {
        setIsSoundOn(newIsSoundOn);
        if (!newIsSoundOn) {
            // Stop any playing sounds or speech
            stopSpeaking();
            setSpeakingTextId(null);
        }
        try {
            localStorage.setItem('slangbotSound', JSON.stringify(newIsSoundOn));
        } catch (e) {
            console.error("Failed to save sound preference to localStorage", e);
        }
    };
    
    const handleSpeak = useCallback((text: string, id: string) => {
        if (!isSoundOn) return;
        
        if (speakingTextId === id) {
            stopSpeaking();
            setSpeakingTextId(null);
        } else {
            speak(text, () => setSpeakingTextId(null));
            setSpeakingTextId(id);
        }
    }, [isSoundOn, speakingTextId]);

    const handleSaveToHistory = (prompt: string) => {
        const newEntry: HistoryItem = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            userInput,
            tuningOptions,
            generatedPrompt: prompt,
        };
        const updatedHistory = [newEntry, ...history].slice(0, 50);
        saveHistory(updatedHistory);
    };

    const handleLoadFromHistory = (item: HistoryItem) => {
        setUserInput(item.userInput);
        setTuningOptions(item.tuningOptions);
        setGeneratedPrompt(item.generatedPrompt);
        setError(null);
        setActiveMode('understand');
        setIsHistoryPanelOpen(false);
    };

    const handleDeleteFromHistory = (id: number) => {
        saveHistory(history.filter(item => item.id !== id));
    };

    const handleClearHistory = () => {
        saveHistory([]);
        setIsHistoryPanelOpen(false);
    };
    
    const handleShare = useCallback(() => {
        let url = '';
        if (activeMode === 'understand' && typeof generatedPrompt === 'string') {
            const recipe: SharedRecipe = { userInput, tuningOptions };
            const jsonString = JSON.stringify(recipe);
            const base64String = btoa(jsonString);
            url = `${window.location.origin}${window.location.pathname}?slang=${base64String}`;
        } else if (activeMode === 'generate' && typeof generatedPrompt === 'object' && generatedPrompt.term) {
            const recipe: SharedGenerationRecipe = { seedConcept, generationOptions };
            const jsonString = JSON.stringify(recipe);
            const base64String = btoa(jsonString);
            url = `${window.location.origin}${window.location.pathname}?recipe=${base64String}`;
        }
        
        if (url) {
            navigator.clipboard.writeText(url);
        }
    }, [userInput, tuningOptions, seedConcept, generationOptions, activeMode, generatedPrompt]);

    const handleUnderstand = useCallback(async () => {
        if (!userInput.trim()) {
            setError('Spit it out! Enter some slang to define.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedPrompt('');

        try {
            const explanation = await getSlangExplanation(userInput, tuningOptions);
            setGeneratedPrompt(explanation);
            handleSaveToHistory(explanation);
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(`Failed to get the 4-1-1: ${errorMessage}`);
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [userInput, tuningOptions, history]);

    const handleGenerate = useCallback(async () => {
        if (!seedConcept.trim()) {
            setError('Gimme a spark! Enter a concept to generate slang from.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedPrompt('');

        try {
            const newSlang = await generateNewSlang(seedConcept, generationOptions);
            setGeneratedPrompt(newSlang);
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(`The invention engine misfired: ${errorMessage}`);
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [seedConcept, generationOptions]);

    return (
        <div className="min-h-screen flex flex-col theme-retro">
            <Header 
                onToggleHistory={() => setIsHistoryPanelOpen(!isHistoryPanelOpen)}
                onToggleHelp={() => setIsHelpModalOpen(true)}
                isSoundOn={isSoundOn}
                onToggleSound={() => setSoundPreference(!isSoundOn)}
                speakingTextId={speakingTextId}
                onSpeak={handleSpeak}
            />
            <main className="flex-grow container mx-auto w-full p-4 lg:p-6 flex flex-col gap-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl mx-auto">
                    <div>
                        {activeMode === 'understand' ? (
                            <UnderstandPanel
                                userInput={userInput}
                                setUserInput={setUserInput}
                                tuningOptions={tuningOptions}
                                setTuningOptions={setTuningOptions}
                                onGenerate={handleUnderstand}
                                isLoading={isLoading}
                                isSpeechRecognitionSupported={isSpeechRecognitionSupported}
                                activeMode={activeMode}
                                setActiveMode={setActiveMode}
                                isSoundOn={isSoundOn}
                            />
                        ) : (
                            <GeneratePanel
                                seedConcept={seedConcept}
                                setSeedConcept={setSeedConcept}
                                generationOptions={generationOptions}
                                setGenerationOptions={setGenerationOptions}
                                onGenerate={handleGenerate}
                                isLoading={isLoading}
                                activeMode={activeMode}
                                setActiveMode={setActiveMode}
                                isSoundOn={isSoundOn}
                            />
                        )}
                    </div>
                    <div>
                        <OutputPanel
                            userInput={userInput}
                            content={generatedPrompt}
                            isLoading={isLoading}
                            error={error}
                            mode={activeMode}
                            onShare={handleShare}
                            isGlitching={isGlitching}
                            onImageGenerated={setGeneratedImage}
                            generationOptions={generationOptions}
                        />
                    </div>
                </div>
            </main>
            <HistoryPanel
                isOpen={isHistoryPanelOpen}
                onClose={() => setIsHistoryPanelOpen(false)}
                history={history}
                onLoad={handleLoadFromHistory}
                onDelete={handleDeleteFromHistory}
                onClear={handleClearHistory}
            />
            <HelpModal 
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
                speakingTextId={speakingTextId}
                onSpeak={handleSpeak}
            />
            {generatedImage && (
                <ImagePreviewModal 
                    imageUrl={generatedImage}
                    onClose={() => setGeneratedImage(null)}
                />
            )}
            <footer className="text-center p-6 border-t-4 border-brand-border mt-8">
                <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
                    <img 
                        src="/assets/swan-lake-digital-logo.png"
                        alt="Swan Lake Digital Mascot"
                        className="w-16 h-16"
                    />
                    <div className="text-sm text-brand-subtle max-w-md">
                        <p className="font-semibold text-brand-text">
                            This app was built by <a href="https://swanlakedigital.com" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline font-bold">Swan Lake Digital</a>.
                        </p>
                        <p className="mt-1">We build amazing web & mobile apps with Gemini AI integration. Let's build something cool together.</p>
                    </div>
                </div>
                 <p className="text-xs text-brand-subtle/80 mt-6">Powered by Google Gemini. Slangbot: The dictionary of now. The laboratory of next.</p>
            </footer>
        </div>
    );
};

export default App;