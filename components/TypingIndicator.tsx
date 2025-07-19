import React from 'react';

const TypingIndicator: React.FC = () => {
    return (
        <div className="flex items-center justify-start space-x-1 p-3">
            <div className="h-2 w-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="h-2 w-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-2 w-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
    );
};

export default TypingIndicator;
