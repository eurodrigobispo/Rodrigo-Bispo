
import React, { useState, useCallback, useEffect } from 'react';
import { AppMode, CreateFunction, EditFunction, AspectRatio, CreateStyle, ViewState, ImageFile, GenerationConfig } from './types';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { Modal } from './components/Modal';
import { generateOrEditImage } from './services/geminiService';
import { useTheme } from './hooks/useTheme';
import { dataUrlToFile } from './utils/fileUtils';

const createStyleInstructions: Record<CreateStyle, string> = {
    [CreateStyle.CINEMATIC]: 'cinematic style',
    [CreateStyle.EIGHT_K]: '8k resolution, ultra detailed',
    [CreateStyle.REALISTIC]: 'photorealistic, hyper-realism',
    [CreateStyle.ILLUSTRATION]: 'illustration style, digital art',
};

export default function App() {
    // UI State
    const [prompt, setPrompt] = useState('');
    const [mode, setMode] = useState<AppMode>(AppMode.CREATE);
    const [viewState, setViewState] = useState<ViewState>(ViewState.PLACEHOLDER);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [theme, toggleTheme] = useTheme();

    // Generation Config State
    const [createFn, setCreateFn] = useState<CreateFunction>(CreateFunction.FREE);
    const [editFn, setEditFn] = useState<EditFunction>(EditFunction.ADD_REMOVE);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
    const [createStyle, setCreateStyle] = useState<CreateStyle | null>(null);

    // Image State
    const [image1, setImage1] = useState<ImageFile | null>(null);
    const [image2, setImage2] = useState<ImageFile | null>(null);
    const [image3, setImage3] = useState<ImageFile | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [comparisonImage, setComparisonImage] = useState<string | null>(null);
    
    // History & Variation State
    const [history, setHistory] = useState<string[]>(() => {
        try {
            const savedHistory = localStorage.getItem('innapse-ai-history');
            return savedHistory ? JSON.parse(savedHistory) : [];
        } catch (error) {
            console.error("Failed to load history from localStorage", error);
            return [];
        }
    });
    const [lastGenerationConfig, setLastGenerationConfig] = useState<GenerationConfig | null>(null);

    useEffect(() => {
        localStorage.setItem('innapse-ai-history', JSON.stringify(history));
    }, [history]);

    const showMessage = (msg: string) => {
        setMessage(msg);
    };

    const handleGenerate = useCallback(async (isVariation: boolean = false) => {
        const configToUse = isVariation ? lastGenerationConfig : { prompt, mode, createFn, editFn, aspectRatio, createStyle, image1, image2, image3 };

        if (!configToUse) {
            showMessage("Please generate an image first to create a variation.");
            return;
        }

        if (!configToUse.prompt.trim()) {
            showMessage("Please write your idea in the prompt!");
            return;
        }

        setIsLoading(true);
        setViewState(ViewState.LOADING);
        setComparisonImage(isVariation ? generatedImage : null);
        setGeneratedImage(null);

        try {
            let finalPrompt = '';
            let images: File[] = [];

            if (configToUse.mode === AppMode.CREATE) {
                if (configToUse.createFn === CreateFunction.FREE) {
                    const styleKeyword = configToUse.createStyle ? `, ${createStyleInstructions[configToUse.createStyle]}` : '';
                    finalPrompt = `Innapse.AI Style — high sharpness, balanced contrast. ${configToUse.prompt}${styleKeyword}`;
                } else { // FUSION_MODE
                    if (!configToUse.image1 && !configToUse.image2 && !configToUse.image3) {
                        throw new Error("Please upload at least one image for Fusion Mode.");
                    }
                    finalPrompt = `Create a new image by fusing the provided reference images, enhancing face details, lighting, and background. ${configToUse.prompt}.`;
                    [configToUse.image1, configToUse.image2, configToUse.image3].forEach(img => img && images.push(img.file));
                }
            } else { // EDIT MODE
                finalPrompt = configToUse.prompt;
                if (configToUse.editFn === EditFunction.COMPOSE) {
                    if (!configToUse.image1 || !configToUse.image2) throw new Error("Please select two images for Compose function.");
                    images.push(configToUse.image1.file, configToUse.image2.file);
                } else {
                    if (!configToUse.image1) throw new Error("Please select an image to edit.");
                    images.push(configToUse.image1.file);
                }
            }
            
            const resultBase64 = await generateOrEditImage(finalPrompt, images, configToUse.aspectRatio);
            const imageUrl = `data:image/png;base64,${resultBase64}`;
            setGeneratedImage(imageUrl);
            setViewState(ViewState.IMAGE);
            
            if (!isVariation) {
                setLastGenerationConfig(configToUse as GenerationConfig);
            }

            setHistory(prev => [imageUrl, ...prev].slice(0, 18));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            showMessage(errorMessage);
            setViewState(comparisonImage ? ViewState.IMAGE : ViewState.PLACEHOLDER);
            setGeneratedImage(comparisonImage);
        } finally {
            setIsLoading(false);
        }
    }, [prompt, mode, createFn, editFn, aspectRatio, createStyle, image1, image2, image3, lastGenerationConfig, generatedImage, comparisonImage]);

    const handleDownload = useCallback((format: 'png' | 'jpeg') => {
        if (!generatedImage) return;

        const a = document.createElement('a');
        a.href = generatedImage;
        a.download = `innapse_ai_image.${format}`;
        
        if (format === 'jpeg') {
            const img = new Image();
            img.src = generatedImage;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    a.href = canvas.toDataURL('image/jpeg', 0.92);
                }
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
        } else {
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }, [generatedImage]);

    const handleSelectFromHistory = useCallback(async (imageUrl: string) => {
        const file = await dataUrlToFile(imageUrl, 'history-image.png');
        setImage1({ file, previewUrl: imageUrl });
        setImage2(null);
        setImage3(null);
        setGeneratedImage(imageUrl);
        setMode(AppMode.EDIT);
        setEditFn(EditFunction.ADD_REMOVE);
        setPrompt('');
        setViewState(ViewState.IMAGE);
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="container max-w-screen-xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[minmax(380px,420px)_1fr] gap-6 items-start">
            <LeftPanel
                prompt={prompt} setPrompt={setPrompt}
                mode={mode} setMode={setMode}
                createFn={createFn} setCreateFn={setCreateFn}
                editFn={editFn} setEditFn={setEditFn}
                aspectRatio={aspectRatio} setAspectRatio={setAspectRatio}
                createStyle={createStyle} setCreateStyle={setCreateStyle}
                image1={image1} setImage1={setImage1}
                image2={image2} setImage2={setImage2}
                image3={image3} setImage3={setImage3}
                onGenerate={() => handleGenerate(false)}
                isLoading={isLoading}
                theme={theme} toggleTheme={toggleTheme}
            />
            <div className="flex flex-col gap-6">
                <RightPanel
                    viewState={viewState}
                    generatedImage={generatedImage}
                    comparisonImage={comparisonImage}
                    onDownload={handleDownload}
                    onGenerateVariation={() => handleGenerate(true)}
                />
                <HistoryPanel history={history} onSelect={handleSelectFromHistory} />
            </div>
            <Modal
                isOpen={!!message}
                onClose={() => setMessage(null)}
                title="Notification"
            >
                <p className="text-[#505163] dark:text-[#F2F1FA]">{message}</p>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={() => setMessage(null)}
                        className="p-2 px-6 bg-[#7345F8] text-white font-bold hover:bg-purple-700 transition-colors"
                    >
                        OK
                    </button>
                </div>
            </Modal>
        </main>
    );
}
