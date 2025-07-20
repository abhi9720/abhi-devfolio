import React from 'react';

interface VoiceVisualizerProps {
    isListening: boolean;
}

const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ isListening }) => {
    if (!isListening) return null;

    const bars = [0, 0.2, 0.4, 0.6, 0.8]; // Animation delays

    return (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-700 rounded-full flex justify-center items-center pointer-events-none transition-opacity duration-300" aria-hidden="true">
            <div className="flex items-center justify-center gap-1 h-5">
                {bars.map((delay, index) => (
                    <div
                        key={index}
                        className="w-1 bg-blue-500 rounded-full animate-voice-wave"
                        style={{ animationDelay: `${delay}s`, height: '100%' }}
                    />
                ))}
            </div>
        </div>
    );
};

export default VoiceVisualizer;