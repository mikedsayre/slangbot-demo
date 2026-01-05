
import React from 'react';

export const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
    const elements = text.split('\n').map((line, index) => {
        if (line.trim() === '') {
            return <div key={index} className="h-4"></div>;
        }

        const indentMatch = line.match(/^(\s*)/);
        const indentSize = indentMatch ? indentMatch[1].length : 0;
        const paddingLeft = Math.floor(indentSize / 4) * 24;

        let isListItem = line.trim().startsWith('* ');
        let processedLine = isListItem ? line.trim().substring(2) : line.trim();
        
        // A line is a "heading" if it's just one bolded segment
        const isHeading = processedLine.startsWith('**') && processedLine.endsWith('**') && processedLine.split('**').length === 3;

        const parts = processedLine.split(/(\*\*.*?\*\*|'.*?')/g).filter(Boolean);

        const renderedParts = parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-sky-300 font-semibold">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith("'") && part.endsWith("'")) {
                return <code key={i} className="text-amber-400 bg-black/20 px-1 rounded">{part}</code>;
            }
            return <span key={i}>{part}</span>;
        });

        if (isListItem) {
            return (
                <div key={index} className="flex" style={{ paddingLeft: `${paddingLeft}px` }}>
                    <span className="text-brand-primary mr-2">&#8226;</span>
                    <p className="flex-1">{renderedParts}</p>
                </div>
            );
        }

        return <p key={index} className={isHeading ? 'text-lg font-bold' : ''}>{renderedParts}</p>;
    });

    return <div className="space-y-1 p-4 text-brand-crt-text selection:bg-brand-primary/30">{elements}</div>;
};
