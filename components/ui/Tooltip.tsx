import React from 'react';

interface TooltipProps {
    text: string;
    children: React.ReactNode;
    className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children, className }) => {
    return (
        <div className={`group relative flex items-center ${className || ''}`}>
            {children}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs scale-0 transform transition-all group-hover:scale-100 origin-bottom pointer-events-none z-50">
                <div className="bg-brand-surface border border-brand-border text-brand-text text-xs rounded-lg py-1.5 px-3 shadow-lg">
                    {text}
                </div>
                <div className="w-3 h-3 -mt-2 rotate-45 bg-brand-surface border-r border-b border-brand-border mx-auto"></div>
            </div>
        </div>
    );
};