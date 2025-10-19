
import React from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-[#F8F7FB] dark:bg-[#505163] shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-95 opacity-0 animate-scale-in text-[#505163] dark:text-[#F2F1FA]"
                onClick={(e) => e.stopPropagation()}
                style={{ animationFillMode: 'forwards' }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>
                {children}
            </div>
            <style>{`
                @keyframes scale-in {
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                .animate-scale-in {
                    animation-name: scale-in;
                    animation-duration: 0.2s;
                    animation-timing-function: ease-out;
                }
            `}</style>
        </div>
    );
};
