import React from 'react';
import { CERTIFICATIONS } from '../constants';
import { FiAward, FiExternalLink } from 'react-icons/fi';

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <div className="sticky top-0 z-10 py-4 mb-4 bg-slate-50/75 dark:bg-slate-900/75 backdrop-blur lg:hidden">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200">{title}</h2>
    </div>
);

const Certifications: React.FC = () => {
    if (!CERTIFICATIONS || CERTIFICATIONS.length === 0) return null;

    return (
        <section id="certifications" className="scroll-mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <h2 className="sticky top-0 hidden lg:block py-4 text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-slate-900 to-blue-500 dark:from-slate-200 dark:to-blue-500 text-transparent bg-clip-text">Certificates</h2>
                </div>
                <div className="lg:col-span-3">
                    <SectionHeader title="Certificates" />
                    <ul className="space-y-4">
                        {CERTIFICATIONS.map((cert, index) => (
                            <li key={index}>
                                <a
                                    href={cert.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-start gap-4 p-4 rounded-lg bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-700/40 transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-md"
                                    aria-label={`View certificate: ${cert.name}`}
                                >
                                    <div className="flex-shrink-0 mt-1 text-blue-500 dark:text-blue-400">
                                        <FiAward className="h-5 w-5"/>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {cert.name}
                                        </p>
                                    </div>
                                    <FiExternalLink className="h-5 w-5 flex-shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-transform duration-300 group-hover:translate-x-0.5" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Certifications;
