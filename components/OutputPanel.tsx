

import React, { useState } from 'react';
import { Card } from './ui/Card';
import { CheckIcon, CopyIcon, ErrorIcon, ShareIcon, SparklesIcon, StampIcon, ArticleIcon } from './ui/Icons';
import type { NewSlangResult, GenerationOptions, GenerationType } from '../types';
import { Tooltip } from './ui/Tooltip';
import { MarkdownRenderer } from './ui/MarkdownRenderer';

type AppMode = 'understand' | 'generate';

interface OutputPanelProps {
    userInput: string;
    content: string | NewSlangResult;
    isLoading: boolean;
    error: string | null;
    mode: AppMode;
    onShare: () => void;
    isGlitching: boolean;
    onImageGenerated: (imageDataUrl: string) => void;
    generationOptions?: GenerationOptions;
}

const SkeletonLoader: React.FC = () => (
    <div className="space-y-4 animate-pulse w-full">
        <div className="h-4 bg-brand-subtle/20 rounded w-3/4"></div>
        <div className="h-4 bg-brand-subtle/20 rounded"></div>
        <div className="h-4 bg-brand-subtle/20 rounded"></div>
        <div className="h-4 bg-brand-subtle/20 rounded w-5/6"></div>
        <div className="h-4 bg-brand-subtle/20 rounded w-1/2"></div>
    </div>
);

const GeneratedSlangDisplay: React.FC<{ data: NewSlangResult; isGlitching: boolean, type: GenerationType }> = ({ data, isGlitching, type }) => {
    const label = type === 'Saying' ? 'New Saying:' : 'New Slang:';
    return (
        <div className={`font-mono text-sm md:text-base leading-relaxed crt-screen p-4 space-y-4 ${isGlitching ? 'glitching' : ''}`}>
             <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-transparent via-brand-crt-text/10 to-transparent pointer-events-none animate-scanline z-10"></div>
            <div>
                <span className="text-brand-subtle uppercase text-xs">{label}</span>
                <h4 className="text-2xl font-bold text-brand-primary tracking-widest">{data.term}</h4>
            </div>
            <div>
                <span className="text-brand-subtle uppercase text-xs">Definition:</span>
                <p className="text-brand-crt-text">{data.definition}</p>
            </div>
            <div>
                <span className="text-brand-subtle uppercase text-xs">Example Usage:</span>
                <p className="text-brand-crt-text italic">"{data.example}"</p>
            </div>
            <div>
                <span className="text-brand-subtle uppercase text-xs">Origin Story:</span>
                <p className="text-brand-crt-text">{data.origin}</p>
            </div>
        </div>
    )
}

// --- Canvas Drawing Helpers ---
const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, currentY);
    return currentY + lineHeight;
};

const drawInnovationCertificate = (ctx: CanvasRenderingContext2D, content: NewSlangResult, type: GenerationType) => {
    const PADDING = 60;
    const canvas = ctx.canvas;
    const isSaying = type === 'Saying';

    // Header
    const mainTitle = isSaying ? "CERTIFICATE OF PHRASEOLOGICAL INNOVATION" : "CERTIFICATE OF LINGUISTIC INNOVATION";
    const subTitle = isSaying ? "This certifies that the saying" : "This certifies that the term";
    
    ctx.font = 'bold 50px "Orbitron", sans-serif';
    ctx.fillStyle = '#3d3522';
    ctx.textAlign = 'center';
    ctx.fillText(mainTitle, canvas.width / 2, PADDING + 50);

    ctx.font = '24px "Inter", sans-serif';
    ctx.fillText(subTitle, canvas.width / 2, PADDING + 100);

    // The Word/Saying
    const termLength = content.term.length;
    let termFontSize = 90;
    if (isSaying) {
        if (termLength > 50) termFontSize = 40;
        else if (termLength > 30) termFontSize = 50;
        else if (termLength > 20) termFontSize = 70;
    }
    
    ctx.font = `bold ${termFontSize}px "Orbitron", sans-serif`;
    ctx.fillStyle = '#ff5722'; // Primary color
    
    // For long sayings, wrap them.
    if(isSaying && termLength > 25) {
        wrapText(ctx, content.term.toUpperCase(), canvas.width / 2, PADDING + 170, canvas.width - PADDING*2, termFontSize * 1.1);
    } else {
        ctx.fillText(content.term.toUpperCase(), canvas.width / 2, PADDING + 200);
    }
    
    // Definition
    ctx.font = 'italic 28px "Inter", sans-serif';
    ctx.fillStyle = '#3d3522';
    wrapText(ctx, `is hereby defined as: "${content.definition}"`, canvas.width / 2, PADDING + 280, canvas.width - PADDING * 2, 40);
};

const drawOfficialLowdownCertificate = (ctx: CanvasRenderingContext2D, slang: string, explanation: string) => {
    const PADDING = 60;
    const canvas = ctx.canvas;
    
    // Header
    ctx.font = 'bold 60px "Orbitron", sans-serif';
    ctx.fillStyle = '#3d3522';
    ctx.textAlign = 'center';
    ctx.fillText("THE OFFICIAL LOWDOWN", canvas.width / 2, PADDING + 60);

    ctx.font = '24px "Inter", sans-serif';
    ctx.fillText("A Certified Slang Explanation on:", canvas.width / 2, PADDING + 110);

    // The Word
    ctx.font = 'bold 70px "Orbitron", sans-serif';
    ctx.fillStyle = '#ff5722'; // Primary color
    ctx.fillText(`"${slang}"`, canvas.width / 2, PADDING + 190);

    // Explanation
    ctx.textAlign = 'left';
    ctx.font = '22px "Inter", sans-serif';
    ctx.fillStyle = '#3d3522';
    wrapText(ctx, explanation, PADDING + 20, PADDING + 250, canvas.width - (PADDING + 20) * 2, 32);
};


export const OutputPanel: React.FC<OutputPanelProps> = ({ userInput, content, isLoading, error, mode, onShare, isGlitching, onImageGenerated, generationOptions }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isShareCopied, setIsShareCopied] = useState(false);
    
    const hasContent = !isLoading && !error && content && (typeof content === 'string' || (typeof content === 'object' && content.term));

    const getCopyText = (): string => {
        if (!content) return '';
        if (typeof content === 'string') return content;
        // Format the object for copying
        const label = generationOptions?.generationType === 'Saying' ? 'Saying' : 'Word';
        return `${label}: ${content.term}\nDefinition: ${content.definition}\nExample: "${content.example}"\nOrigin: ${content.origin}`;
    }

    const handleCopy = () => {
        const textToCopy = getCopyText();
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleShare = () => {
        onShare();
        setIsShareCopied(true);
        setTimeout(() => setIsShareCopied(false), 2000);
    };

    const handleStamp = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 630;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const PADDING = 60;
        
        // Background & Border
        ctx.fillStyle = '#e0d8c0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#3d3522';
        ctx.lineWidth = 10;
        ctx.strokeRect(PADDING/2, PADDING/2, canvas.width - PADDING, canvas.height - PADDING);
        ctx.lineWidth = 2;
        ctx.strokeRect(PADDING/2 + 10, PADDING/2 + 10, canvas.width - PADDING - 20, canvas.height - PADDING - 20);

        const mascotImg = new Image();
        mascotImg.crossOrigin = 'anonymous';
        mascotImg.src = '/assets/slangbot-logo.png';

        mascotImg.onload = () => {
            // Draw content based on mode
            if (mode === 'generate' && typeof content === 'object' && content.term) {
                drawInnovationCertificate(ctx, content, generationOptions?.generationType || 'Word');
            } else if (mode === 'understand' && typeof content === 'string') {
                drawOfficialLowdownCertificate(ctx, userInput, content);
            }

            // Footer & Seal
            ctx.drawImage(mascotImg, PADDING, canvas.height - PADDING - 100, 100, 100);
            ctx.textAlign = 'left';
            ctx.font = 'bold 24px "Orbitron", sans-serif';
            ctx.fillStyle = '#3d3522';
            ctx.fillText("OFFICIAL SEAL", PADDING + 120, canvas.height - PADDING - 70);
            ctx.font = '18px "Inter", sans-serif';
            ctx.fillText("Slangbot Laboratories", PADDING + 120, canvas.height - PADDING - 45);

            ctx.textAlign = 'right';
            ctx.font = 'bold 28px "Orbitron", sans-serif';
            ctx.fillText("slangbot.app", canvas.width - PADDING, canvas.height - PADDING - 70);
            const certificateId = `Cert. ID: ${Date.now()}`;
            ctx.font = '18px "Fira Code", monospace';
            ctx.fillText(certificateId, canvas.width - PADDING, canvas.height - PADDING - 45);

            // Pass the image data to the parent component
            onImageGenerated(canvas.toDataURL('image/png'));
        };
        mascotImg.onerror = () => {
            alert("Error loading mascot image for certificate.");
        };
    };

    const renderContent = () => {
        if (isLoading) return <SkeletonLoader />;
        if (error) {
            return (
                <div className="flex flex-col items-center justify-center text-center text-red-400 font-mono p-4">
                    <ErrorIcon className="w-12 h-12 mb-4"/>
                    <h3 className="font-semibold text-lg">Oof, a Short Circuit!</h3>
                    <p className="text-sm">{error}</p>
                </div>
            );
        }
        if (typeof content === 'string' && content) {
             return (
                <div className={`relative w-full h-full font-mono text-sm md:text-base leading-relaxed crt-screen min-h-[300px] overflow-y-auto ${isGlitching ? 'glitching' : ''}`}>
                    <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-transparent via-brand-crt-text/10 to-transparent pointer-events-none animate-scanline z-10"></div>
                    <div className="overflow-hidden">
                         <div key={content} className="animate-glitch-in">
                            <MarkdownRenderer text={content} />
                         </div>
                    </div>
                </div>
            );
        }
         if (typeof content === 'object' && content && content.term) {
            return (
                <div className="overflow-hidden">
                     <div key={content.term} className="animate-glitch-in">
                        <GeneratedSlangDisplay data={content} isGlitching={isGlitching} type={generationOptions?.generationType || 'Word'} />
                    </div>
                </div>
            );
        }
        return (
            <div className="flex flex-col items-center justify-center text-center text-brand-subtle font-sans p-4">
                <svg className="w-16 h-16 mb-4 opacity-30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-5h2v2h-2zm0-8h2v6h-2z"/></svg>
                <h3 className="font-semibold text-lg">Awaiting Your Command</h3>
                <p className="text-sm">{mode === 'understand' ? 'My circuits are buzzing. What can I decode for you?' : 'The Invention Engine is ready. What should we create?'}</p>
            </div>
        );
    };

    const title = mode === 'understand' ? "The Lowdown" : "Spec Sheet";
    const successMessage = mode === 'understand' ? "Got it! Here's the 4-1-1." : "Invention complete!";

    const stampButtonText = mode === 'generate' ? 'Stamp It & Make It Official!' : 'Get the Official Lowdown';
    const stampButtonIcon = mode === 'generate' ? <StampIcon className="w-6 h-6" /> : <ArticleIcon className="w-6 h-6" />;
    const stampButtonBgClass = mode === 'generate' ? 'bg-brand-secondary border-t-2 border-cyan-300' : 'bg-green-600 border-t-2 border-green-400';
    
    const shareTooltipText = isShareCopied ? 'Link Copied!' : (mode === 'generate' ? 'Share This Recipe' : 'Share Explanation');


    return (
        <Card className="flex flex-col h-full">
            <header className="p-4 flex items-start justify-between border-b-4 border-brand-border flex-shrink-0 min-h-[70px] gap-4">
                <div className="flex-grow">
                    <div className="flex items-center gap-3">
                        <SparklesIcon className={`w-7 h-7 transition-colors duration-300 ${hasContent ? 'text-brand-primary animate-flicker-glow' : 'text-brand-subtle/50'}`} />
                        <div>
                            <h3 className="text-xl font-semibold text-brand-text font-display uppercase">{title}</h3>
                            {hasContent && (
                                <p className="text-sm text-brand-primary mt-0.5 animate-fade-in">
                                    {successMessage}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {hasContent && (
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <Tooltip text={shareTooltipText}>
                            <button
                                onClick={handleShare}
                                className="w-14 h-14 rounded-full flex items-center justify-center bg-brand-secondary hover:bg-cyan-400 text-white shadow-metal hover:scale-110 active:scale-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-secondary"
                                aria-label={isShareCopied ? 'Link copied to clipboard' : 'Share this result'}
                            >
                                {isShareCopied ? <CheckIcon className="w-7 h-7" /> : <ShareIcon className="w-7 h-7" />}
                            </button>
                        </Tooltip>
                        <Tooltip text={isCopied ? 'Copied!' : 'Copy Text'}>
                            <button
                                onClick={handleCopy}
                                className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-metal hover:scale-110 active:scale-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-green-500 ${isCopied ? 'bg-green-600' : 'bg-brand-surface-alt hover:bg-green-600'}`}
                                aria-label={isCopied ? 'Text copied to clipboard' : 'Copy text'}
                            >
                                {isCopied ? <CheckIcon className="w-7 h-7 text-white" /> : <CopyIcon className="w-7 h-7" />}
                            </button>
                        </Tooltip>
                    </div>
                )}
            </header>
            <div className="p-1 flex-grow flex flex-col">
                <div className="flex-grow flex flex-col">
                    {renderContent()}
                </div>
                {hasContent && (
                    <div className="p-4 mt-2">
                         <button
                            onClick={handleStamp}
                            className={`w-full flex items-center justify-center gap-3 py-3 px-4 text-white font-bold rounded-lg shadow-metal transform hover:-translate-y-0.5 transition-all duration-300 border-l-2 text-lg hover:shadow-glow-primary active:translate-y-0 ${stampButtonBgClass}`}
                        >
                            {stampButtonIcon}
                            <span>{stampButtonText}</span>
                        </button>
                    </div>
                )}
            </div>
        </Card>
    );
};