import React, { useState, useMemo } from 'react';
import { TECH_RADAR_DATA } from '../constants';
import type { TechRadarEntry, TechRadarQuadrant, TechRadarRing } from '../types';
import { useTheme } from '../contexts/ThemeContext';

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <div className="sticky top-0 z-10 py-4 mb-4 bg-slate-50/75 dark:bg-slate-900/75 backdrop-blur lg:static lg:mb-0 lg:py-0 lg:bg-transparent">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 lg:sr-only">{title}</h2>
    </div>
);

// A simple string hashing function to get a deterministic value between 0 and 1
const simpleHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return (hash >>> 0) / 0xFFFFFFFF; // Make it a positive float between 0 and 1
};

const RADAR_SIZE = 600;
const CENTER = RADAR_SIZE / 2;
const PADDING = 40;

const RINGS_CONFIG: { [key in TechRadarRing]: { name: string, label: string, inner: number, outer: number, colorLight: string, colorDark: string } } = {
    adopt:  { name: 'adopt',  label: 'Adopt',  inner: 0,                                 outer: (CENTER - PADDING) * 0.30, colorLight: 'rgba(34, 197, 94, 0.2)', colorDark: 'rgba(34, 197, 94, 0.2)' },
    trial:  { name: 'trial',  label: 'Trial',  inner: (CENTER - PADDING) * 0.30,         outer: (CENTER - PADDING) * 0.60, colorLight: 'rgba(59, 130, 246, 0.2)', colorDark: 'rgba(59, 130, 246, 0.2)' },
    assess: { name: 'assess', label: 'Assess', inner: (CENTER - PADDING) * 0.60,         outer: (CENTER - PADDING) * 0.85, colorLight: 'rgba(249, 115, 22, 0.2)', colorDark: 'rgba(249, 115, 22, 0.2)' },
    hold:   { name: 'hold',   label: 'Hold',   inner: (CENTER - PADDING) * 0.85,         outer: (CENTER - PADDING) * 1.0,  colorLight: 'rgba(107, 114, 128, 0.2)', colorDark: 'rgba(107, 114, 128, 0.2)' }
};

const QUADRANTS_CONFIG: { [key in TechRadarQuadrant]: { name: string, startAngle: number, endAngle: number, color: string } } = {
    languagesAndFrameworks: { name: 'Languages & Frameworks', startAngle: 0,   endAngle: 90,  color: '#ef4444' }, // top right
    tools:                  { name: 'Tools',                  startAngle: 90,  endAngle: 180, color: '#f97316' }, // bottom right
    platforms:              { name: 'Platforms',              startAngle: 180, endAngle: 270, color: '#8b5cf6' }, // bottom left
    techniques:             { name: 'Techniques',             startAngle: 270, endAngle: 360, color: '#3b82f6' }, // top left
};

interface RadarPoint extends TechRadarEntry {
    x: number;
    y: number;
    color: string;
    key: string;
}

const RING_DEFINITIONS = [
    {
        name: 'Adopt',
        description: 'Technologies I have high confidence in and use for production builds.',
        color: 'bg-green-500',
    },
    {
        name: 'Trial',
        description: 'Technologies I have used in projects and am becoming proficient with.',
        color: 'bg-blue-500',
    },
    {
        name: 'Assess',
        description: 'Technologies I am currently learning or exploring for future projects.',
        color: 'bg-orange-500',
    },
    {
        name: 'Hold',
        description: 'Technologies I have experience with but am not actively using in new projects.',
        color: 'bg-slate-500',
    },
];

const TechRadar: React.FC = () => {
    const [activeEntry, setActiveEntry] = useState<RadarPoint | null>(null);
    const { theme } = useTheme();

    const radarPoints = useMemo((): RadarPoint[] => {
        const allEntries = Object.values(TECH_RADAR_DATA).flat();
        return allEntries.map((entry, index) => {
            const quadrant = QUADRANTS_CONFIG[entry.quadrant];
            const ring = RINGS_CONFIG[entry.ring];

            const angleJitter = simpleHash(entry.name + 'angle') * 0.9 + 0.05; // from 5% to 95% of the quadrant
            const radiusJitter = simpleHash(entry.name + 'radius') * 0.9 + 0.05; // from 5% to 95% of the ring

            const angle = quadrant.startAngle + (quadrant.endAngle - quadrant.startAngle) * angleJitter;
            const radius = ring.inner + (ring.outer - ring.inner) * radiusJitter;
            
            const x = CENTER + radius * Math.cos(angle * Math.PI / 180);
            const y = CENTER + radius * Math.sin(angle * Math.PI / 180);

            return { ...entry, x, y, color: quadrant.color, key: `${entry.name}-${index}` };
        });
    }, []);
    
    const rings = Object.values(RINGS_CONFIG).reverse(); // Draw largest first

    return (
        <section id="tech-radar" className="scroll-mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <h2 className="sticky top-0 hidden lg:block py-4 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200">TECH RADAR</h2>
                </div>
                <div className="lg:col-span-3">
                    <SectionHeader title="Tech Radar" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        <div className="md:col-span-2">
                             <svg viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`} className="w-full h-auto">
                                <g>
                                    {rings.map(ring => (
                                        <circle
                                            key={ring.name}
                                            cx={CENTER}
                                            cy={CENTER}
                                            r={ring.outer}
                                            fill={theme === 'dark' ? ring.colorDark : ring.colorLight}
                                            stroke={theme === 'dark' ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                                            strokeWidth="1"
                                        />
                                    ))}
                                </g>
                                <g className="lines" stroke={theme === 'dark' ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} strokeWidth="1">
                                    <line x1="0" y1={CENTER} x2={RADAR_SIZE} y2={CENTER} />
                                    <line x1={CENTER} y1="0" x2={CENTER} y2={RADAR_SIZE} />
                                </g>
                                <g className="labels" fill={theme === 'dark' ? "#94a3b8" : "#64748b"} fontSize="12" fontWeight="bold">
                                    {Object.values(QUADRANTS_CONFIG).map(q => {
                                        const angle = q.startAngle + 45;
                                        const r = CENTER - PADDING/2;
                                        const x = CENTER + r * Math.cos(angle * Math.PI / 180);
                                        const y = CENTER + r * Math.sin(angle * Math.PI / 180);
                                        return <text key={q.name} x={x} y={y} textAnchor="middle" dominantBaseline="middle">{q.name}</text>
                                    })}
                                    {rings.map(ring => (
                                         <text key={ring.label} x={CENTER + 5} y={CENTER - ring.outer + 12} textAnchor="start" className="opacity-70">{ring.label}</text>
                                    ))}
                                </g>
                                <g className="blips">
                                    {radarPoints.map(p => (
                                        <g key={p.key} onMouseEnter={() => setActiveEntry(p)} onMouseLeave={() => setActiveEntry(null)} className="cursor-pointer">
                                            <circle cx={p.x} cy={p.y} r="10" fill={p.color} className="opacity-20 transition-opacity duration-300" />
                                            <circle 
                                                cx={p.x} cy={p.y} r="5" 
                                                fill={p.color} 
                                                className={`transition-all duration-300 ${activeEntry?.key === p.key ? 'transform scale-150' : ''}`}
                                            />
                                            <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize="10" fill={theme === 'dark' ? "#e2e8f0" : "#1e293b"} className={`pointer-events-none transition-opacity duration-300 ${activeEntry?.key === p.key ? 'opacity-100' : 'opacity-0'}`}>{p.name}</text>
                                        </g>
                                    ))}
                                </g>
                            </svg>
                        </div>
                        <div className="md:col-span-1 min-h-[300px] p-6 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                            {activeEntry ? (
                                <div className="animate-fade-in-up">
                                    <h4 className="font-bold text-lg" style={{ color: activeEntry.color }}>{activeEntry.name}</h4>
                                    <div className="mt-1 flex items-center gap-2">
                                        <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">RING:</span>
                                        <span className="capitalize text-sm font-medium text-slate-700 dark:text-slate-300">{activeEntry.ring}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">QUADRANT:</span>
                                        <span className="capitalize text-sm font-medium text-slate-700 dark:text-slate-300">{QUADRANTS_CONFIG[activeEntry.quadrant].name}</span>
                                    </div>
                                    <p className="text-sm mt-3 text-slate-600 dark:text-slate-400">{activeEntry.description}</p>
                                </div>
                            ) : (
                                <div className="animate-fade-in-up">
                                    <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-4">What do the rings mean?</h4>
                                    <ul className="space-y-4">
                                        {RING_DEFINITIONS.map(ring => (
                                            <li key={ring.name} className="flex items-start gap-3">
                                                <div className={`mt-1 h-3 w-3 rounded-full flex-shrink-0 ${ring.color}`}></div>
                                                <div>
                                                    <strong className="font-semibold text-slate-700 dark:text-slate-300">{ring.name}</strong>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{ring.description}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TechRadar;