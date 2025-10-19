
import React from 'react';
import { AppMode, CreateFunction, EditFunction, AspectRatio, CreateStyle, ImageFile } from '../types';
import { ImageUploader } from './ImageUploader';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface LeftPanelProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    mode: AppMode;
    setMode: (mode: AppMode) => void;
    createFn: CreateFunction;
    setCreateFn: (fn: CreateFunction) => void;
    editFn: EditFunction;
    setEditFn: (fn: EditFunction) => void;
    aspectRatio: AspectRatio;
    setAspectRatio: (ratio: AspectRatio) => void;
    createStyle: CreateStyle | null;
    setCreateStyle: (style: CreateStyle | null) => void;
    image1: ImageFile | null;
    setImage1: (image: ImageFile | null) => void;
    image2: ImageFile | null;
    setImage2: (image: ImageFile | null) => void;
    image3: ImageFile | null;
    setImage3: (image: ImageFile | null) => void;
    onGenerate: () => void;
    isLoading: boolean;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const createStyleInstructions: Record<CreateStyle, string> = {
    [CreateStyle.CINEMATIC]: 'Cinematic',
    [CreateStyle.EIGHT_K]: '8K',
    [CreateStyle.REALISTIC]: 'Realistic',
    [CreateStyle.ILLUSTRATION]: 'Illustration',
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-3">
        <label className="text-sm font-semibold text-[#505163] dark:text-[#BFC1C8] uppercase tracking-wider">{title}</label>
        {children}
    </div>
);

const ModeButton: React.FC<{ onClick: () => void; isActive: boolean; children: React.ReactNode }> = ({ onClick, isActive, children }) => (
    <button
        onClick={onClick}
        className={`flex-1 p-2.5 font-semibold transition-all duration-200 text-sm ${isActive ? 'bg-[#7345F8] text-white shadow-lg' : 'bg-[#F2F1FA] dark:bg-[#2B2A2E] text-[#505163] dark:text-[#F0F0F0] hover:bg-gray-200 dark:hover:bg-gray-700'}`}
    >
        {children}
    </button>
);

const OptionButton: React.FC<{ onClick: () => void; isActive: boolean; children: React.ReactNode; className?: string }> = ({ onClick, isActive, children, className="" }) => (
    <button
        onClick={onClick}
        className={`p-3 text-sm font-medium transition-colors border-2 ${isActive ? 'bg-[#7345F8] text-white border-transparent' : 'bg-transparent border-[#BFC1C8] dark:border-[#505163] text-[#505163] dark:text-[#F0F0F0] hover:border-[#7345F8] hover:text-[#7345F8] dark:hover:text-[#7345F8]'} ${className}`}
    >
        {children}
    </button>
);

export const LeftPanel: React.FC<LeftPanelProps> = (props) => {
    const {
        prompt, setPrompt, mode, setMode, createFn, setCreateFn, editFn, setEditFn, aspectRatio, setAspectRatio,
        createStyle, setCreateStyle, image1, setImage1, image2, setImage2, image3, setImage3, onGenerate, isLoading, theme, toggleTheme
    } = props;

    const handleCreateStyleChange = (style: CreateStyle) => {
        setCreateStyle(style === createStyle ? null : style);
    };

    const isFusionMode = mode === AppMode.CREATE && createFn === CreateFunction.FUSION_MODE;
    const isCompose = mode === AppMode.EDIT && editFn === EditFunction.COMPOSE;
    const hasImageLoadedForCreate = !!image1 || !!image2 || !!image3;

    return (
        <div className="bg-white dark:bg-[#2B2A2E] p-6 shadow-2xl flex flex-col gap-8 h-full sticky top-6">
            <header className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-[#2B2A2E] dark:text-white">Innapse<span className="text-[#7345F8]">.Ai</span></h1>
                <button onClick={toggleTheme} className="p-2 text-[#505163] dark:text-[#BFC1C8] transition-colors hover:text-[#7345F8] dark:hover:text-[#7345F8]">
                    {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                </button>
            </header>

            <Section title="Operation Mode">
                <div className="flex items-center gap-1 bg-[#E8E7F3] dark:bg-[#505163] p-1">
                    <ModeButton onClick={() => setMode(AppMode.CREATE)} isActive={mode === AppMode.CREATE}>Create</ModeButton>
                    <ModeButton onClick={() => setMode(AppMode.EDIT)} isActive={mode === AppMode.EDIT}>Edit</ModeButton>
                </div>
            </Section>

            {mode === AppMode.CREATE && (
                <>
                    <Section title="Function">
                        <div className="grid grid-cols-2 gap-2">
                           <OptionButton onClick={() => setCreateFn(CreateFunction.FREE)} isActive={createFn === CreateFunction.FREE}>Free Creation</OptionButton>
                           <OptionButton onClick={() => setCreateFn(CreateFunction.FUSION_MODE)} isActive={createFn === CreateFunction.FUSION_MODE}>Fusion Mode</OptionButton>
                        </div>
                    </Section>
                    
                    <Section title="Styles">
                        <div className="grid grid-cols-2 gap-2">
                            {Object.values(CreateStyle).map(style => (
                                <OptionButton key={style} onClick={() => handleCreateStyleChange(style)} isActive={createStyle === style}>
                                    {createStyleInstructions[style]}
                                </OptionButton>
                            ))}
                        </div>
                    </Section>
                    
                    <Section title="Aspect Ratio">
                        {isFusionMode && hasImageLoadedForCreate ? (
                             <div className="p-3 text-center bg-[#F2F1FA] dark:bg-[#505163] text-xs text-[#505163] dark:text-[#BFC1C8]">
                                Aspect ratio is defined by the input image.
                            </div>
                        ) : (
                             <div className="grid grid-cols-3 gap-2">
                                <OptionButton onClick={() => setAspectRatio(AspectRatio.SQUARE)} isActive={aspectRatio === AspectRatio.SQUARE}>1:1</OptionButton>
                                <OptionButton onClick={() => setAspectRatio(AspectRatio.LANDSCAPE)} isActive={aspectRatio === AspectRatio.LANDSCAPE}>16:9</OptionButton>
                                <OptionButton onClick={() => setAspectRatio(AspectRatio.PORTRAIT)} isActive={aspectRatio === AspectRatio.PORTRAIT}>9:16</OptionButton>
                            </div>
                        )}
                    </Section>

                    {isFusionMode && (
                        <Section title="Images">
                            <div className="grid grid-cols-2 gap-4">
                               <ImageUploader image={image1} setImage={setImage1} id="image-upload-1" label="Image 1" />
                               <ImageUploader image={image2} setImage={setImage2} id="image-upload-2" label="Image 2" />
                               <div className="col-span-2">
                                   <ImageUploader image={image3} setImage={setImage3} id="image-upload-3" label="Image 3" />
                               </div>
                            </div>
                        </Section>
                    )}
                </>
            )}

            {mode === AppMode.EDIT && (
                 <Section title="Function">
                    <div className="grid grid-cols-2 gap-2">
                         <OptionButton onClick={() => setEditFn(EditFunction.ADD_REMOVE)} isActive={editFn === EditFunction.ADD_REMOVE}>Add/Remove</OptionButton>
                         <OptionButton onClick={() => setEditFn(EditFunction.STYLE)} isActive={editFn === EditFunction.STYLE}>Stylize</OptionButton>
                         <OptionButton onClick={() => setEditFn(EditFunction.RETOUCH)} isActive={editFn === EditFunction.RETOUCH}>Retouch</OptionButton>
                         <OptionButton onClick={() => setEditFn(EditFunction.COMPOSE)} isActive={editFn === EditFunction.COMPOSE}>Compose</OptionButton>
                    </div>
                 </Section>
            )}
            
            <Section title="Your Idea">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A white cat astronaut in a spaceship..."
                    className="w-full h-28 p-4 border-2 border-[#BFC1C8] dark:border-[#505163] bg-transparent text-[#2B2A2E] dark:text-white resize-none focus:ring-2 focus:ring-[#7345F8] focus:border-transparent outline-none transition-all"
                />
            </Section>

            <button
                onClick={onGenerate}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 p-4 font-bold text-white bg-[#7345F8] shadow-lg shadow-purple-500/20 transition-all duration-300 hover:bg-purple-700 disabled:bg-[#BFC1C8] disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.96l2-2.67z"></path>
                        </svg>
                        <span>Generating...</span>
                    </>
                ) : (
                    <>
                    <span>Generate</span>
                    <ArrowRightIcon className="w-5 h-5" />
                    </>
                )}
            </button>
        </div>
    );
};
