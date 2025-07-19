import React from 'react';

const TypingIndicator: React.FC = () => {
    return (
        <div className="flex items-center justify-start space-x-1 p-3 bg-slate-200 dark:bg-slate-700 rounded-t-2xl rounded-r-2xl">
            <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce-dot" style={{ animationDelay: '0s' }}></div>
            <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce-dot" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce-dot" style={{ animationDelay: '0.4s' }}></div>
        </div>
    );
};

export default TypingIndicator;