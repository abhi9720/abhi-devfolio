import React, { useState, useMemo } from 'react';
import { SKILL_CATEGORIES } from '../constants';
import { IconSearch } from './icons/IconSearch';

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <div className="sticky top-0 z-10 py-4 mb-4 bg-slate-50/75 dark:bg-slate-900/75 backdrop-blur lg:static lg:mb-0 lg:py-0 lg:bg-transparent">
        <h2 className="text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-slate-900 to-blue-600 dark:from-slate-200 dark:to-blue-500 text-transparent bg-clip-text lg:sr-only">{title}</h2>
    </div>
);

const Skills: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = useMemo(() => {
        if (!searchTerm) {
            return SKILL_CATEGORIES;
        }

        const lowercasedFilter = searchTerm.toLowerCase();

        return SKILL_CATEGORIES.map(category => {
            const filteredSkills = category.skills.filter(skill =>
                skill.toLowerCase().includes(lowercasedFilter)
            );
            return { ...category, skills: filteredSkills };
        }).filter(category => category.skills.length > 0);

    }, [searchTerm, SKILL_CATEGORIES]);

    return (
        <section id="skills" className="scroll-mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <h2 className="sticky top-0 hidden lg:block py-4 text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-slate-900 to-blue-500 dark:from-slate-200 dark:to-blue-500 text-transparent bg-clip-text">Skills</h2>
                </div>
                <div className="lg:col-span-3">
                    <SectionHeader title="Skills" />
                    
                    <div className="relative mb-8">
                        <input
                            type="text"
                            placeholder="Search for a skill (e.g., React, AWS, Go)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors placeholder-slate-400 dark:placeholder-slate-500"
                            aria-label="Search for a skill"
                        />
                        <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500">
                            <IconSearch className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="space-y-10">
                        {filteredCategories.map(category => (
                            <div key={category.name} className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 rounded-xl shadow-sm transition-all duration-300">
                                <div className="p-4 sm:p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-blue-500 dark:text-blue-400">{category.icon}</span>
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{category.name}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {category.skills.map(skill => (
                                            <div key={skill} className="px-3.5 py-1.5 rounded-md bg-slate-200/60 dark:bg-slate-900/60 border border-slate-300/70 dark:border-slate-700/70 text-slate-700 dark:text-slate-300 transition-all duration-200 transform hover:scale-105 hover:bg-blue-100/60 dark:hover:bg-blue-900/40 hover:border-blue-400/50 dark:hover:border-blue-600/50 cursor-default">
                                                <span className="font-medium text-sm whitespace-nowrap">{skill}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredCategories.length === 0 && (
                        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                            <p className="font-semibold text-lg">No skills found for "{searchTerm}"</p>
                            <p className="mt-2 text-sm">Try a different search term or clear the search field.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Skills;