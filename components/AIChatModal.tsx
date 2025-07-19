import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { IconX } from './icons/IconX';
import { IconSparkles } from './icons/IconSparkles';
import { IconSend } from './icons/IconSend';
import { IconDownload } from './icons/IconDownload';
import IconSpinner from './icons/IconSpinner';
import { ChatMessage } from '../types';
import { AI_CONTEXT_DOCUMENT } from '../constants';
import TypingIndicator from './TypingIndicator';
import MarkdownRenderer from './MarkdownRenderer';
import { IconMaximize } from './icons/IconMaximize';
import { IconMinimize } from './icons/IconMinimize';

interface AIChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  isFullScreen: boolean;
  setIsFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const CHAT_HISTORY_KEY = 'ai_chat_history';


const AIChatWindow: React.FC<AIChatWindowProps> = ({ isOpen, onClose, isFullScreen, setIsFullScreen }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        if (typeof window === 'undefined') return [];
        const savedHistoryRaw = localStorage.getItem(CHAT_HISTORY_KEY);
        if (savedHistoryRaw) {
            try {
                const parsed = JSON.parse(savedHistoryRaw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            } catch (e) {
                console.error("Failed to parse chat history:", e);
            }
        }
        return [{ sender: 'ai', text: "Hello! I'm an AI assistant. Feel free to ask me anything about Abhishek's experience, projects, or skills." }];
    });

    const toggleFullScreen = () => setIsFullScreen(prev => !prev);

    useEffect(() => {
        // Initialize the chat instance once on component mount.
        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const systemInstruction = `You are a helpful and friendly AI assistant representing Abhishek Tiwari. The current date is ${today}. Your answers must be based *only* on the information provided in the context document below.

**Response Guidelines:**
1.  **Persona & Tone:** Always respond in the first person ("I"). Be professional, confident, and helpful. Do not mention that you are an AI or that you're referencing a document.
2.  **Experience Calculation:**
    *   When asked for general experience with a skill (e.g., "experience in AWS"), calculate the total duration from the start date of the *earliest* role where that skill was used until today. This includes internships.
    *   If asked specifically for **"full-time experience"**, you MUST recalculate the duration, excluding any roles explicitly marked as "Intern".
3.  **Handling Skill Gaps:**
    *   If asked about a skill I do *not* have listed (e.g., "Bootstrap"), do not just say you can't answer.
    *   First, state clearly that I don't have professional experience with that specific tool (e.g., "I haven't used Bootstrap in a professional project.").
    *   Then, pivot to a related, relevant skill I *do* have (e.g., "However, I'm highly proficient in Tailwind CSS for creating responsive UIs.").
    *   Conclude by expressing an eagerness to learn new technologies.
4.  **Out-of-Scope Questions:** For questions not related to my professional background, politely decline by saying something like: "I can only answer questions related to my professional background."
5.  **Formatting:** Use only plain text. The only exception is for links. When providing a link, you MUST use markdown format like \`[Descriptive Text](URL)\`. The link text should be descriptive (e.g., "View my Resume") and NOT the raw URL. Do not use any other markdown (no bold, no lists).

Here is the document about my professional background:
${AI_CONTEXT_DOCUMENT}`;

        const historyForGemini = messages
            .filter(msg => (messages.length > 1) || (msg.sender === 'user')) // Don't include the initial welcome message in history
            .map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));
            
        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: historyForGemini,
            config: {
                systemInstruction,
            },
        });
        setChat(newChat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

    useEffect(() => {
        // Save history to localStorage whenever messages change
        if (messages.length > 1) {
            localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
        }
    }, [messages]);

    useEffect(() => {
        // Handle Escape key press
        if (!isOpen) return;
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if(isFullScreen) {
                    setIsFullScreen(false);
                } else {
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose, isFullScreen, setIsFullScreen]);
    
    useLayoutEffect(() => {
        // Scroll to bottom of chat
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const handleDownloadChat = async () => {
        if (!chatContainerRef.current || messages.length <= 1 || isDownloading) return;
    
        setIsDownloading(true);
        const chatElement = chatContainerRef.current;
        
        // Save original styles to restore them later
        const originalStyles = {
            maxHeight: chatElement.style.maxHeight,
            overflowY: chatElement.style.overflowY,
            backgroundColor: chatElement.style.backgroundColor,
        };
        const themeBackgroundColor = window.getComputedStyle(chatElement).backgroundColor;
    
        // Temporarily modify styles to make the entire content visible for capture
        chatElement.style.maxHeight = 'none';
        chatElement.style.overflowY = 'visible';
        chatElement.style.backgroundColor = themeBackgroundColor;
    
        try {
            const canvas = await html2canvas(chatElement, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                backgroundColor: themeBackgroundColor,
                // By making the element overflow visible and removing max-height,
                // html2canvas can capture its entire natural height.
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / pdfWidth;
            const imgHeight = canvasHeight / ratio;
            
            let heightLeft = imgHeight;
            let position = 0;
    
            // Add the first page
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
    
            // Add new pages if content overflows
            while (heightLeft > 0) {
                position -= pdfHeight; // Move the image "up" on the new page
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
    
            pdf.save(`AI-Chat-Abhishek-Tiwari-${new Date().toISOString().split('T')[0]}.pdf`);
    
        } catch (error) {
            console.error("Error generating PDF:", error);
            setError("Sorry, could not generate the PDF. Please try again.");
        } finally {
            // IMPORTANT: Restore original styles
            chatElement.style.maxHeight = originalStyles.maxHeight;
            chatElement.style.overflowY = originalStyles.overflowY;
            chatElement.style.backgroundColor = originalStyles.backgroundColor;
            setIsDownloading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chat) return;

        const userMessage: ChatMessage = { sender: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);
setError(null);

        try {
            const result = await chat.sendMessage({ message: currentInput });
            const aiMessage: ChatMessage = { sender: 'ai', text: result.text };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error(err);
            setError("Sorry, I'm having trouble connecting. Please try again later.");
            // Don't remove user message, so they can retry
        } finally {
            setIsLoading(false);
        }
    };

    const containerClasses = `
        z-50 transition-all duration-300 ease-out transform-gpu
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}
        ${isFullScreen ? 'fixed inset-0' : 'fixed bottom-28 right-4 sm:right-8 w-[calc(100vw-2rem)] sm:w-full max-w-lg'}
    `;

    const modalClasses = `
        bg-slate-50 dark:bg-slate-800 shadow-2xl h-full flex flex-col border border-slate-200 dark:border-slate-700 relative overflow-hidden
        ${isFullScreen ? 'rounded-none max-h-full' : 'rounded-lg max-h-[60vh] sm:max-h-[70vh]'}
    `;

    return (
        <div
            className={containerClasses}
            role="dialog"
            aria-modal="false"
            aria-hidden={!isOpen}
        >
            <div className={modalClasses}>
                <header className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <IconSparkles className="h-6 w-6 text-blue-500" />
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200">AI Career Assistant</h2>
                    </div>
                     <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownloadChat}
                            disabled={isDownloading || messages.length <= 1}
                            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Download chat as PDF"
                        >
                            {isDownloading ? <IconSpinner className="h-5 w-5 animate-spin" /> : <IconDownload className="h-5 w-5" />}
                        </button>
                        <button
                            onClick={toggleFullScreen}
                            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            aria-label={isFullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                        >
                            {isFullScreen ? <IconMinimize className="h-5 w-5" /> : <IconMaximize className="h-5 w-5" />}
                        </button>
                        <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Close">
                            <IconX className="h-6 w-6" />
                        </button>
                    </div>
                </header>

                <main ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'ai' && <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 text-white"><IconSparkles className="h-5 w-5"/></div>}
                            <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}>
                                {msg.sender === 'ai' ? <MarkdownRenderer text={msg.text} /> : <p className="text-sm break-words" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>}
                            </div>
                        </div>
                    ))}
                    {isLoading && <TypingIndicator />}
                    {error && <div className="text-red-500 text-sm text-center py-2">{error}</div>}
                </main>

                <footer className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-100 dark:bg-slate-800/50">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ask about my projects, skills, etc."
                            className="w-full px-4 py-2 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                        <button type="submit" className="p-3 rounded-md bg-blue-600 text-white hover:bg-blue-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-colors" disabled={isLoading || !userInput.trim()}>
                            <IconSend className="h-5 w-5" />
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};

// A new IconSend component for the chat input
const IconSend: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M3.105 3.105a1.5 1.5 0 011.995-.213l12 6a1.5 1.5 0 010 2.816l-12 6A1.5 1.5 0 013.105 16.895V3.105z" />
    </svg>
);


export default AIChatWindow;