import React from 'react';
import { IconSparkles } from './icons/IconSparkles';
import { IconX } from './icons/IconX';

interface AIAssistantButtonProps {
    onClick: () => void;
    isOpen: boolean;
}

const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({ onClick, isOpen }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-8 right-8 z-40 h-16 w-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-110"
            aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        >
            <div className="relative h-8 w-8 flex items-center justify-center">
                <IconSparkles className={`absolute transition-all duration-300 ${isOpen ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                <IconX className={`h-8 w-8 absolute transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}`} />
            </div>
        </button>
    );
};

export default AIAssistantButton;