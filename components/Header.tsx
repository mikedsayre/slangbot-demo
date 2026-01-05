import React, { useState, useEffect } from 'react';
import { HistoryIcon, QuestionMarkIcon, SchoolIcon, VolumeUpIcon, VolumeOffIcon, PlayCircleIcon, StopCircleIcon } from './ui/Icons';
import { Tooltip } from './ui/Tooltip';

interface HeaderProps {
    onToggleHistory: () => void;
    onToggleHelp: () => void;
    isSoundOn: boolean;
    onToggleSound: () => void;
    speakingTextId: string | null;
    onSpeak: (text: string, id: string) => void;
}

const GuideSyntaxItem: React.FC<{ number: string, title: string, id: string; speakingTextId: string | null; onSpeak: (text: string, id: string) => void; children: React.ReactNode }> = ({ number, title, id, speakingTextId, onSpeak, children }) => {
    const textToSpeak = `${title}. ${children.toString().replace(/<br \/>/g, ' ')}`;
    const isSpeaking = speakingTextId === id;
    
    return (
        <div className="relative group">
            <h4 className="font-display font-bold tracking-wider text-lg">
                <span className="text-brand-secondary">{number}</span>
                <span className="text-brand-crt-text"> {title}</span>
            </h4>
            <p className="mt-1 text-sm text-brand-subtle font-mono leading-relaxed">
                {children}
            </p>
             <button 
                onClick={() => onSpeak(textToSpeak, id)}
                className="absolute top-0 right-0 p-1 rounded-full text-brand-subtle/50 transition-all opacity-0 group-hover:opacity-100 hover:text-brand-text hover:bg-brand-surface"
                aria-label={isSpeaking ? "Stop listening" : "Listen to this section"}
            >
                {isSpeaking ? <StopCircleIcon className="w-5 h-5" /> : <PlayCircleIcon className="w-5 h-5" />}
            </button>
        </div>
    );
};

const StatCounter: React.FC = () => {
    const initialStats = {
        discovered: 18472,
        knowledge: 9381,
        unleashed: 481
    };
    const [stats, setStats] = useState(initialStats);
    const [flicker, setFlicker] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => {
                const newDiscovered = prev.discovered + Math.floor(Math.random() * 3) + 1;
                const newKnowledge = Math.random() > 0.8 ? prev.knowledge + 1 : prev.knowledge;
                const newUnleashed = Math.random() > 0.5 ? prev.unleashed + 1 : prev.unleashed;
                
                if (newDiscovered > prev.discovered) setFlicker('discovered');
                else if (newUnleashed > prev.unleashed) setFlicker('unleashed');
                else if (newKnowledge > prev.knowledge) setFlicker('knowledge');

                setTimeout(() => setFlicker(''), 500);

                return { discovered: newDiscovered, knowledge: newKnowledge, unleashed: newUnleashed };
            });
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    const formatNumber = (num: number) => num.toLocaleString('en-US');

    const StatItem: React.FC<{label:string, value:string, isFlickering: boolean}> = ({label, value, isFlickering}) => (
        <div className="text-center">
            <div className={`font-mono text-xl text-brand-crt-text transition-all duration-300 ${isFlickering ? 'animate-stat-flicker' : ''}`}>
                {value}
            </div>
            <div className="text-xs text-brand-subtle/80 uppercase tracking-widest">{label}</div>
        </div>
    );

    return (
        <div className="hidden lg:flex items-center gap-6 bg-black/30 backdrop-blur-sm px-6 py-2 border-2 border-brand-metal-dark rounded-lg shadow-metal-inset">
            <StatItem label="Slang Discovered" value={formatNumber(stats.discovered)} isFlickering={flicker === 'discovered'} />
            <div className="w-px h-8 bg-brand-metal-dark/50"></div>
            <StatItem label="Bot Knowledge" value={formatNumber(stats.knowledge)} isFlickering={flicker === 'knowledge'} />
            <div className="w-px h-8 bg-brand-metal-dark/50"></div>
            <StatItem label="Payloads Unleashed" value={formatNumber(stats.unleashed)} isFlickering={flicker === 'unleashed'} />
        </div>
    );
}

export const Header: React.FC<HeaderProps> = ({ onToggleHistory, onToggleHelp, isSoundOn, onToggleSound, speakingTextId, onSpeak }) => {
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    
    const buttonBaseClass = "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-metal hover:scale-110 active:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface backdrop-blur-sm";

    const glassButtonClasses = {
        sound: "bg-green-500/20 border border-green-400/30 text-green-200 hover:bg-green-500/40 hover:border-green-400/60 focus:ring-green-400",
        guide: `border text-sky-200 focus:ring-sky-400 ${isGuideOpen ? 'bg-sky-500/40 border-sky-400/60' : 'bg-sky-500/20 border-sky-400/30 hover:bg-sky-500/40 hover:border-sky-400/60'}`,
        history: "bg-amber-500/20 border border-amber-400/30 text-amber-200 hover:bg-amber-500/40 hover:border-amber-400/60 focus:ring-amber-400",
        help: "bg-fuchsia-500/20 border border-fuchsia-400/30 text-fuchsia-200 hover:bg-fuchsia-500/40 hover:border-fuchsia-400/60 focus:ring-fuchsia-400"
    };

    return (
        <header className="py-3 px-4 md:px-8 bg-brand-surface/70 backdrop-blur-sm border-b-4 border-brand-border sticky top-0 z-20 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex-1 flex justify-start">
                    <div className="flex-shrink-0">
                        <div className="flex items-end gap-3">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-wider uppercase font-display text-brand-text text-shadow-lg">
                                Slangbot
                            </h1>
                            <img 
                                src="/assets/slangbot-logo.png"
                                alt="Slangbot Mascot"
                                className="w-10 h-10 mb-[-4px]"
                            />
                        </div>
                        <p className="text-xs md:text-sm text-brand-subtle font-sans tracking-wide mt-2">
                            The dictionary of now. The laboratory of next.
                        </p>
                    </div>
                </div>

                <div className="flex-1 flex justify-center">
                    <StatCounter />
                </div>

                <div className="flex-1 flex justify-end">
                    <div className="flex items-center gap-2 md:gap-3">
                         <Tooltip text={isSoundOn ? "Mute All Sounds" : "Unmute All Sounds"}>
                            <button
                                onClick={onToggleSound}
                                className={`${buttonBaseClass} ${glassButtonClasses.sound}`}
                                aria-label={isSoundOn ? "Mute sounds" : "Unmute sounds"}
                            >
                                {isSoundOn ? <VolumeUpIcon className="w-6 h-6" /> : <VolumeOffIcon className="w-6 h-6" />}
                            </button>
                        </Tooltip>
                         <Tooltip text="Toggle Quick Guide">
                            <button
                                onClick={() => setIsGuideOpen(!isGuideOpen)}
                                className={`${buttonBaseClass} ${glassButtonClasses.guide}`}
                                aria-label="Toggle quick guide"
                                aria-expanded={isGuideOpen}
                            >
                                <SchoolIcon className="w-6 h-6" />
                            </button>
                        </Tooltip>
                         <Tooltip text="View Search History">
                            <button
                                onClick={onToggleHistory}
                                className={`${buttonBaseClass} ${glassButtonClasses.history}`}
                                aria-label="View search history"
                            >
                                <HistoryIcon className="w-6 h-6" />
                            </button>
                        </Tooltip>
                         <Tooltip text="Open Full Guide">
                            <button
                                onClick={onToggleHelp}
                                className={`${buttonBaseClass} ${glassButtonClasses.help}`}
                                aria-label="Open help guide"
                            >
                                <QuestionMarkIcon className="w-6 h-6" />
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </div>

            {isGuideOpen && (
                <div className="container mx-auto mt-4 animate-fade-in-down">
                     <section className="crt-screen border-brand-secondary/50 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                            <div className="flex flex-col items-center text-center md:col-span-1">
                                <div className="w-24 h-24 p-2 border-4 border-brand-metal-dark rounded-full bg-brand-surface-alt shadow-metal-inset flex items-center justify-center">
                                    <img 
                                        src="/assets/slangbot-logo.png" 
                                        alt="Slangbot mascot"
                                        className="w-16 h-16 object-contain"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold font-display uppercase tracking-wider mt-4 text-brand-text">Lab Notes</h3>
                                <p className="text-sm text-brand-subtle">Slangbot's Quick Guide</p>
                            </div>

                            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                                <GuideSyntaxItem id="guide-1" speakingTextId={speakingTextId} onSpeak={onSpeak} number="1." title="Choose_Your_Mode">
                                    Use the switch to toggle between modes: 'Understand' to decode slang, and 'Generate' to invent new slang.
                                </GuideSyntaxItem>
                                
                                <GuideSyntaxItem id="guide-2" speakingTextId={speakingTextId} onSpeak={onSpeak} number="2." title="Input_Your_Query">
                                   For 'Understand', provide a string, like the slang you're curious about. For 'Generate', provide a concept to inspire me.
                                </GuideSyntaxItem>

                                <GuideSyntaxItem id="guide-3" speakingTextId={speakingTextId} onSpeak={onSpeak} number="3." title="Tune.The_Vibe()">
                                    Use the UI controls like dials and dropdowns to change my personality and response style. This is the fun part!
                                </GuideSyntaxItem>
                                
                                <GuideSyntaxItem id="guide-4" speakingTextId={speakingTextId} onSpeak={onSpeak} number="4." title="Get_The_Lowdown()">
                                    Hit the big button to execute, like 'Spill the Tea', and watch the magic happen!
                                </GuideSyntaxItem>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </header>
    );
};