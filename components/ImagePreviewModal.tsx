
import React from 'react';
import { CloseIcon } from './ui/Icons';

interface ImagePreviewModalProps {
    imageUrl: string | null;
    onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `slangbot_certificate_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black/80 z-40 transition-opacity animate-[fade-in_0.2s_ease-out]"
                onClick={onClose}
                aria-hidden="true"
            ></div>

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
                <div 
                    className="bg-brand-surface border-4 border-brand-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-transform animate-[scale-up_0.2s_ease-out]"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="image-preview-title"
                >
                    <header className="p-4 flex items-center justify-between border-b-2 border-brand-border flex-shrink-0">
                        <h2 id="image-preview-title" className="text-xl font-semibold text-brand-text">Your Certificate</h2>
                        <button onClick={onClose} className="p-1 rounded-full text-brand-subtle hover:bg-brand-border hover:text-brand-text transition-colors" aria-label="Close image preview">
                            <CloseIcon />
                        </button>
                    </header>
                    <div className="flex-grow p-4 overflow-auto flex items-center justify-center bg-brand-bg">
                        <img 
                            src={imageUrl} 
                            alt="Generated slang certificate" 
                            className="max-w-full max-h-full object-contain rounded-md shadow-lg"
                        />
                    </div>
                     <footer className="p-4 bg-brand-surface-alt border-t-2 border-brand-border flex-shrink-0 flex items-center justify-end gap-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-md bg-brand-surface hover:bg-brand-border text-brand-subtle hover:text-brand-text transition-all duration-200 shadow-metal hover:scale-105 active:scale-100"
                        >
                            Close
                        </button>
                        <button
                            onClick={handleDownload}
                            className="px-6 py-2 rounded-md bg-brand-primary text-white font-bold shadow-metal transform hover:-translate-y-0.5 transition-all duration-300 border-t-2 border-orange-300 border-l-2 hover:shadow-glow-primary active:translate-y-0"
                        >
                            Download
                        </button>
                    </footer>
                </div>
            </div>
        </>
    );
};