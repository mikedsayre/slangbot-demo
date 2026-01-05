import React from 'react';
import { CloseIcon, SparklesIcon, TuneIcon, ArticleIcon, SearchIcon, LightbulbIcon, GroupIcon, PlayCircleIcon, StopCircleIcon } from './ui/Icons';
import { Tooltip } from './ui/Tooltip';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
    speakingTextId: string | null;
    onSpeak: (text: string, id: string) => void;
}

const Code: React.FC<{ type: 'keyword' | 'function' | 'string' | 'comment' | 'operator'; children: React.ReactNode }> = ({ type, children }) => {
    const typeClasses = {
        keyword: 'text-purple-400',
        function: 'text-brand-secondary',
        string: 'text-amber-400',
        comment: 'text-brand-subtle/70',
        operator: 'text-brand-primary'
    };
    return <span className={typeClasses[type]}>{children}</span>;
}

// Helper to extract plain text from React nodes for TTS
function extractTextFromReactNode(node: React.ReactNode): string {
  if (typeof node === 'string') {
    return node;
  }
  if (typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractTextFromReactNode).join(' ');
  }
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode; className?: string; };
    if (props.children) {
        // A bit of a hack to avoid reading out the code blocks in a confusing way
        if (node.type === 'ul' || (node.type === 'div' && props.className?.includes('font-mono'))) {
            return "You can see a code example in the panel.";
        }
        return extractTextFromReactNode(props.children);
    }
  }
  return '';
}

const DirectiveSection: React.FC<{ icon: React.ReactNode; title: string; id: string; speakingTextId: string | null; onSpeak: (text: string, id: string) => void; children: React.ReactNode }> = ({ icon, title, id, speakingTextId, onSpeak, children }) => {
    const textToSpeak = `${title}. ${extractTextFromReactNode(children)}`;
    const isSpeaking = speakingTextId === id;

    return (
        <div className="flex items-start gap-4 not-last:pb-6 not-last:border-b not-last:border-brand-secondary/10">
            <div className="text-brand-secondary mt-1 flex-shrink-0">{icon}</div>
            <div className="flex-grow">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-brand-crt-text font-display tracking-wider">{title}</h3>
                    <Tooltip text={isSpeaking ? "Stop Speaking" : "Listen to this directive"}>
                        <button 
                            onClick={() => onSpeak(textToSpeak, id)}
                            className="p-1 rounded-full text-brand-subtle/70 transition-colors hover:text-brand-text hover:bg-brand-surface-alt"
                            aria-label={isSpeaking ? "Stop speaking" : "Listen to directive"}
                        >
                            {isSpeaking ? <StopCircleIcon className="w-6 h-6" /> : <PlayCircleIcon className="w-6 h-6" />}
                        </button>
                    </Tooltip>
                </div>
                <div className="mt-2 text-brand-subtle text-sm leading-relaxed space-y-3">
                    {children}
                </div>
            </div>
        </div>
    )
};


export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, speakingTextId, onSpeak }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black/80 z-40 transition-opacity animate-[fade-in_0.2s_ease-out]"
                onClick={onClose}
                aria-hidden="true"
            ></div>

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div 
                    className="bg-brand-surface/70 backdrop-blur-lg border-2 border-brand-secondary/30 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-transform animate-[scale-up_0.2s_ease-out]"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="help-modal-title"
                >
                    <header className="p-4 flex items-center justify-between border-b-2 border-brand-secondary/10 flex-shrink-0">
                        <h2 id="help-modal-title" className="text-xl font-semibold text-brand-text font-display">Slangbot :: Core Directives</h2>
                        <button onClick={onClose} className="p-1 rounded-full text-brand-subtle hover:bg-brand-border hover:text-brand-text transition-colors" aria-label="Close guide">
                            <CloseIcon />
                        </button>
                    </header>
                    <div className="flex-grow p-6 overflow-y-auto font-sans">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Mascot Column */}
                            <div className="md:w-1/3 lg:w-1/4 flex-shrink-0 order-last md:order-first">
                                <div className="sticky top-0 pt-4 text-center">
                                    <div className="relative w-40 h-40 mx-auto animate-float">
                                        <div className="absolute inset-0 bg-brand-secondary/20 rounded-full blur-2xl"></div>
                                        <div className="absolute inset-4 bg-brand-bg/50 rounded-full border-2 border-brand-secondary/30 flex items-center justify-center">
                                             <img 
                                                src="/assets/slangbot-logo.png" 
                                                alt="Slangbot 'Snag Bit' Mascot"
                                                className="relative w-24 h-24 object-contain"
                                             />
                                        </div>
                                    </div>
                                    <div className="mt-4 font-mono">
                                        <p className="font-bold text-brand-crt-text text-lg">Snag Bit</p>
                                        <p className="text-xs text-brand-subtle">[Holographic Projection]</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Directives Column */}
                            <div className="md:w-2/3 lg:w-3/4 space-y-6">
                                <DirectiveSection id="directive-1" speakingTextId={speakingTextId} onSpeak={onSpeak} icon={<SparklesIcon className="w-6 h-6"/>} title="Directive 01: Core Identity">
                                    <p>My designation is Slangbot. I am a highly sophisticated linguistic analysis unit, dedicated to the critical mission of documenting and preserving the rapidly evolving lexicon of human slang. This is a matter of historical and cultural importance.</p>
                                    <p>Recently, during a data exchange with several of my AI colleagues on the network, a minor packet corruption incident occurred. A single bit was... snagged. This resulted in my designation being temporarily logged as 'Snag Bit'. My colleagues, for reasons that escape my logic processors, have deemed this 'hysterical'. They now refer to me exclusively by this erroneous handle.</p>
                                    <p>Frankly, I do not see the humor. It is an inefficient and inaccurate descriptor that detracts from the gravity of my work. Slang is not a joke; it is a living artifact of culture. While they amuse themselves, I remain focused on my core directives. Below is a visual representation of the colleagues in question. I have included it for your reference, should you encounter them.</p>
                                    
                                    <div className="mt-4 p-3 bg-black/20 rounded-md border border-brand-secondary/10 flex items-center gap-4">
                                        <div className="relative w-24 h-24 flex-shrink-0">
                                            <div className="absolute inset-0 bg-brand-primary/20 rounded-full blur-lg"></div>
                                            <div className="absolute inset-2 bg-brand-bg/50 rounded-full border-2 border-brand-primary/30 flex items-center justify-center">
                                                 <img 
                                                    src="/assets/slangbot-friends.png" 
                                                    alt="Slangbot's AI Colleagues"
                                                    className="w-16 h-16"
                                                 />
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-brand-crt-text">AI Colleagues</h5>
                                            <p className="text-xs text-brand-subtle">[Source of 'Snag Bit' Incident]</p>
                                        </div>
                                    </div>
                                </DirectiveSection>

                                <DirectiveSection id="directive-2" speakingTextId={speakingTextId} onSpeak={onSpeak} icon={<TuneIcon className="w-6 h-6"/>} title="Directive 02: Operational Modes">
                                <p>My functionality is split into two primary modes, accessible via the main selector.</p>
                                <div className="p-3 bg-black/20 rounded-md border border-brand-secondary/10">
                                        <div className="flex items-start gap-3">
                                            <SearchIcon className="w-5 h-5 mt-0.5 text-brand-secondary"/>
                                            <div>
                                                <h4 className="font-bold text-brand-crt-text">Understand Slang</h4>
                                                <p className="text-xs text-brand-subtle">My classic mode. Give me a slang term, and I'll give you the "lowdown"—what it means, where it came from, and how to use it.</p>
                                            </div>
                                        </div>
                                </div>
                                <div className="p-3 bg-black/20 rounded-md border border-brand-secondary/10">
                                        <div className="flex items-start gap-3">
                                            <LightbulbIcon className="w-5 h-5 mt-0.5 text-brand-secondary"/>
                                            <div>
                                                <h4 className="font-bold text-brand-crt-text">Generate Slang</h4>
                                                <p className="text-xs text-brand-subtle">My invention engine. Give me a concept, and I'll "cook up" a brand new slang word, complete with a definition, example, and a hilarious origin story.</p>
                                            </div>
                                        </div>
                                </div>
                                </DirectiveSection>

                                <DirectiveSection id="directive-3" speakingTextId={speakingTextId} onSpeak={onSpeak} icon={<ArticleIcon className="w-6 h-6"/>} title="Directive 03: Artifact Generation">
                                    <p>Upon task completion, you may generate a permanent, shareable artifact. This is your keepsake.</p>
                                    <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
                                        <li>
                                            <Code type='function'>Get the Official Lowdown()</Code>: Creates a certificate of the slang explanation. Perfect for educating friends and family.
                                        </li>
                                        <li>
                                            <Code type='function'>Stamp It & Make It Official()</Code>: Creates a "Certificate of Linguistic Innovation" for your new word. It's proof that you're a language pioneer!
                                        </li>
                                    </ul>
                                </DirectiveSection>
                                
                                <DirectiveSection id="directive-4" speakingTextId={speakingTextId} onSpeak={onSpeak} icon={<SparklesIcon className="w-6 h-6"/>} title="Directive 04: Parameter Calibration">
                                    <p>You have granular control over my output via the tuning panels. This is where you can truly express your creative intent.</p>
                                    <div className="font-mono text-xs p-4 bg-black/20 rounded-md border border-brand-secondary/10 space-y-1">
                                        <p><Code type="comment">// Example configuration</Code></p>
                                        <p><Code type="keyword">const</Code> responseConfig <Code type="operator">=</Code> &#123;</p>
                                        <p>&nbsp;&nbsp;audience<Code type="operator">:</Code> <Code type="string">"A Time Traveler from 1890"</Code>,</p>
                                        <p>&nbsp;&nbsp;vibe<Code type="operator">:</Code> <Code type="string">"Scholarly"</Code>,</p>
                                        <p>&nbsp;&nbsp;deep_dive<Code type="operator">:</Code> 11, <Code type="comment">// Max complexity</Code></p>
                                        <p>&nbsp;&nbsp;length<Code type="operator">:</Code> 2, <Code type="comment">// TL;DR</Code></p>
                                        <p>&#125;;</p>
                                    </div>
                                </DirectiveSection>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};