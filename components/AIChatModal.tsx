import React, { useEffect, useState, useRef, useLayoutEffect, useMemo } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FiX, FiSend, FiDownload, FiMaximize2, FiMinimize2, FiTrash2 } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { ImSpinner2 } from 'react-icons/im';
import { ChatMessage } from '../types';
import { AI_CONTEXT_DOCUMENT, EXAMPLE_PROMPTS } from '../constants';
import TypingIndicator from './TypingIndicator';
import MarkdownRenderer from './MarkdownRenderer';


interface AIChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  isFullScreen: boolean;
  setIsFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const CHAT_HISTORY_KEY = 'ai_chat_history';

// --- Helper Components ---

const AIAvatar = () => (
    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0 text-white shadow">
        <HiOutlineSparkles className="h-5 w-5"/>
    </div>
);

const UserAvatar = () => (
    <div className="h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-slate-300 shadow">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.99 9.99 0 0010 12.01a9.99 9.99 0 00-6.535 2.483z" />
        </svg>
    </div>
);

const ExamplePrompts: React.FC<{ onPromptClick: (prompt: string) => void }> = ({ onPromptClick }) => {
    return (
        <div className="flex justify-end animate-fade-in-up">
            <div className="flex items-end gap-2.5">
                <div className="flex flex-col items-end gap-2">
                    {EXAMPLE_PROMPTS.map(p => (
                        <button 
                            key={p} 
                            onClick={() => onPromptClick(p)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-2xl text-sm font-semibold hover:bg-blue-500 transition-colors max-w-xs text-left shadow-md"
                        >
                           {p}
                        </button>
                    ))}
                </div>
                <UserAvatar />
            </div>
        </div>
    );
};

// --- Main Component ---

const AIChatWindow: React.FC<AIChatWindowProps> = ({ isOpen, onClose, isFullScreen, setIsFullScreen }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    const initialMessages: ChatMessage[] = useMemo(() => [{ sender: 'ai', text: "Hello! I'm Abhishek's AI assistant. You can ask me anything about his experience, projects, or skills. How can I help?" }], []);

    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        if (typeof window === 'undefined') return initialMessages;
        const savedHistoryRaw = localStorage.getItem(CHAT_HISTORY_KEY);
        if (savedHistoryRaw) {
            try {
                const parsed = JSON.parse(savedHistoryRaw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            } catch (e) { console.error("Failed to parse chat history:", e); }
        }
        return initialMessages;
    });
    
    const [showPrompts, setShowPrompts] = useState(messages.length <= 1);
    const toggleFullScreen = () => setIsFullScreen(prev => !prev);
    
    const systemInstruction = useMemo(() => {
        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        return `You are a helpful and friendly AI assistant representing Abhishek Tiwari. The current date is ${today}. Your answers must be based *only* on the information provided in the context document below.

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
    }, []);

    useEffect(() => {
        const historyForGemini = messages.filter(msg => (messages.length > 1) || (msg.sender === 'user')).map(msg => ({ role: msg.sender === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] }));
        const newChat = ai.chats.create({ model: 'gemini-2.5-flash', history: historyForGemini, config: { systemInstruction } });
        setChat(newChat);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [systemInstruction]);

    useEffect(() => {
        if (messages.length > 1) {
             localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
             if (showPrompts) setShowPrompts(false);
        } else {
             localStorage.removeItem(CHAT_HISTORY_KEY);
        }
    }, [messages, showPrompts]);

    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (event: KeyboardEvent) => { event.key === 'Escape' && (isFullScreen ? setIsFullScreen(false) : onClose()); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose, isFullScreen, setIsFullScreen]);

    useLayoutEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages, showPrompts]);

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading || !chat) return;

        const userMessage: ChatMessage = { sender: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);
        if (showPrompts) setShowPrompts(false);

        try {
            const result = await chat.sendMessage({ message: messageText });
            const aiMessage: ChatMessage = { sender: 'ai', text: result.text };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error(err);
            setError("Sorry, I'm having trouble connecting. Please try again later.");
            setMessages(prev => prev.filter(m => m !== userMessage));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadChat = async () => {
        const chatElement = chatContainerRef.current;
        if (!chatElement) {
            alert("Could not find chat content to download.");
            return;
        }
    
        setIsDownloading(true);
        try {
            const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            const bgColor = theme === 'dark' ? '#0f172a' : '#f8fafc';
    
            const canvas = await html2canvas(chatElement, {
                useCORS: true,
                scale: 2,
                backgroundColor: bgColor,
            });
    
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
    
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`Abhishek_Tiwari_AI_Chat_${new Date().toISOString().slice(0, 10)}.pdf`);
    
        } catch (err) {
            console.error("Failed to download chat:", err);
            alert("Sorry, there was an error creating the PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleClearChat = () => {
        localStorage.removeItem(CHAT_HISTORY_KEY);
        setMessages(initialMessages);
        setShowPrompts(true);
        // Re-initialize the chat instance to clear its memory
        const newChat = ai.chats.create({ model: 'gemini-2.5-flash', history: [], config: { systemInstruction } });
        setChat(newChat);
    };

    const handlePromptClick = (prompt: string) => {
        sendMessage(prompt);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) return;
        sendMessage(userInput);
        setUserInput('');
    };
    
    const isChatPristine = messages.length <= 1;

    const containerClasses = `
        z-50 transition-all duration-300 ease-out transform-gpu
        ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}
        ${isFullScreen ? 'fixed inset-0' : 'fixed bottom-28 right-4 sm:right-8 w-[calc(100vw-2rem)] sm:w-full max-w-lg'}
    `;

    const modalClasses = `
        bg-slate-50 dark:bg-slate-900/95 shadow-2xl h-full flex flex-col border border-slate-200 dark:border-slate-700/50 relative overflow-hidden backdrop-blur-sm
        ${isFullScreen ? 'rounded-none max-h-full' : 'rounded-2xl max-h-[60vh] sm:max-h-[70vh]'}
    `;

    return (
        <div className={containerClasses} role="dialog" aria-modal={isOpen} aria-hidden={!isOpen}>
            <div className={modalClasses}>
                <header className="flex justify-between items-center p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0 bg-white/50 dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-200">AI Career Assistant</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Gemini</p>
                    </div>
                     <div className="flex items-center gap-1 sm:gap-2">
                        <button title="Download Chat" onClick={handleDownloadChat} disabled={isDownloading || isChatPristine} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Download chat as PDF">
                            {isDownloading ? <ImSpinner2 className="h-5 w-5 animate-spin" /> : <FiDownload className="h-5 w-5" />}
                        </button>
                        <button title="Clear Chat" onClick={handleClearChat} disabled={isChatPristine} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Clear chat history">
                            <FiTrash2 className="h-5 w-5" />
                        </button>
                        <button title={isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'} onClick={toggleFullScreen} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label={isFullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
                            {isFullScreen ? <FiMinimize2 className="h-5 w-5" /> : <FiMaximize2 className="h-5 w-5" />}
                        </button>
                        <button title="Close" onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Close">
                            <FiX className="h-6 w-6" />
                        </button>
                    </div>
                </header>

                <main ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-6 chat-scrollbar">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2.5 animate-fade-in-up ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'ai' && <AIAvatar />}
                            <div className={`max-w-md p-3 rounded-t-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-l-2xl' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-r-2xl'}`}>
                                {msg.sender === 'ai' ? <MarkdownRenderer text={msg.text} /> : <p className="text-sm break-words" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>}
                            </div>
                            {msg.sender === 'user' && <UserAvatar />}
                        </div>
                    ))}
                    {showPrompts && <ExamplePrompts onPromptClick={handlePromptClick} />}
                    {isLoading && <div className="flex items-end gap-2.5 animate-fade-in-up"><AIAvatar /><TypingIndicator /></div>}
                    {error && <div className="text-center text-red-500 dark:text-red-400 bg-red-500/10 p-3 rounded-lg text-sm">{error}</div>}
                </main>

                <footer className="flex-shrink-0 border-t border-slate-200 dark:border-slate-800 p-2 sm:p-4 bg-white/50 dark:bg-slate-800/50">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ask about my projects, skills..."
                            className="w-full px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                        <button type="submit" className="h-11 w-11 flex-shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-all duration-200 transform enabled:hover:scale-110" disabled={isLoading || !userInput.trim()}>
                            <FiSend className="h-5 w-5" />
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default AIChatWindow;