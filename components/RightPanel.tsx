
import React, { useState } from 'react';
import { ViewState } from '../types';
import { Modal } from './Modal';
import { ImageIcon } from './icons/ImageIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface RightPanelProps {
    viewState: ViewState;
    generatedImage: string | null;
    comparisonImage: string | null;
    onDownload: (format: 'png' | 'jpeg') => void;
    onGenerateVariation: () => void;
}

const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <button
        onClick={onClick}
        className="p-3 bg-[#F2F1FA] dark:bg-[#505163] text-[#505163] dark:text-white transition-all hover:scale-105 hover:bg-[#7345F8] hover:text-white"
    >
        {children}
    </button>
);

export const RightPanel: React.FC<RightPanelProps> = ({ viewState, generatedImage, onDownload, onGenerateVariation }) => {
    const [downloadModalOpen, setDownloadModalOpen] = useState(false);

    const handleDownloadClick = (format: 'png' | 'jpeg') => {
        onDownload(format);
        setDownloadModalOpen(false);
    };

    return (
        <div className="bg-white dark:bg-[#2B2A2E] p-6 shadow-xl flex flex-col items-center gap-6 h-full min-h-[500px] lg:min-h-0">
            <div className="w-full flex-1 flex items-center justify-center overflow-hidden bg-[#F0F0F0] dark:bg-[#201f23] relative aspect-square">
                {viewState === ViewState.PLACEHOLDER && (
                    <div className="flex flex-col items-center justify-center text-[#BFC1C8] dark:text-[#505163] text-center p-4">
                        <ImageIcon className="h-20 w-20 mb-4" />
                        <span className="text-xl font-medium">Your image will appear here.</span>
                    </div>
                )}
                {viewState === ViewState.LOADING && (
                    <div className="flex flex-col items-center">
                        <svg className="animate-spin h-12 w-12 text-[#7345F8]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.96l2-2.67z"></path>
                        </svg>
                        <span className="mt-4 text-[#505163] dark:text-[#BFC1C8]">Unleashing Creativity...</span>
                    </div>
                )}
                {viewState === ViewState.IMAGE && generatedImage && (
                    <img src={generatedImage} alt="Generated" className="relative z-10 w-full h-full object-contain" />
                )}
            </div>
            {viewState === ViewState.IMAGE && (
                <div className="w-full flex justify-center gap-4">
                    <ActionButton onClick={() => setDownloadModalOpen(true)}>
                        <DownloadIcon className="h-6 w-6" />
                    </ActionButton>
                    <ActionButton onClick={onGenerateVariation}>
                        <SparklesIcon className="h-6 w-6" />
                    </ActionButton>
                    <Modal
                        isOpen={downloadModalOpen}
                        onClose={() => setDownloadModalOpen(false)}
                        title="Choose Download Format"
                    >
                        <div className="flex gap-4 mt-4">
                            <button onClick={() => handleDownloadClick('png')} className="flex-1 p-4 bg-[#7345F8] text-white font-bold hover:bg-purple-700 transition-colors">PNG</button>
                            <button onClick={() => handleDownloadClick('jpeg')} className="flex-1 p-4 bg-[#7345F8] text-white font-bold hover:bg-purple-700 transition-colors">JPEG</button>
                        </div>
                    </Modal>
                </div>
            )}
        </div>
    );
};
