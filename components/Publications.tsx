import React, { useState, useEffect, useMemo } from 'react';
import type { Article } from '../types';
import { IconExternalLink } from './icons/IconExternalLink';
import { IconMedium } from './icons/IconMedium';
import { IconDevTo } from './icons/IconDevTo';
import { IconSearch } from './icons/IconSearch';
import PublicationSkeleton from './PublicationSkeleton';
import { PERSONAL_INFO } from '../constants';

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <div className="sticky top-0 z-10 py-4 mb-4 bg-slate-50/75 dark:bg-slate-900/75 backdrop-blur lg:static lg:mb-0 lg:py-0 lg:bg-transparent">
        <h2 className="text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-slate-900 to-blue-600 dark:from-slate-200 dark:to-blue-500 text-transparent bg-clip-text lg:sr-only">{title}</h2>
    </div>
);

const getSnippet = (html: string, maxLength: number = 100): string => {
    if (typeof document === 'undefined') {
        const text = html.replace(/<[^>]*>/g, '');
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    }
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const text = doc.body.textContent || "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
};

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
    const isNew = new Date(article.pubDate).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000; // Published in the last 7 days

    return (
        <a 
            href={article.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative flex flex-col bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-500/10 hover:-translate-y-1"
        >
            <div className="flex-grow">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        {article.platform === 'Medium' ? <IconMedium className="h-5 w-5" /> : <IconDevTo className="h-5 w-5" />}
                        <span>{article.platform}</span>
                    </div>
                    {isNew && <span className="text-xs font-bold text-fuchsia-500 bg-fuchsia-500/10 px-2 py-0.5 rounded-full">New</span>}
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {article.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {article.description}
                </p>
            </div>
            <div className="mt-auto flex justify-between items-center">
                <p className="text-xs text-slate-500 dark:text-slate-500">
                    {new Date(article.pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
                <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    Read More <IconExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
            </div>
        </a>
    );
};


const Publications: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [status, setStatus] = useState<'loading' | 'succeeded' | 'failed'>('loading');
    const [filter, setFilter] = useState<'All' | 'Medium' | 'DEV.to'>('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchArticles = async () => {
            setStatus('loading');
            const mediumRssUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${PERSONAL_INFO.nickname}`;
            const devToApiUrl = `https://dev.to/api/articles?username=${PERSONAL_INFO.nickname}`;

            try {
                const responses = await Promise.allSettled([
                    fetch(mediumRssUrl),
                    fetch(devToApiUrl)
                ]);

                const fetchedArticles: Article[] = [];

                // Process Medium feed (via rss2json)
                const mediumResponse = responses[0];
                if (mediumResponse.status === 'fulfilled' && mediumResponse.value.ok) {
                    const mediumData = await mediumResponse.value.json();
                    if (mediumData.status === 'ok' && Array.isArray(mediumData.items)) {
                        const mediumArticles: Article[] = mediumData.items.map((item: any) => ({
                            title: item.title,
                            link: item.link,
                            pubDate: item.pubDate,
                            description: getSnippet(item.content),
                            platform: 'Medium',
                            thumbnail: item.thumbnail,
                        }));
                        fetchedArticles.push(...mediumArticles);
                    } else {
                        console.warn('Could not fetch Medium articles:', mediumData.message);
                    }
                } else {
                    if (mediumResponse.status === 'rejected') {
                        console.warn('Failed to fetch Medium feed:', mediumResponse.reason);
                    } else {
                        console.warn(`Failed to fetch Medium feed: Response not OK (status: ${mediumResponse.value.status})`);
                    }
                }

                // Process DEV.to feed (via official API)
                const devToResponse = responses[1];
                if (devToResponse.status === 'fulfilled' && devToResponse.value.ok) {
                    const devToData = await devToResponse.value.json();
                    if (Array.isArray(devToData)) {
                        const devToArticles: Article[] = devToData.map((item: any) => ({
                            title: item.title,
                            link: item.url,
                            pubDate: item.published_at,
                            description: item.description,
                            platform: 'DEV.to',
                            thumbnail: item.cover_image || '',
                        }));
                        fetchedArticles.push(...devToArticles);
                    } else {
                        console.warn('Could not fetch DEV.to articles: response was not an array.', devToData);
                    }
                } else {
                     if (devToResponse.status === 'rejected') {
                        console.warn('Failed to fetch DEV.to feed:', devToResponse.reason);
                    } else {
                        console.warn(`Failed to fetch DEV.to feed: Response not OK (status: ${devToResponse.value.status})`);
                    }
                }

                if (fetchedArticles.length > 0) {
                    const sortedArticles = fetchedArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
                    setArticles(sortedArticles);
                    setStatus('succeeded');
                } else {
                    // Only fail if both feeds result in zero articles.
                    setStatus('failed');
                }

            } catch (error) {
                console.error("An unexpected error occurred while fetching articles:", error);
                setStatus('failed');
            }
        };

        fetchArticles();
    }, []);

    const filteredArticles = useMemo(() => {
        return articles
            .filter(article => filter === 'All' || article.platform === filter)
            .filter(article => 
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                article.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [articles, filter, searchTerm]);

    const filters: ('All' | 'Medium' | 'DEV.to')[] = ['All', 'Medium', 'DEV.to'];

    return (
        <section id="publications" className="scroll-mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <h2 className="sticky top-0 hidden lg:block py-4 text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-slate-900 to-blue-500 dark:from-slate-200 dark:to-blue-500 text-transparent bg-clip-text">Writing</h2>
                </div>
                <div className="lg:col-span-3">
                    <SectionHeader title="Writing" />
                    <div className="mb-8 space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors placeholder-slate-400 dark:placeholder-slate-500"
                                    aria-label="Search articles"
                                />
                                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500">
                                    <IconSearch className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex-shrink-0 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-lg flex items-center">
                                {filters.map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`w-full sm:w-auto px-4 py-1.5 rounded-md text-sm font-semibold transition-colors duration-200 ${filter === f ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-slate-100 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-900/20'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {status === 'loading' && <PublicationSkeleton />}
                    
                    {status === 'failed' && (
                        <div className="text-center py-12 text-red-500 dark:text-red-400 bg-red-500/10 dark:bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="font-semibold text-lg">Failed to load articles</p>
                            <p className="mt-2 text-sm">Could not fetch data from the RSS feeds. Please try again later.</p>
                        </div>
                    )}

                    {status === 'succeeded' && (
                        filteredArticles.length > 0 ? (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredArticles.map((article) => (
                                    <ArticleCard key={article.link} article={article} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                <p className="font-semibold text-lg">No articles found</p>
                                <p className="mt-2 text-sm">Try adjusting your search or filter criteria.</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </section>
    );
};

export default Publications;