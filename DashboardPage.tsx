import React, { useState, useMemo } from 'react';
import { useTheme } from './contexts/ThemeContext';
import * as ALL_CONSTANTS from './constants';
import ThemeToggle from './components/ThemeToggle';

import { FaGithub, FaLinkedin, FaDev, FaMedium } from 'react-icons/fa';
import { FiGlobe, FiCode, FiCloud, FiDatabase, FiTrash2 } from 'react-icons/fi';
import { HiOutlineMail, HiOutlineDocumentText } from 'react-icons/hi';
import { SiLeetcode } from 'react-icons/si';
import { BsFillDiagram3Fill } from 'react-icons/bs';
import { RiBrainLine } from 'react-icons/ri';
import { IconTrophy } from './components/icons/IconTrophy';
import type { TechRadarEntry } from './types';

const CORRECT_PASSWORD = 'admin'; // Change this password

// A map of icon names to their components for dropdowns and previews
const ICON_MAP: { [key: string]: React.ComponentType<any> } = {
    FaGithub, FaLinkedin, FaDev, FaMedium,
    FiGlobe, FiCode, FiCloud, FiDatabase,
    HiOutlineMail, HiOutlineDocumentText,
    SiLeetcode,
    BsFillDiagram3Fill,
    RiBrainLine,
    IconTrophy,
};

// --- HELPER COMPONENTS ---

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-bold text-lg text-slate-800 dark:text-slate-200"
            >
                {title}
                <svg
                    className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && <div className="p-4 border-t border-slate-200 dark:border-slate-700">{children}</div>}
        </div>
    );
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className="w-full px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea
        {...props}
        className="w-full px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { iconPreview?: string }> = ({ iconPreview, ...props }) => {
    const IconComponent = iconPreview ? ICON_MAP[iconPreview] : null;
    return (
        <div className="relative">
            <select
                {...props}
                className="w-full pl-10 pr-4 py-2 appearance-none rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {props.children}
            </select>
            {IconComponent && <IconComponent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />}
        </div>
    );
};

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'danger' }> = ({ children, variant = 'primary', ...props }) => {
    const baseClasses = "px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500',
        danger: 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500',
    };
    return <button {...props} className={`${baseClasses} ${variantClasses[variant]} ${props.className || ''}`}>{children}</button>;
};

// --- CODE GENERATION LOGIC ---
const generateConstantsFile = (data: any): string => {
    const reactIcons = new Map<string, string>(); // Map<IconName, Library>
    const localIcons = new Map<string, string>(); // Map<IconName, Path>

    const getLib = (name: string) => name.substring(0, 2).toLowerCase();

    const collectIcons = (items: any[]) => {
        if (!Array.isArray(items)) return;
        items.forEach(item => {
            if (item.icon && typeof item.icon === 'string' && ICON_MAP[item.icon]) {
                const iconName = item.icon;
                if (iconName.startsWith('Icon')) {
                    localIcons.set(iconName, `./components/icons/${iconName}`);
                } else {
                    reactIcons.set(iconName, getLib(iconName));
                }
            }
        });
    };

    collectIcons(data.SOCIAL_LINKS);
    collectIcons(data.KEY_HIGHLIGHTS);
    collectIcons(data.SKILL_CATEGORIES);

    const importsByLib = Array.from(reactIcons.entries()).reduce((acc, [name, lib]) => {
        if (!acc[lib]) acc[lib] = [];
        if (!acc[lib].includes(name)) acc[lib].push(name);
        return acc;
    }, {} as Record<string, string[]>);
    
    const reactIconImportStrings = Object.entries(importsByLib)
        .map(([lib, names]) => `import { ${names.sort().join(', ')} } from 'react-icons/${lib}';`)
        .join('\n');

    const localIconImportStrings = Array.from(localIcons.entries()).sort((a,b) => a[0].localeCompare(b[0]))
        .map(([name, path]) => `import { ${name} } from '${path}';`)
        .join('\n');

    const allImportStrings = [
        'import React from \'react\';', 
        `import { Experience, Project, SkillCategory, Link, KeyHighlight, CategorizedSkillGroup, Certification, TechRadarData, TechRadarEntry } from './types';`, 
        reactIconImportStrings, 
        localIconImportStrings
    ].filter(Boolean).join('\n');

    const stringifyObject = (obj: any): string => {
        if (typeof obj !== 'object' || obj === null) {
            return JSON.stringify(obj);
        }
        if (Array.isArray(obj)) {
            return `[${obj.map(stringifyObject).join(', ')}]`;
        }
        const props = Object.entries(obj).map(([key, value]) => {
            if (key === 'icon' && typeof value === 'string') {
                 return `${key}: React.createElement(${value})`;
            }
            return `${key}: ${stringifyObject(value)}`;
        }).join(', ');

        return `{ ${props} }`;
    };

    const formatObjectForExport = (obj: any) => {
        let str = JSON.stringify(obj, (key, value) => {
             if (key === 'icon' && typeof value === 'string') {
                return `React.createElement(${value})`;
            }
            return value;
        }, 2);
        
        // Un-quote the React.createElement calls
        str = str.replace(/"(React.createElement\([^)]+\))"/g, '$1');
        return str;
    }

    return `${allImportStrings}


export const PERSONAL_INFO = ${JSON.stringify(data.PERSONAL_INFO, null, 2)};

export const RESUME_LINK = '${data.RESUME_LINK}';

export const SOCIAL_LINKS: Link[] = ${formatObjectForExport(data.SOCIAL_LINKS)};

export const KEY_HIGHLIGHTS: KeyHighlight[] = ${formatObjectForExport(data.KEY_HIGHLIGHTS)};

export const EXPERIENCES: Experience[] = ${JSON.stringify(data.EXPERIENCES, null, 2)};

export const PROJECTS: Project[] = ${JSON.stringify(data.PROJECTS, null, 2)};

export const SKILLS: SkillCategory[] = ${JSON.stringify(data.SKILLS, null, 2)};

export const CURRENT_INTERESTS: string[] = ${JSON.stringify(data.CURRENT_INTERESTS, null, 2)};

export const SKILL_CATEGORIES: CategorizedSkillGroup[] = ${formatObjectForExport(data.SKILL_CATEGORIES)};

export const TECH_RADAR_DATA: TechRadarData = ${JSON.stringify(data.TECH_RADAR_DATA, null, 2)};

export const EXAMPLE_PROMPTS: string[] = ${JSON.stringify(data.EXAMPLE_PROMPTS, null, 2)};

export const EDUCATION = ${JSON.stringify(data.EDUCATION, null, 2)};

export const CERTIFICATIONS: Certification[] = ${JSON.stringify(data.CERTIFICATIONS, null, 2)};

export const AI_CONTEXT_DOCUMENT = \`
This is a document about Abhishek “Abhi” Tiwari, a Backend-leaning Full-Stack Software Engineer. Use this information to answer questions about him.

### Personal & Contact Information
- **Name**: ${data.PERSONAL_INFO.name}
- **Title**: ${data.PERSONAL_INFO.title}
- **Location**: ${data.PERSONAL_INFO.location}
- **Email**: ${data.PERSONAL_INFO.email}
- **Phone**: ${data.PERSONAL_INFO.phone}
- **Resume Link**: ${data.RESUME_LINK}
- **Summary**: ${data.PERSONAL_INFO.summary}

### Social Links
${data.SOCIAL_LINKS.map((link: any) => `- **${link.name}**: ${link.url}`).join('\n')}

### Key Career Highlights
${data.KEY_HIGHLIGHTS.map((h: any) => `- **${h.metric}**: ${h.description}`).join('\n')}

### Professional Experience
${data.EXPERIENCES.map((exp: any) => `
- **Role**: ${exp.role}
- **Company**: ${exp.company}
- **Period**: ${exp.period}
- **Location**: ${exp.location}
- **Details**: 
${exp.description.map((d: any) => `  - ${d}`).join('\n')}
`).join('\n')}

### Projects
${data.PROJECTS.map((p: any) => `
- **Title**: ${p.title}
- **Category**: ${p.category}
- **Technologies**: ${p.tech.join(', ')}
- **Tags**: ${p.tags.join(', ')}
- **Description**: ${p.description}
- **Link**: ${p.link}
`).join('\n')}

### Skills
${data.SKILLS.map((cat: any) => `
- **${cat.name}**: ${cat.skills.join(', ')}
`).join('\n')}

### Tech Radar
My tech radar represents my current view on different technologies.
- **Adopt**: Technologies I have high confidence in and use for production builds.
- **Trial**: Technologies I have used in projects and am becoming proficient with.
- **Assess**: Technologies I am currently learning or exploring for future projects.
- **Hold**: Technologies I have experience with but am not actively using in new projects.

${Object.entries(data.TECH_RADAR_DATA).map(([quadrant, entries]) => {
  const quadrantName = quadrant.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase());
  return `#### ${quadrantName}\\n${(entries as TechRadarEntry[]).map(entry => `- ${entry.name} (${entry.ring}): ${entry.description}`).join('\\n')}`;
}).join('\\n\\n')
}

### Certifications
${data.CERTIFICATIONS.map((cert: any) => `- **${cert.name}**: View at ${cert.link}`).join('\n')}

### Current Interests
${data.CURRENT_INTERESTS.join(', ')}

### Publications
He actively writes technical articles on Medium and DEV.to. You can find his latest posts in the "Writing" section of the portfolio, which are fetched live from their respective platforms.

### Education
- **Degree**: ${data.EDUCATION.degree}
- **Institution**: ${data.EDUCATION.institution}
- **Period**: ${data.EDUCATION.period}
- **CGPA**: ${data.EDUCATION.cgpa}
- **Coursework**: ${data.EDUCATION.coursework.join(', ')}
\`;
`;
};

// --- MAIN DASHBOARD COMPONENT ---

const DashboardPage: React.FC = () => {
    const { theme } = useTheme();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // Normalize data by replacing React elements with string keys
    const initialFormData = useMemo(() => {
        const normalizeIcon = (iconElement: React.ReactNode) => {
            if (React.isValidElement(iconElement)) {
                const el = iconElement as React.ReactElement;
                const iconName = Object.keys(ICON_MAP).find(key => ICON_MAP[key] === el.type);
                return iconName || 'UnknownIcon';
            }
            return 'UnknownIcon';
        };
    
        return {
            ...ALL_CONSTANTS,
            SOCIAL_LINKS: ALL_CONSTANTS.SOCIAL_LINKS.map(item => ({...item, icon: normalizeIcon(item.icon) })),
            KEY_HIGHLIGHTS: ALL_CONSTANTS.KEY_HIGHLIGHTS.map(item => ({...item, icon: normalizeIcon(item.icon) })),
            SKILL_CATEGORIES: ALL_CONSTANTS.SKILL_CATEGORIES.map(item => ({...item, icon: normalizeIcon(item.icon) })),
        };
    }, []);

    const [formData, setFormData] = useState(initialFormData);
    const [generatedCode, setGeneratedCode] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === CORRECT_PASSWORD) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Incorrect password.');
        }
    };
    
    const handleFormChange = (section: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [section]: value }));
    };
    
    const handleNestedChange = (section: keyof typeof formData, index: number, field: string, value: any) => {
        const list = Array.isArray(formData[section]) ? formData[section] as any[] : [];
        const updatedList = [...list];
        updatedList[index] = { ...updatedList[index], [field]: value };
        handleFormChange(section, updatedList);
    };
    
    const handleAddItem = (section: keyof typeof formData, newItem: any) => {
        const list = Array.isArray(formData[section]) ? formData[section] as any[] : [];
        handleFormChange(section, [...list, newItem]);
    };

    const handleRemoveItem = (section: keyof typeof formData, index: number) => {
        const list = Array.isArray(formData[section]) ? formData[section] as any[] : [];
        handleFormChange(section, list.filter((_, i) => i !== index));
    };

    const handleGenerate = () => {
        setGeneratedCode(generateConstantsFile(formData));
    };

    if (!isAuthenticated) {
        return (
            <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <form onSubmit={handleLogin} className="p-8 bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-sm space-y-4 border border-slate-200 dark:border-slate-700">
                    <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-slate-100">Dashboard Login</h1>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" className="w-full">Login</Button>
                </form>
            </div>
        );
    }
    
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert(`constants.ts code copied to clipboard!`);
        } catch (err) {
            alert(`Failed to copy code.`);
        }
    };

    const renderArrayEditor = (
        section: keyof typeof formData, 
        fields: {key: string, label: string, type?: 'text' | 'textarea' | 'textarea-array' | 'icon' | 'select', options?: string[]}[], 
        newItem: object
    ) => (
        <div className="space-y-4">
            {(formData[section] as any[]).map((item, index) => (
                <div key={index} className="p-4 bg-slate-100/50 dark:bg-slate-900/30 rounded-lg border border-slate-200 dark:border-slate-700/50 space-y-3 relative">
                    <Button onClick={() => handleRemoveItem(section, index)} variant="danger" className="!p-2 absolute top-2 right-2 text-xs">
                        <FiTrash2 className="h-4 w-4"/>
                    </Button>
                    {fields.map(field => (
                        <div key={field.key}>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{field.label}</label>
                            {field.type === 'textarea' ? (
                                <Textarea rows={3} value={item[field.key]} onChange={(e) => handleNestedChange(section, index, field.key, e.target.value)} />
                            ) : field.type === 'textarea-array' ? (
                                <Textarea rows={4} value={Array.isArray(item[field.key]) ? item[field.key].join('\n') : item[field.key]} onChange={(e) => handleNestedChange(section, index, field.key, e.target.value.split('\n'))} placeholder="One item per line" />
                            ) : field.type === 'icon' ? (
                                <Select value={item[field.key]} iconPreview={item[field.key]} onChange={(e) => handleNestedChange(section, index, field.key, e.target.value)}>
                                    {Object.keys(ICON_MAP).sort().map(iconName => <option key={iconName} value={iconName}>{iconName}</option>)}
                                </Select>
                            ) : field.type === 'select' ? (
                                <Select value={item[field.key]} onChange={(e) => handleNestedChange(section, index, field.key, e.target.value)}>
                                  {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </Select>
                            ) : (
                                <Input value={Array.isArray(item[field.key]) ? item[field.key].join(', ') : item[field.key]} onChange={(e) => handleNestedChange(section, index, field.key, (field.key === 'tech' || field.key === 'tags' || field.key === 'skills' || field.key === 'coursework') ? e.target.value.split(',').map(s => s.trim()) : e.target.value)} />
                            )}
                        </div>
                    ))}
                </div>
            ))}
            <Button onClick={() => handleAddItem(section, newItem)}>Add New</Button>
        </div>
    );

    return (
        <div className="min-h-screen text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900">
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    <h1 className="text-xl font-bold">Portfolio Content Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <Button onClick={handleGenerate} disabled={!!generatedCode}>Generate `constants.ts`</Button>
                        <ThemeToggle />
                    </div>
                </div>
            </header>
            <main className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                   <Section title="Personal Info">
                        <div className="space-y-3">
                            {Object.entries(formData.PERSONAL_INFO).map(([key, value]) => (
                                <div key={key}>
                                    <label className="capitalize block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                                    {key === 'summary' ? (
                                        <Textarea rows={4} value={value as string} onChange={e => handleFormChange('PERSONAL_INFO', {...formData.PERSONAL_INFO, [key]: e.target.value})} />
                                    ) : (
                                        <Input value={value as string} onChange={e => handleFormChange('PERSONAL_INFO', {...formData.PERSONAL_INFO, [key]: e.target.value})} />
                                    )}
                                </div>
                            ))}
                        </div>
                   </Section>
                   <Section title="Social Links">
                       {renderArrayEditor('SOCIAL_LINKS', [{key: 'name', label: 'Name'}, {key: 'url', label: 'URL'}, {key: 'icon', label: 'Icon', type: 'icon'}], { name: '', url: '', icon: 'FiGlobe'})}
                   </Section>
                   <Section title="Key Highlights">
                        {renderArrayEditor('KEY_HIGHLIGHTS', [{key: 'metric', label: 'Metric'}, {key: 'description', label: 'Description'}, {key: 'icon', label: 'Icon', type: 'icon'}], {metric: '', description: '', icon: 'IconTrophy'})}
                   </Section>
                   <Section title="Experience">
                        {renderArrayEditor('EXPERIENCES', [{key: 'role', label: 'Role'}, {key: 'company', label: 'Company'}, {key: 'period', label: 'Period'}, {key: 'location', label: 'Location'}, {key: 'summary', label: 'Summary', type: 'textarea'}, {key: 'description', label: 'Description (one per line)', type: 'textarea-array'}], {role: '', company: '', period: '', location: '', description: [], summary: ''})}
                   </Section>
                   <Section title="Projects">
                       {renderArrayEditor('PROJECTS', [{key: 'title', label: 'Title'}, {key: 'category', label: 'Category', type: 'select', options:['Backend', 'Frontend', 'AI', 'Full-Stack']}, {key: 'tech', label: 'Technologies (comma-separated)'}, {key: 'tags', label: 'Tags (comma-separated)'}, {key: 'description', label: 'Description', type: 'textarea'}, {key: 'link', label: 'GitHub Link'}, {key: 'liveDemoUrl', label: 'Live Demo URL'}, {key: 'imageUrl', label: 'Image URL'}], {title: '', category: 'Full-Stack', tech: [], tags: [], description: '', link: '', imageUrl: ''})}
                   </Section>
                   <Section title="Skills">
                       {renderArrayEditor('SKILLS', [{key: 'name', label: 'Category Name'}, {key: 'skills', label: 'Skills (comma-separated)'}], {name: '', skills: []})}
                   </Section>
                    <Section title="AI Example Prompts">
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Prompts (one per line)</label>
                                <Textarea 
                                    rows={4} 
                                    value={Array.isArray(formData.EXAMPLE_PROMPTS) ? formData.EXAMPLE_PROMPTS.join('\n') : ''} 
                                    onChange={e => handleFormChange('EXAMPLE_PROMPTS', e.target.value.split('\n').filter(p => p.trim() !== ''))} 
                                    placeholder="One prompt per line"
                                />
                            </div>
                        </div>
                   </Section>
                   <Section title="Education">
                        <div className="space-y-3">
                           {Object.entries(formData.EDUCATION).map(([key, value]) => (
                               <div key={key}>
                                   <label className="capitalize block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                                   <Input value={Array.isArray(value) ? value.join(', ') : value as string} onChange={e => handleFormChange('EDUCATION', {...formData.EDUCATION, [key]: key === 'coursework' ? e.target.value.split(',').map(s => s.trim()) : e.target.value})} />
                               </div>
                           ))}
                        </div>
                   </Section>
                </div>
                <div className="sticky top-20">
                    {generatedCode ? (
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-lg">Generated `constants.ts`</h3>
                                    <div className="flex gap-2">
                                        <Button onClick={() => copyToClipboard(generatedCode)}>Copy</Button>
                                        <Button onClick={() => setGeneratedCode('')} variant="danger">Clear</Button>
                                    </div>
                                </div>
                                <pre className="w-full h-[80vh] overflow-auto p-4 rounded-lg bg-slate-900 text-slate-100 border border-slate-700 text-sm">
                                    <code>{generatedCode}</code>
                                </pre>
                             </div>
                        </div>
                    ) : (
                        <div className="text-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                           <h3 className="text-lg font-semibold">Generate Code</h3>
                           <p className="mt-2 text-slate-500">Edit the content on the left and click the "Generate" button to see the new `constants.ts` file here.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
