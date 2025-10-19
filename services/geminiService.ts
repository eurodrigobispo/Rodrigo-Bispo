
import { GoogleGenAI, Modality } from "@google/genai";
import { fileToBase64 } from '../utils/fileUtils';
import { AspectRatio } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateOrEditImage = async (
    prompt: string,
    images: File[],
    aspectRatio: AspectRatio,
): Promise<string> => {
    try {
        if (images.length > 0) {
            // Editing or Fusion mode with gemini-2.5-flash-image
            const imageParts = await Promise.all(
                images.map(async (imageFile) => {
                    const base64Data = await fileToBase64(imageFile);
                    return {
                        inlineData: {
                            data: base64Data,
                            mimeType: imageFile.type,
                        },
                    };
                })
            );

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: prompt }, ...imageParts] },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });
            
            const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
            if (part?.inlineData?.data) {
                return part.inlineData.data;
            } else {
                throw new Error("API did not return image data for editing.");
            }

        } else {
            // Generation from scratch with imagen-4.0-generate-001
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    aspectRatio: aspectRatio,
                },
            });

            if (response.generatedImages?.[0]?.image?.imageBytes) {
                return response.generatedImages[0].image.imageBytes;
            } else {
                throw new Error("API did not return image data for generation.");
            }
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate or edit image. Please check the console for details.");
    }
};
