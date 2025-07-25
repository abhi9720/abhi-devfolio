import React from 'react';
import { SOCIAL_LINKS } from '../constants';

const Footer: React.FC = () => {
    return (
        <footer className="py-12 text-center">
            <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-4 mb-4">
                {SOCIAL_LINKS.filter(l => l.name !== 'Email').map((link) => (
                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.name}
                        className="text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
                    >
                        <span className="sr-only">{link.name}</span>
                        {React.cloneElement(link.icon as React.ReactElement<{ className?: string }>, { className: 'h-6 w-6' })}
                    </a>
                ))}
            </div>
             <p className="text-sm text-slate-500 dark:text-slate-500">
                Designed with inspiration and built with React, Tailwind CSS, and lots of coffee.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                © {new Date().getFullYear()} Abhishek Tiwari. All Rights Reserved.
            </p>
        </footer>
    );
};

export default Footer;