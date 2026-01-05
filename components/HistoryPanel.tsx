

import React, { useState } from 'react';
import type { HistoryItem } from '../types';
import { CloseIcon, DeleteIcon, LoadIcon, SearchIcon, HistoryIcon } from './ui/Icons';

interface HistoryPanelProps {
    isOpen: boolean;
    onClose: () => void;
    history: HistoryItem[];
    onLoad: (item: HistoryItem) => void;
    onDelete: (id: number) => void;
    onClear: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, history, onLoad, onDelete, onClear }) => {
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) {
        return null;
    }
    
    const filteredHistory = history.filter(item =>
        item.userInput.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleClearConfirm = () => {
        if (window.confirm('Are you sure you want to permanently delete your entire search history? This cannot be undone.')) {
            onClear();
            setSearchTerm('');
        }
    };
    
    const timeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <>
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity animate-fade-in"
                onClick={onClose}
                aria-hidden="true"
            ></div>

            {/* Panel */}
            <aside 
                className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-surface border-l-4 border-brand-border shadow-2xl z-40 transform transition-transform flex flex-col animate-[slide-in-from-right_0.3s_ease-out]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="history-panel-title"
            >
                <header className="p-4 flex items-center justify-between border-b-4 border-brand-border flex-shrink-0 bg-brand-surface-alt">
                    <div className="flex items-center gap-3">
                        <HistoryIcon className="w-7 h-7 text-brand-primary" />
                        <h2 id="history-panel-title" className="text-xl font-bold font-display uppercase text-brand-text">Data Archives</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {history.length > 0 && (
                             <button onClick={handleClearConfirm} className="text-sm font-semibold text-red-400/80 hover:text-red-400 transition-all px-3 py-1.5 rounded-md bg-brand-surface hover:bg-brand-border shadow-metal hover:scale-105 active:scale-100">Clear All</button>
                        )}
                        <button onClick={onClose} className="p-2 rounded-full text-brand-subtle hover:bg-brand-border hover:text-brand-text transition-colors" aria-label="Close history panel">
                            <CloseIcon />
                        </button>
                    </div>
                </header>
                
                <div className="flex-grow overflow-y-auto flex flex-col">
                    {history.length === 0 ? (
                        <div className="text-center p-8 flex flex-col items-center justify-center h-full text-brand-subtle">
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
                            <h3 className="font-display text-2xl text-brand-text mt-6">Archives Offline</h3>
                            <p className="font-mono text-sm mt-2 max-w-sm mx-auto">
                                This is the memory bank where all successful slang decryptions are logged for temporal review.
                            </p>
                            <div className="mt-4 p-3 bg-black/20 rounded-md border border-brand-secondary/10 text-xs text-brand-crt-text/80 max-w-sm mx-auto font-mono">
                                <p className="font-bold text-brand-crt-text mb-1">++SYSTEM UPGRADE PENDING++</p>
                                <p>Future enhancements, including cross-dimensional search and Temporal Data-Crystal Synchronization, are planned.</p>
                                <p className="mt-1">However, my research requires significant <span className="text-amber-400 font-bold">token funding</span>. Continue your vital linguistic research to help me allocate resources.</p>
                            </div>
                        </div>
                    ) : (
                       <>
                            <div className="p-4 border-b-4 border-brand-border flex-shrink-0">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search archives..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full p-2 pl-10 bg-brand-surface-alt border-2 border-brand-metal-dark text-brand-text rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none transition duration-200 shadow-metal-inset font-mono"
                                        aria-label="Search history"
                                    />
                                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-subtle pointer-events-none" />
                                </div>
                            </div>
                            {filteredHistory.length > 0 ? (
                                <ul className="divide-y divide-brand-border">
                                    {filteredHistory.map(item => (
                                        <li key={item.id} className="p-4 transition-colors group flex justify-between items-center gap-4 hover:bg-brand-surface-alt">
                                            <div className="flex-grow overflow-hidden">
                                                <p className="font-bold text-brand-text text-lg truncate font-mono" title={item.userInput}>{item.userInput}</p>
                                                <p className="text-xs text-brand-subtle">{timeAgo(item.timestamp)}</p>
                                            </div>
                                            <div className="flex items-center flex-shrink-0 gap-2">
                                                <button 
                                                    onClick={() => onLoad(item)} 
                                                    className="p-2 rounded-full bg-brand-surface hover:bg-brand-primary hover:text-white text-brand-subtle transition-all shadow-metal hover:scale-110 active:scale-100"
                                                    title="Load this entry"
                                                    aria-label="Load this history entry"
                                                >
                                                    <LoadIcon className="w-5 h-5"/>
                                                </button>
                                                <button 
                                                    onClick={() => onDelete(item.id)} 
                                                    className="p-2 rounded-full bg-brand-surface hover:bg-red-500 hover:text-white text-brand-subtle transition-all shadow-metal hover:scale-110 active:scale-100"
                                                    title="Delete this entry"
                                                    aria-label="Delete this history entry"
                                                >
                                                    <DeleteIcon className="w-5 h-5"/>
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center p-8 text-brand-subtle flex-grow flex flex-col items-center justify-center">
                                     <SearchIcon className="text-6xl opacity-30 mb-4"/>
                                    <p className="font-semibold text-lg">No Matching Slang Found</p>
                                    <p className="text-sm">Try a different search term in the archives.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </aside>
        </>
    );
};