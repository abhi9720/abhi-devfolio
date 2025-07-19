import React, { useState } from 'react';
import { PERSONAL_INFO, SOCIAL_LINKS } from '../constants';
import ResumeModal from './ResumeModal';
import ThemeToggle from './ThemeToggle';
import { FiMapPin, FiDownload } from 'react-icons/fi';
import { RiLayoutGridLine } from 'react-icons/ri';

interface HeaderProps {
    activeSection: string | null;
}

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
    const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

    const navLinks = [
        { name: 'About', href: '#about', id: 'about' },
        { name: 'Experience', href: '#experience', id: 'experience' },
        { name: 'Projects', href: '#projects', id: 'projects' },
        { name: 'Activity', href: '#github', id: 'github' },
        { name: 'Skills', href: '#skills', id: 'skills' },
        { name: 'Writing', href: '#publications', id: 'publications' },
    ];

    return (
        <>
            <header className="py-12 md:py-20 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 flex flex-col sm:flex-row gap-8 items-start">
                        <img 
                            src={PERSONAL_INFO.photoUrl} 
                            alt="Abhishek Tiwari"
                            className="rounded-full w-28 h-28 object-cover border-2 border-slate-300 dark:border-slate-700 shadow-lg dark:shadow-glow-blue flex-shrink-0"
                        />
                        <div className="flex flex-col space-y-4">
                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-blue-600 dark:from-slate-200 dark:to-blue-500 text-transparent bg-clip-text">
                                {PERSONAL_INFO.name}
                            </h1>
                            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-300">
                                {PERSONAL_INFO.title}
                            </h2>
                            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                                <FiMapPin />
                                <span>{PERSONAL_INFO.location}</span>
                            </div>
                            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 pt-4">
                                {SOCIAL_LINKS.filter(l => ['GitHub', 'LinkedIn', 'Email'].includes(l.name)).map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={link.name}
                                        className="text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110"
                                    >
                                        <span className="sr-only">{link.name}</span>
                                        {React.cloneElement(link.icon as React.ReactElement<{ className?: string }>, { className: 'h-6 w-6' })}
                                    </a>
                                ))}
                                <button
                                    onClick={() => setIsResumeModalOpen(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-md hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
                                    aria-label="Download Resume"
                                >
                                    <FiDownload className="h-4 w-4" />
                                    <span>Resume</span>
                                </button>
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                    <nav className="hidden lg:flex justify-end pt-4">
                        <ul className="space-y-3">
                            {navLinks.map((link) => {
                                const isActive = activeSection === link.id;
                                return (
                                    <li key={link.name}>
                                        <a href={link.href} className="group flex items-center space-x-3">
                                            <span className={`h-px transition-all duration-300 ${isActive ? 'w-16 bg-blue-500 dark:bg-blue-500' : 'w-8 bg-slate-400 dark:bg-slate-600 group-hover:w-16 group-hover:bg-blue-500 dark:group-hover:bg-blue-500'}`}></span>
                                            <span className={`font-semibold transition-colors duration-300 ${isActive ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-100'}`}>
                                                {link.name}
                                            </span>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </header>
            <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
        </>
    );
};

export default Header;