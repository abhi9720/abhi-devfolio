import React from 'react';

export const IconTrophy: React.FC<{ className?: string }> = ({ className = "h-8 w-8 text-blue-500 dark:text-blue-500" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1v-2.34" />
        <path d="M15 14.66V17c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-2.34" />
        <path d="M8 21v-9c0-.55.45-1 1-1h6c.55 0 1 .45 1 1v9" />
        <path d="M6 18H4c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v9c0 1.1-.9 2-2 2h-2" />
    </svg>
);