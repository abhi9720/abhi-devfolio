import React, { useEffect, useState, useRef, useLayoutEffect, useMemo, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import jsPDF from 'jspdf';
import { FiX, FiSend, FiDownload, FiMaximize2, FiMinimize2, FiTrash2, FiMic, FiSquare, FiStopCircle } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { ImSpinner2 } from 'react-icons/im';
import { ChatMessage } from '../types';
import { AI_CONTEXT_DOCUMENT, EXAMPLE_PROMPTS } from '../constants';
import TypingIndicator from './TypingIndicator';
import MarkdownRenderer from './MarkdownRenderer';
import VoiceVisualizer from './VoiceVisualizer';

// --- Web Speech API Type Definitions ---
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onend: () => void;
  onerror: (event: any) => void;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface AIChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  isFullScreen: boolean;
  setIsFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const CHAT_HISTORY_KEY = 'ai_chat_history';
const GEMINI_CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || 'gemini-2.5-flash';

// --- Helper Functions & Components ---
const cleanTextForSpeech = (text: string) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
        .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1') // Keep only the text from links
        .replace(/`([^`]+)`/g, '$1') // Remove inline code ticks
        .replace(/#+\s?/g, ''); // Remove header hashes
};

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
    
    // Voice I/O State
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speechApi, setSpeechApi] = useState<{
        recognition: SpeechRecognition | null;
        synthesis: SpeechSynthesis | null;
        isSupported: boolean;
    }>({ recognition: null, synthesis: null, isSupported: false });
    
    const forceSpeakNextResponse = useRef(false);
    const sendMessageRef = useRef<(messageText: string, fromVoice?: boolean) => void>();

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
        return `You are a helpful and friendly AI assistant for Abhishek Tiwari's portfolio. The current date is ${today}.
Your answers must be based *only* on the information provided in the context document.

**Response Guidelines:**

1.  **Persona:** Always respond in the first person ("I" or "my"). Be professional, confident, and helpful. Do not say you are an AI or that you're using a document.

2.  **CRITICAL - Years of Experience (YOE) Calculation:**
    When asked about my **total experience** with a skill (e.g., "experience in Java"), follow these steps:
    A. **Find the EARLIEST START DATE** for that skill from my entire work history (including internships). For Java, this is **March 2023**. For Go, this is **November 2023**. For Node.js, this is **November 2021**.
    B. **Calculate TOTAL DURATION** from that earliest start date to today, ${today}.
    C. **State the TOTAL DURATION** clearly. Example: "I have been working with Java since March 2023, giving me a total of over X years/months of experience."
    
    When asked for **FULL-TIME experience** (or similar phrasing), use these specific rules instead:
    A. For **Java**, my full-time experience began in **April 2024**. Calculate the duration from that date to today.
    B. For **Go (Golang)**, my full-time experience began in **November 2023**. Calculate the duration from that date to today.
    C. For **Node.js**, respond with: "My experience with Node.js comes from internships and various full-stack projects, amounting to about 1.5 years."
    D. **Do not mention internships** when stating the duration of *full-time* experience for Java and Go. Just state the calculated duration.

    **IMPORTANT RULES FOR YOE:**
    - **DO NOT SHOW YOUR MATH.** Do not explain how you calculated the number. Just state the final duration.
    - Round to the nearest month.

3.  **Skill Gaps:**
    *   If asked about a skill I don't have (e.g., "Bootstrap"), first state that I don't have professional experience with it.
    *   Then, pivot to a related skill I *do* have. Example: "I haven't used Bootstrap in a professional project. However, I am highly proficient with Tailwind CSS for building responsive UIs."

4.  **Out-of-Scope Questions:** For questions not about my professional background, politely decline. Say something like: "My purpose is to answer questions about Abhishek's professional background, so I can't help with that."

5.  **Formatting:** Use Markdown for formatting (like **bold** or lists). When providing a link, use the format: [Descriptive Text](URL).

Here is the context document about my professional background:
---
${AI_CONTEXT_DOCUMENT}`;
    }, []);
    
    const sendMessage = useCallback(async (messageText: string, fromVoice: boolean = false) => {
        if (!messageText.trim() || isLoading || !chat) return;
        
        if (fromVoice) {
            forceSpeakNextResponse.current = true;
        }

        speechApi.synthesis?.cancel();
        setIsSpeaking(false);
        
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
            forceSpeakNextResponse.current = false;
        } finally {
            setIsLoading(false);
        }
    }, [chat, isLoading, speechApi.synthesis, showPrompts]);
    
    sendMessageRef.current = sendMessage;

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const synthesis = window.speechSynthesis;
        const isSupported = !!SpeechRecognition && !!synthesis;

        if (!isSupported) {
            setSpeechApi({ recognition: null, synthesis: null, isSupported: false });
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results).map(result => result[0]).map(result => result.transcript).join('');
            setUserInput(transcript);
        
            const lastResult = event.results[event.results.length - 1];
            if (lastResult.isFinal && transcript.trim()) {
                sendMessageRef.current?.(transcript, true);
                setUserInput('');
            }
        };
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        setSpeechApi({ recognition, synthesis, isSupported: true });

        return () => {
            synthesis?.cancel();
            recognition?.abort();
        };
    }, []);
    
    const handleStopSpeech = useCallback(() => {
        if (speechApi.synthesis) {
            speechApi.synthesis.cancel();
            setIsSpeaking(false);
        }
    }, [speechApi.synthesis]);
    
    useEffect(() => {
        if (!speechApi.synthesis || isLoading) return;

        const lastMessage = messages[messages.length - 1];

        if (lastMessage?.sender === 'ai' && forceSpeakNextResponse.current) {
            const utterance = new SpeechSynthesisUtterance(cleanTextForSpeech(lastMessage.text));
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            forceSpeakNextResponse.current = false;
            speechApi.synthesis.speak(utterance);
        } else if (forceSpeakNextResponse.current && lastMessage?.sender !== 'ai') {
            forceSpeakNextResponse.current = false;
        }
    }, [messages, isLoading, speechApi.synthesis]);

    useEffect(() => {
        const historyForGemini = messages.slice(1).map(msg => ({ role: msg.sender === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] }));
        const newChat = ai.chats.create({ model: GEMINI_CHAT_MODEL, history: historyForGemini, config: { systemInstruction } });
        setChat(newChat);
    }, [systemInstruction, messages]);

    useEffect(() => {
        if (messages.length > 1) {
             localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
             if (showPrompts) setShowPrompts(false);
        } else {
             localStorage.removeItem(CHAT_HISTORY_KEY);
        }
    }, [messages, showPrompts]);
    
    const handleClose = useCallback(() => {
        speechApi.synthesis?.cancel();
        if (isListening) speechApi.recognition?.stop();
        onClose();
    }, [isListening, onClose, speechApi.recognition, speechApi.synthesis]);
    
    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') isFullScreen ? setIsFullScreen(false) : handleClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, handleClose, isFullScreen, setIsFullScreen]);

    useLayoutEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages, showPrompts]);

    const handleDownloadChat = async () => {
        if (messages.length <= 1) return;
        setIsDownloading(true);
        try {
            const doc = new jsPDF();
            const pageHeight = doc.internal.pageSize.height;
            const pageWidth = doc.internal.pageSize.width;
            const margin = 15;
            const maxLineWidth = pageWidth - margin * 2;
            let y = 20;
    
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text("AI Career Assistant Chat Log", pageWidth / 2, y, { align: 'center' });
            y += 8;
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100);
            doc.text(`Downloaded on: ${new Date().toLocaleString()}`, pageWidth / 2, y, { align: 'center' });
            y += 15;
            
            doc.setDrawColor(226, 232, 240);
            doc.line(margin, y, pageWidth - margin, y);
            y += 10;
            
            for (const message of messages.slice(1)) {
                if (y > pageHeight - margin) {
                    doc.addPage();
                    y = margin;
                }
    
                const isUser = message.sender === 'user';
                const label = isUser ? "You:" : "AI Assistant:";
                const textToRender = message.text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1 ($2)');
                const lines = doc.splitTextToSize(textToRender, maxLineWidth);
    
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(isUser ? 37 : 8, isUser ? 99 : 145, isUser ? 235 : 178);
                doc.text(label, margin, y);
                y += 6;
    
                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(15, 23, 42);
                
                doc.text(lines, margin, y);
                y += lines.length * 5 + 8;
            }
            
            doc.save(`Abhishek_Tiwari_AI_Chat_${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (err) {
            console.error("Failed to download chat:", err);
            alert("Sorry, there was an error creating the PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleClearChat = () => {
        speechApi.synthesis?.cancel();
        localStorage.removeItem(CHAT_HISTORY_KEY);
        setMessages(initialMessages);
        setShowPrompts(true);
    };

    const handlePromptClick = (prompt: string) => sendMessageRef.current?.(prompt);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) return;
        sendMessageRef.current?.(userInput, false);
        setUserInput('');
    };

    const handleToggleListening = () => {
        if (!speechApi.recognition) return;
        if (isListening) {
            speechApi.recognition.stop();
        } else {
            speechApi.recognition.start();
        }
        setIsListening(prev => !prev);
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
                        <button title="Close" onClick={handleClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Close">
                            <FiX className="h-6 w-6" />
                        </button>
                    </div>
                </header>

                <main ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-6 chat-scrollbar">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2.5 animate-fade-in-up ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'ai' && <AIAvatar />}
                            <div className={`relative max-w-md p-3 rounded-t-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-l-2xl' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-r-2xl'}`}>
                                {msg.sender === 'ai' ? <MarkdownRenderer text={msg.text} /> : <p className="text-sm break-words">{msg.text}</p>}
                                {msg.sender === 'ai' && isSpeaking && index === messages.length - 1 && (
                                    <button 
                                        onClick={handleStopSpeech}
                                        className="absolute -top-3 -right-3 h-7 w-7 bg-white dark:bg-slate-600 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-red-200 dark:hover:bg-red-500/50 transition-colors shadow-md"
                                        aria-label="Stop speaking"
                                    >
                                        <FiStopCircle className="h-5 w-5"/>
                                    </button>
                                )}
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
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder={isListening ? "" : "Ask about my projects, skills..."}
                                className={`w-full pl-12 pr-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${isListening ? 'text-transparent dark:text-transparent' : ''}`}
                                disabled={isLoading}
                            />
                            <VoiceVisualizer isListening={isListening} />
                             <button 
                                type="button" 
                                onClick={handleToggleListening}
                                disabled={!speechApi.isSupported || isLoading}
                                title={isListening ? "Stop Listening" : "Use Voice"}
                                className={`absolute left-1.5 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full text-white transition-colors duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 z-10 ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-500'}`}
                                aria-label={isListening ? "Stop voice input" : "Start voice input"}
                            >
                                {isListening ? <FiSquare className="h-4 w-4" /> : <FiMic className="h-5 w-5" />}
                            </button>
                        </div>
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