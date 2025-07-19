import React from 'react';

const SkeletonCard: React.FC = () => (
    <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50 space-y-4 animate-pulse">
        <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-6 w-6 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
        </div>
        <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded w-5/6"></div>
        <div className="space-y-2 pt-2">
            <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-2/3"></div>
        </div>
        <div className="pt-2 flex justify-between items-center">
             <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-1/3"></div>
             <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-24"></div>
        </div>
    </div>
);

const PublicationSkeleton: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
    );
};

export default PublicationSkeleton;