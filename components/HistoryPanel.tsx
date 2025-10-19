
import React from 'react';

interface HistoryPanelProps {
    history: string[];
    onSelect: (imageUrl: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect }) => {
    return (
        <div className="bg-white dark:bg-[#2B2A2E] p-6 shadow-xl">
            <h2 className="text-xl font-bold text-[#2B2A2E] dark:text-white mb-4">Recent History</h2>
            {history.length === 0 ? (
                <div className="text-center text-[#BFC1C8] dark:text-[#505163] py-8">
                    Your image history will appear here.
                </div>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {history.map((imageUrl, index) => (
                        <div key={index} onClick={() => onSelect(imageUrl)} className="relative aspect-square overflow-hidden cursor-pointer group">
                            <img src={imageUrl} alt={`History ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-white text-sm font-medium">Use Image</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
