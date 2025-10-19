
import React, { useCallback } from 'react';
import { ImageIcon } from './icons/ImageIcon';
import { CloseIcon } from './icons/CloseIcon';
import { ImageFile } from '../types';

interface ImageUploaderProps {
    image: ImageFile | null;
    setImage: (image: ImageFile | null) => void;
    id: string;
    label: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ image, setImage, id, label }) => {

    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImage({ file, previewUrl });
        }
    }, [setImage]);
    
    return (
        <div className="relative">
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id={id}
            />
            <label htmlFor={id} className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed transition-colors cursor-pointer bg-[#F8F7FB] dark:bg-[#505163] ${image ? 'border-transparent' : 'border-[#BFC1C8] dark:border-[#505163] hover:border-[#7345F8] dark:hover:border-[#7345F8]'}`}>
                {image ? (
                    <img src={image.previewUrl} alt={label} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-center text-[#505163] dark:text-[#BFC1C8]">
                        <ImageIcon className="mx-auto h-8 w-8 mb-1" />
                        <span className="text-sm">{label}</span>
                    </div>
                )}
            </label>
            {image && (
                <button
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white shadow-lg transition-transform hover:scale-110"
                >
                    <CloseIcon className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};
