import React from 'react';
import { KEY_HIGHLIGHTS } from '../constants';

const KeyHighlights: React.FC = () => {
    if (!KEY_HIGHLIGHTS || KEY_HIGHLIGHTS.length === 0) return null;

    return (
        <div className="mt-12">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 uppercase tracking-wider bg-gradient-to-r from-slate-900 to-blue-500 dark:from-slate-200 dark:to-blue-500 text-transparent bg-clip-text">Key Career Highlights</h3>
            <ul className="space-y-4">
                {KEY_HIGHLIGHTS.map((highlight, index) => (
                    <li 
                        key={index} 
                        className="flex items-start gap-4 p-4 rounded-lg bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-700/40 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    >
                        <div className="flex-shrink-0 mt-1 text-blue-500 dark:text-blue-400">
                           {React.isValidElement(highlight.icon)
                                ? React.cloneElement(highlight.icon as React.ReactElement<{ className?: string }>, { className: 'h-5 w-5' })
                                : highlight.icon
                            }
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{highlight.metric}</p>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">{highlight.description}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default KeyHighlights;
