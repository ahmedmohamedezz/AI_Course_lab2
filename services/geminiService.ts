
import { GoogleGenAI, Modality } from "@google/genai";
import { ResultData } from '../types';
import { fileToBase64, readFileAsText } from '../utils/fileUtils';

// IMPORTANT: Do not expose this key in a real-world frontend application.
// This is for demonstration purposes only. In a production environment,
// API calls should be made from a backend server.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey });

export const generateImage = async (prompt: string): Promise<ResultData> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return { type: 'image', content: base64ImageBytes };
            }
        }
        throw new Error("No image was generated. The response may have been blocked.");
    } catch (error) {
        console.error("Image generation failed:", error);
        throw new Error("Failed to generate image. Please check the prompt or API configuration.");
    }
};

export const getVisionResponse = async (prompt: string, imageFile: File): Promise<ResultData> => {
    try {
        const base64Image = await fileToBase64(imageFile);
        const imagePart = {
            inlineData: {
                mimeType: imageFile.type,
                data: base64Image,
            },
        };
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        return { type: 'text', content: response.text };
    } catch (error) {
        console.error("Vision analysis failed:", error);
        throw new Error("Failed to analyze image. The file might be corrupted or in an unsupported format.");
    }
};

export const chatWithFile = async (prompt: string, textFile: File): Promise<ResultData> => {
    try {
        const fileContent = await readFileAsText(textFile);
        const fullPrompt = `
CONTEXT from the file "${textFile.name}":
---
${fileContent}
---

Based on the context above, answer the following question:
${prompt}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });

        return { type: 'text', content: response.text };
    } catch (error) {
        console.error("Chat with file failed:", error);
        throw new Error("Failed to process the file. Please ensure it's a valid text file.");
    }
};
