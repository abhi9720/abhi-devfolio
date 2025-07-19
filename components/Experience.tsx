import React from 'react';
import { EXPERIENCES, EDUCATION } from '../constants';
import type { Experience } from '../types';

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <div className="sticky top-0 z-10 py-4 mb-4 bg-slate-50/75 dark:bg-slate-900/75 backdrop-blur lg:static lg:mb-0 lg:py-0 lg:bg-transparent">
        <h2 className="text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-slate-900 to-blue-600 dark:from-slate-200 dark:to-blue-500 text-transparent bg-clip-text lg:sr-only">{title}</h2>
    </div>
);


const ExperienceCard: React.FC<{ item: Experience }> = ({ item }) => (
    <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
        <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition-all duration-300 motion-reduce:transition-none lg:block lg:group-hover:bg-slate-100/75 dark:lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-md dark:lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
        <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2">
            {item.period}
        </header>
        <div className="z-10 sm:col-span-6">
            <h3 className="font-medium leading-snug text-slate-900 dark:text-slate-200">
                <div className="inline-flex items-baseline font-medium leading-tight text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 focus-visible:text-blue-600 dark:focus-visible:text-blue-400 text-base">
                    {item.role} · {item.company}
                </div>
            </h3>
            <p className="mt-2 text-sm leading-normal text-slate-500">
                {item.location}
            </p>
            <ul className="mt-2 space-y-2 list-disc list-inside text-slate-600 dark:text-slate-400">
                {item.description.map((desc, index) => (
                    <li key={index}>{desc}</li>
                ))}
            </ul>
        </div>
    </div>
);


const Experience: React.FC = () => {
    return (
        <section id="experience" className="scroll-mt-20">
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <h2 className="sticky top-0 hidden lg:block py-4 text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-slate-900 to-blue-500 dark:from-slate-200 dark:to-blue-500 text-transparent bg-clip-text">Experience</h2>
                </div>
                <div className="lg:col-span-3">
                    <SectionHeader title="Experience" />
                    <ol className="group/list space-y-12">
                        {EXPERIENCES.map((exp, index) => (
                            <li key={index}>
                                <ExperienceCard item={exp} />
                            </li>
                        ))}
                    </ol>
                    <div className="mt-16">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wider bg-gradient-to-r from-slate-900 to-blue-500 dark:from-slate-200 dark:to-blue-500 text-transparent bg-clip-text">Education</h3>
                        <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4">
                            <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md lg:block bg-slate-100 dark:bg-slate-800/50"></div>
                            <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2" aria-label="2023">
                                {EDUCATION.graduationYear}
                            </header>
                            <div className="z-10 sm:col-span-6">
                                <h3 className="font-medium leading-snug text-slate-800 dark:text-slate-200">
                                    {EDUCATION.degree}
                                </h3>
                                <p className="mt-2 text-sm leading-normal text-slate-500">
                                    {EDUCATION.institution}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;