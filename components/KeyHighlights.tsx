import React from 'react';
import { KEY_HIGHLIGHTS } from '../constants';

const KeyHighlights: React.FC = () => {
    if (!KEY_HIGHLIGHTS || KEY_HIGHLIGHTS.length === 0) return null;

    return (
        <div className="mt-12">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 uppercase tracking-wider bg-gradient-to-r from-slate-900 to-blue-500 dark:from-slate-200 dark:to-blue-500 text-transparent bg-clip-text">Key Career Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {KEY_HIGHLIGHTS.map((highlight, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700/50 flex flex-col items-center text-center transition-all duration-300 hover:border-blue-400/50 dark:hover:border-blue-500/50 hover:dark:bg-slate-800 hover:-translate-y-1 shadow-md hover:shadow-lg dark:shadow-none">
                        <div className="mb-4">
                            {highlight.icon}
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{highlight.metric}</p>
                        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed">{highlight.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KeyHighlights;