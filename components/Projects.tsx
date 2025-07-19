import React, { useState, useMemo } from 'react';
import { PROJECTS } from '../constants';
import type { Project } from '../types';
import { FaGithub } from 'react-icons/fa';
import { FiGlobe, FiSearch } from 'react-icons/fi';

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <div className="sticky top-0 z-10 py-4 mb-4 bg-slate-50/75 dark:bg-slate-900/75 backdrop-blur lg:static lg:mb-0 lg:py-0 lg:bg-transparent">
        <h2 className="text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-slate-900 to-blue-600 dark:from-slate-200 dark:to-blue-500 text-transparent bg-clip-text lg:sr-only">{title}</h2>
    </div>
);

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-md hover:shadow-xl dark:hover:shadow-[0_0_15px_rgba(59,130,246,0.25)] transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col overflow-hidden border border-slate-200/80 dark:border-slate-700/50">
            <img src={project.imageUrl} alt={`${project.title} thumbnail`} className="w-full h-48 object-cover" loading="lazy" />
            <div className="p-5 flex-grow flex flex-col">
                <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-mono text-slate-500 dark:text-slate-400">{tag}</span>
                    ))}
                </div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors">
                    {project.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 flex-grow min-h-[4rem]">
                    {project.description}
                </p>
                <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                            <div key={tech} className="flex items-center rounded-full bg-slate-200/60 dark:bg-slate-900/60 px-3 py-1 text-xs font-medium leading-5 text-slate-700 dark:text-slate-300 border border-slate-300/70 dark:border-slate-700/70">
                                {tech}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="p-4 bg-slate-100/70 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700/50 flex items-center gap-4">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-md hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  <FaGithub className="h-4 w-4" />
                  View Code
                </a>
                {project.liveDemoUrl && project.liveDemoUrl !== '#' ? (
                     <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold border border-transparent text-blue-600 dark:text-blue-400 rounded-md hover:underline"
                    >
                        <FiGlobe className="h-4 w-4" />
                        Live Demo
                    </a>
                ) : (
                    <span
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold border border-transparent text-slate-400 dark:text-slate-500 rounded-md cursor-not-allowed"
                        title="Live demo not available"
                    >
                        <FiGlobe className="h-4 w-4" />
                        Live Demo
                    </span>
                )}
            </div>
        </div>
    );
};


const Projects: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['All', 'Backend', 'Frontend', 'AI', 'Full-Stack'];

    const filteredProjects = useMemo(() => {
        return PROJECTS.filter(project => {
            const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
            const matchesSearch = searchTerm === '' ||
                project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                project.tech.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
            
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchTerm]);


    return (
        <section id="projects" className="scroll-mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                     <h2 className="sticky top-0 hidden lg:block py-4 text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-slate-900 to-blue-500 dark:from-slate-200 dark:to-blue-500 text-transparent bg-clip-text">Projects</h2>
                </div>
                <div className="lg:col-span-3">
                    <SectionHeader title="Projects" />
                    
                    <div className="mb-8 space-y-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by title, tag, or technology..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors placeholder-slate-400 dark:placeholder-slate-500"
                                aria-label="Search for a project"
                            />
                            <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500">
                                <FiSearch className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="flex-shrink-0 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-lg flex items-center flex-wrap">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`flex-grow sm:flex-grow-0 px-4 py-1.5 rounded-md text-sm font-semibold transition-colors duration-200 ${activeCategory === cat ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-slate-100 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-900/20'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredProjects.map((project, index) => (
                            <ProjectCard 
                                key={index} 
                                project={project}
                            />
                        ))}
                    </div>
                    {filteredProjects.length === 0 && (
                         <div className="text-center py-16 text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                            <p className="font-semibold text-lg">No projects found</p>
                            <p className="mt-2 text-sm">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Projects;