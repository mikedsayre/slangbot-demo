
import React, { useRef, useCallback } from 'react';
import { Tooltip } from './Tooltip';
import { QuestionCircleIcon } from './Icons';

interface DialProps {
    id: string;
    label: string;
    tooltip: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (value: number) => void;
    disabled: boolean;
    startLabel: string;
    endLabel: string;
    className?: string;
}

const MIN_DEG = -135;
const MAX_DEG = 135;
const DEG_RANGE = MAX_DEG - MIN_DEG;

export const Dial: React.FC<DialProps> = ({
    id,
    label,
    tooltip,
    min,
    max,
    step,
    value,
    onChange,
    disabled,
    startLabel,
    endLabel,
    className
}) => {
    const dialRef = useRef<HTMLDivElement>(null);
    const range = max - min;
    const percentage = range > 0 ? ((value - min) / range) : 0;
    const rotation = MIN_DEG + percentage * DEG_RANGE;

    const handleValueChange = useCallback((newValue: number) => {
        const steppedValue = Math.round(newValue / step) * step;
        const clampedValue = Math.max(min, Math.min(max, steppedValue));
        if (clampedValue !== value) {
            onChange(clampedValue);
        }
    }, [min, max, step, value, onChange]);

    const handleInteraction = useCallback((clientX: number, clientY: number) => {
        if (!dialRef.current) return;
        const rect = dialRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angleRad = Math.atan2(clientY - centerY, clientX - centerX);
        let angleDeg = angleRad * (180 / Math.PI);
        
        angleDeg += 90; 
        if (angleDeg > 180) angleDeg -= 360;

        const clampedDeg = Math.max(MIN_DEG, Math.min(MAX_DEG, angleDeg));
        const newPercentage = (clampedDeg - MIN_DEG) / DEG_RANGE;
        const newValue = min + newPercentage * range;
        
        handleValueChange(newValue);

    }, [range, min, handleValueChange]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        handleInteraction(e.clientX, e.clientY);
    }, [handleInteraction]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if(e.touches.length > 0) {
            handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, [handleInteraction]);

    const handleInteractionEnd = useCallback(() => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleInteractionEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleInteractionEnd);
    }, [handleMouseMove, handleTouchMove]);
    
    const handleInteractionStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (disabled) return;
        e.preventDefault();
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleInteractionEnd);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleInteractionEnd);
    }, [disabled, handleMouseMove, handleInteractionEnd, handleTouchMove]);


    // Ticks for the dial face
    const numTicks = max - min + 1;
    const ticks = Array.from({ length: numTicks }, (_, i) => {
        const tickValue = i + min;
        const tickRotation = MIN_DEG + (i / (numTicks - 1)) * DEG_RANGE;
        const isMaxTick = tickValue === max;
        return <div key={i} className={`dial-tick ${isMaxTick ? 'max-tick' : ''}`} style={{ transform: `rotate(${tickRotation}deg)` }} />;
    });

    const isMaxValue = value === max;

    return (
        <div className={`flex flex-col items-center gap-2 ${className}`}>
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-1.5">
                    <label htmlFor={id} className="block text-sm font-bold text-brand-subtle uppercase tracking-wider">
                        {label}
                    </label>
                    <Tooltip text={tooltip}>
                        <QuestionCircleIcon className="h-4 w-4 text-brand-subtle cursor-help" />
                    </Tooltip>
                </div>
                <div className={`bg-brand-crt-bg font-mono font-bold text-lg rounded-md px-3 py-1 tabular-nums border-2 border-brand-metal shadow-inner transition-colors duration-200 ${isMaxValue ? 'text-red-500' : 'text-brand-crt-text'}`}>
                    {value}
                </div>
            </div>
            
            <div 
                ref={dialRef}
                className="dial-container"
                onMouseDown={handleInteractionStart}
                onTouchStart={handleInteractionStart}
            >
                <div className="dial-base">
                    <div className="dial-ticks">{ticks}</div>
                     <div
                        className="dial-knob-rotator"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                        <div className="dial-knob">
                            <div className={`dial-knob-indicator ${isMaxValue ? 'bg-red-500' : 'bg-brand-primary'}`} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between w-full text-xs text-brand-subtle mt-1 px-1">
                <span>{startLabel}</span>
                <span>{endLabel}</span>
            </div>
        </div>
    );
};