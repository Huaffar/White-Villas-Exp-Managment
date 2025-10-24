
import React, { useState, useRef } from 'react';
import { editImageWithPrompt } from '../services/geminiService';

const ImageEditor: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [originalMimeType, setOriginalMimeType] = useState<string | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    // Result is "data:mime/type;base64,..." - we need to strip the prefix
                    resolve(reader.result.split(',')[1]);
                } else {
                    reject(new Error("Failed to read blob as base64 string."));
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setError(null);
            setEditedImage(null);
            setOriginalMimeType(file.type);
            const base64 = await blobToBase64(file);
            setOriginalImage(base64);
        }
    };
    
    const handleSubmit = async () => {
        if (!originalImage || !prompt || !originalMimeType) {
            setError('Please upload an image and enter a prompt.');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setEditedImage(null);
        
        try {
            const newImageBase64 = await editImageWithPrompt(originalImage, originalMimeType, prompt);
            setEditedImage(newImageBase64);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const commonImageClasses = "w-full h-full object-contain";
    const imageContainerClasses = "aspect-video bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden";
    
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">AI Image Editor</h2>
            <p className="text-gray-300 mb-6">Upload an image and use a text prompt to edit it with Gemini. Try "Add a retro filter" or "Make the sky look like a sunset".</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className={imageContainerClasses}>
                    {originalImage ? (
                        <img src={`data:${originalMimeType};base64,${originalImage}`} alt="Original" className={commonImageClasses} />
                    ) : (
                        <span>Original Image</span>
                    )}
                </div>
                <div className={imageContainerClasses}>
                    {isLoading ? (
                         <div className="flex flex-col items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="mt-2 text-gray-300">Generating...</span>
                        </div>
                    ) : editedImage ? (
                        <img src={`data:image/png;base64,${editedImage}`} alt="Edited" className={commonImageClasses} />
                    ) : (
                        <span>Edited Image</span>
                    )}
                </div>
            </div>

            {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4 text-center">{error}</div>}

            <div className="flex flex-col sm:flex-row gap-4">
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                />
                 <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="w-full sm:w-auto flex-shrink-0 px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-200">
                    {originalImage ? 'Change Image' : 'Upload Image'}
                </button>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your edit prompt..."
                    className="flex-grow bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    disabled={!originalImage || isLoading}
                />
                <button
                    onClick={handleSubmit}
                    disabled={!originalImage || !prompt || isLoading}
                    className="w-full sm:w-auto flex-shrink-0 px-6 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    Generate
                </button>
            </div>
        </div>
    );
};

export default ImageEditor;
