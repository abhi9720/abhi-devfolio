import React from 'react';
import { PERSONAL_INFO } from '../constants';
import KeyHighlights from './KeyHighlights';

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <div className="sticky top-0 z-10 py-4 bg-slate-50/75 dark:bg-slate-900/75 backdrop-blur lg:hidden">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200">{title}</h2>
    </div>
);

const About: React.FC = () => {
    return (
        <section id="about" className="scroll-mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <h2 className="sticky top-0 hidden lg:block py-4 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200">About</h2>
                </div>
                <div className="lg:col-span-3">
                    <SectionHeader title="About" />
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                        {PERSONAL_INFO.summary}
                    </p>
                    <KeyHighlights />
                </div>
            </div>
        </section>
    );
};

export default About;