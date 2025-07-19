import React from 'react';
import { EXPERIENCES, EDUCATION } from '../constants';

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <div className="sticky top-0 z-10 py-4 mb-8 bg-slate-50/75 dark:bg-slate-900/75 backdrop-blur lg:hidden">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200">{title}</h2>
    </div>
);

const ExperienceTimeline: React.FC = () => {
    return (
        <div className="relative border-l-2 border-slate-300 dark:border-slate-700 ml-4">
            <div className="space-y-12 pl-10 py-4">
                {EXPERIENCES.map((exp, index) => (
                    <div key={index} className="relative group">
                        {/* Dot on the timeline */}
                        <div className="absolute -left-[48px] top-1 w-5 h-5 bg-slate-50 dark:bg-slate-900 rounded-full border-4 border-slate-300 dark:border-slate-600 group-hover:border-blue-500 transition-colors duration-300"></div>
                        
                        {/* Content */}
                        <div className="transition-transform duration-300 transform group-hover:-translate-y-1">
                             <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tabular-nums">{exp.period}</p>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mt-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">{exp.company}</h3>
                            <p className="text-md font-semibold text-slate-600 dark:text-slate-300">{exp.role}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-3">{exp.summary}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const Experience: React.FC = () => {
    return (
        <section id="experience" className="scroll-mt-20">
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <h2 className="sticky top-0 hidden lg:block py-4 text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-slate-900 to-blue-500 dark:from-slate-200 dark:to-blue-500 text-transparent bg-clip-text">Experience</h2>
                </div>
                <div className="lg:col-span-3">
                    <SectionHeader title="Experience" />
                    
                    <ExperienceTimeline />

                    <div className="mt-16">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 uppercase tracking-wider bg-gradient-to-r from-slate-900 to-blue-500 dark:from-slate-200 dark:to-blue-500 text-transparent bg-clip-text">Education</h3>
                        <div className="p-6 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100">{EDUCATION.institution}</h4>
                                    <p className="text-md text-slate-600 dark:text-slate-300">{EDUCATION.degree}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 tabular-nums">{EDUCATION.period}</p>
                                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1">{EDUCATION.cgpa}</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-700/50">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Relevant Coursework:</p>
                                <div className="flex flex-wrap gap-2">
                                    {EDUCATION.coursework.map(course => (
                                        <span key={course} className="px-3 py-1 text-xs font-medium rounded-full bg-slate-200/80 dark:bg-slate-900/70 border border-slate-300/80 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                            {course}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;