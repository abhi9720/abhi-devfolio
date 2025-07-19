import React from 'react';
import GitHubCalendar from 'react-github-calendar';
import { PERSONAL_INFO } from '../constants';
import { useTheme } from '../contexts/ThemeContext';

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <div className="sticky top-0 z-10 py-4 mb-4 bg-slate-50/75 dark:bg-slate-900/75 backdrop-blur lg:static lg:mb-0 lg:py-0 lg:bg-transparent">
        <h2 className="text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-slate-900 to-blue-600 dark:from-slate-200 dark:to-blue-500 text-transparent bg-clip-text lg:sr-only">{title}</h2>
    </div>
);

const GitHubActivity: React.FC = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const gitHubStatsTheme = isDark 
        ? 'transparent&text_color=cbd5e1&title_color=3b82f6&icon_color=60a5fa&border_color=334155'
        : 'transparent&text_color=475569&title_color=2563eb&icon_color=3b82f6&border_color=e2e8f0';


    return (
        <section id="github" className="scroll-mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <h2 className="sticky top-0 hidden lg:block py-4 text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-slate-900 to-blue-500 dark:from-slate-200 dark:to-blue-500 text-transparent bg-clip-text">Activity</h2>
                </div>
                <div className="lg:col-span-3">
                    <SectionHeader title="GitHub Activity" />
                    <div className="p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 overflow-x-auto github-calendar-container">
                        <GitHubCalendar 
                            username={PERSONAL_INFO.nickname} 
                            blockSize={14} 
                            blockMargin={4}
                            fontSize={12}
                            theme={{
                                light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                                dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                            }}
                            colorScheme={theme}
                            hideTotalCount={true}
                            hideColorLegend={true}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <img 
                            alt="Abhi's GitHub Stats"
                            src={`https://github-readme-stats.vercel.app/api?username=${PERSONAL_INFO.nickname}&show_icons=true&theme=${gitHubStatsTheme}`}
                            className="w-full h-auto rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-4"
                        />
                        <img 
                            alt="Abhi's Top Languages"
                            src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${PERSONAL_INFO.nickname}&layout=compact&theme=${gitHubStatsTheme}&hide_border=true&bg_color=00000000`}
                            className="w-full h-auto rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-4"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GitHubActivity;