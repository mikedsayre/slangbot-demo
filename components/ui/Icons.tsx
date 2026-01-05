

import React from 'react';

interface IconProps {
    className?: string;
    style?: React.CSSProperties;
}

const Icon: React.FC<{ name: string } & IconProps> = ({ name, className, style }) => (
    <span className={`material-symbols-outlined ${className || ''}`} aria-hidden="true" style={style}>
        {name}
    </span>
);

export const TuneIcon: React.FC<IconProps> = (props) => <Icon name="tune" {...props} />;
export const HistoryIcon: React.FC<IconProps> = (props) => <Icon name="history" {...props} />;
export const QuestionMarkIcon: React.FC<IconProps> = (props) => <Icon name="help" {...props} />;
export const SparklesIcon: React.FC<IconProps> = (props) => <Icon name="auto_awesome" {...props} />;
export const MicrophoneIcon: React.FC<IconProps> = (props) => <Icon name="mic" {...props} />;
export const InfoIcon: React.FC<IconProps> = (props) => <Icon name="info" {...props} />;
export const CopyIcon: React.FC<IconProps> = (props) => <Icon name="content_copy" {...props} />;
export const CheckIcon: React.FC<IconProps> = (props) => <Icon name="check" {...props} />;
export const ErrorIcon: React.FC<IconProps> = (props) => <Icon name="error" {...props} />;
export const SearchIcon: React.FC<IconProps> = (props) => <Icon name="search" {...props} />;
export const LoadIcon: React.FC<IconProps> = (props) => <Icon name="replay" {...props} />;
export const DeleteIcon: React.FC<IconProps> = (props) => <Icon name="delete" {...props} />;
export const CloseIcon: React.FC<IconProps> = (props) => <Icon name="close" {...props} />;
export const ShareIcon: React.FC<IconProps> = (props) => <Icon name="share" {...props} />;
export const BeakerIcon: React.FC<IconProps> = (props) => <Icon name="science" {...props} />;
export const ColorPaletteIcon: React.FC<IconProps> = (props) => <Icon name="palette" {...props} />;
export const LightbulbIcon: React.FC<IconProps> = (props) => <Icon name="lightbulb" {...props} />;
export const StampIcon: React.FC<IconProps> = (props) => <Icon name="military_tech" {...props} />;
export const ArticleIcon: React.FC<IconProps> = (props) => <Icon name="article" {...props} />;
export const SchoolIcon: React.FC<IconProps> = (props) => <Icon name="school" {...props} />;
export const GroupIcon: React.FC<IconProps> = (props) => <Icon name="group" {...props} />;
export const QuoteIcon: React.FC<IconProps> = (props) => <Icon name="format_quote" {...props} />;

// Icons for Duct-Taped Mods
export const BlurOnIcon: React.FC<IconProps> = (props) => <Icon name="blur_on" {...props} />;
export const TrendingUpIcon: React.FC<IconProps> = (props) => <Icon name="trending_up" {...props} />;
export const WaterDropIcon: React.FC<IconProps> = (props) => <Icon name="water_drop" {...props} />;
export const EmergencyIcon: React.FC<IconProps> = (props) => <Icon name="emergency" {...props} />;

// Icons for Sound Toggle
export const VolumeUpIcon: React.FC<IconProps> = (props) => <Icon name="volume_up" {...props} />;
export const VolumeOffIcon: React.FC<IconProps> = (props) => <Icon name="volume_off" {...props} />;

// Icons for TTS
export const PlayCircleIcon: React.FC<IconProps> = (props) => <Icon name="play_circle" {...props} />;
export const StopCircleIcon: React.FC<IconProps> = (props) => <Icon name="stop_circle" {...props} />;

// Icons for Cognitive Amplifiers
export const RadarIcon: React.FC<IconProps> = (props) => <Icon name="radar" {...props} />;
export const DnaIcon: React.FC<IconProps> = (props) => <Icon name="biotech" {...props} />;
export const HeartPulseIcon: React.FC<IconProps> = (props) => <Icon name="monitor_heart" {...props} />;


export const QuestionCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);