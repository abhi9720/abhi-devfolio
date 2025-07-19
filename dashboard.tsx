import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import * as ALL_CONSTANTS from './constants';
import * as ICONS from './constants.icons';
import ThemeToggle from './components/ThemeToggle';

const CORRECT_PASSWORD = 'admin'; // Change this password

// A map of icon names to their components for dropdowns
const ICON_MAP = {
    IconMail: ICONS.IconMail,
    IconGitHub: ICONS.IconGitHub,
    IconLinkedIn: ICONS.IconLinkedIn,
    IconGlobe: ICONS.IconGlobe,
    IconNote: ICONS.IconNote,
    IconLeetCode: ICONS.IconLeetCode,
    IconDevTo: ICONS.IconDevTo,
    IconMedium: ICONS.IconMedium,
    IconTrophy: ICONS.IconTrophy,
    IconCode: ICONS.IconCode,
    IconCloud: ICONS.IconCloud,
    IconDatabase: ICONS.IconDatabase,
    IconApi: ICONS.IconApi,
    IconBrain: ICONS.IconBrain,
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

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
     <select
        {...props}
        className="w-full px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
);

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'danger' }> = ({ children, variant = 'primary', ...props }) => {
    const baseClasses = "px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800";
    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500',
        danger: 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500',
    };
    return <button {...props} className={`${baseClasses} ${variantClasses[variant]}`}>{children}</button>;
};

// --- CODE GENERATION LOGIC ---

const generateConstantsFile = (data: typeof ALL_CONSTANTS): string => {
    const iconsToImport = new Set<string>();

    const safeJSON = (obj: any) => JSON.stringify(obj, null, 2);

    const processItemWithIcon = (item: { icon?: any }) => {
        if (item.icon && typeof item.icon === 'string' && ICON_MAP[item.icon as keyof typeof ICON_MAP]) {
            iconsToImport.add(item.icon);
            return `{ ...${safeJSON({ ...item, icon: undefined })}, icon: React.createElement(${item.icon}) }`.replace(',\n    "icon": undefined\n', '');
        }
        return safeJSON(item);
    };

    const socialLinksString = data.SOCIAL_LINKS.map(processItemWithIcon).join(',\n');
    const keyHighlightsString = data.KEY_HIGHLIGHTS.map(processItemWithIcon).join(',\n');
    const skillCategoriesString = data.SKILL_CATEGORIES.map(processItemWithIcon).join(',\n');

    const importStatements = `import { ${[...iconsToImport].join(', ')} } from './constants.icons';`;

    return `import React from 'react';
import { Experience, Project, SkillCategory, Link, KeyHighlight, CategorizedSkillGroup } from './types';
${iconsToImport.size > 0 ? importStatements : ''}

export const PERSONAL_INFO = ${safeJSON(data.PERSONAL_INFO)};

export const RESUME_LINK = '${data.RESUME_LINK}';

export const SOCIAL_LINKS: Link[] = [
${socialLinksString}
];

export const KEY_HIGHLIGHTS: KeyHighlight[] = [
${keyHighlightsString}
];

export const EXPERIENCES: Experience[] = ${safeJSON(data.EXPERIENCES)};

export const PROJECTS: Project[] = ${safeJSON(data.PROJECTS)};

export const SKILLS: SkillCategory[] = ${safeJSON(data.SKILLS)};

export const CURRENT_INTERESTS: string[] = ${safeJSON(data.CURRENT_INTERESTS)};

export const SKILL_CATEGORIES: CategorizedSkillGroup[] = [
${skillCategoriesString}
];

export const EDUCATION = ${safeJSON(data.EDUCATION)};

// NOTE: This context document is auto-generated.
// Manual edits might be overwritten if you regenerate from the dashboard.
export const AI_CONTEXT_DOCUMENT = \`
This is a document about Abhishek “Abhi” Tiwari, a Backend-leaning Full-Stack Software Engineer. Use this information to answer questions about him.

### Personal & Contact Information
- **Name**: \${PERSONAL_INFO.name}
- **Title**: \${PERSONAL_INFO.title}
- **Location**: \${PERSONAL_INFO.location}
- **Email**: \${PERSONAL_INFO.email}
- **Phone**: \${PERSONAL_INFO.phone}
- **Resume Link**: \${RESUME_LINK}
- **Summary**: \${PERSONAL_INFO.summary}

### Social Links
\${SOCIAL_LINKS.map(link => \`- **\${link.name}**: \${link.url}\`).join('\\n')}

### Key Career Highlights
\${KEY_HIGHLIGHTS.map(h => \`- **\${h.metric}**: \${h.description}\`).join('\\n')}

### Professional Experience
\${EXPERIENCES.map(exp => \`
- **Role**: \${exp.role}
- **Company**: \${exp.company}
- **Period**: \${exp.period}
- **Location**: \${exp.location}
- **Details**: 
\${exp.description.map(d => \`  - \${d}\`).join('\\n')}
\`).join('\\n')}

### Projects
\${PROJECTS.map(p => \`
- **Title**: \${p.title}
- **Category**: \${p.category}
- **Technologies**: \${p.tech.join(', ')}
- **Tags**: \${p.tags.join(', ')}
- **Description**: \${p.description}
- **Link**: \${p.link}
\`).join('\\n')}

### Skills
\${SKILLS.map(cat => \`
- **\${cat.name}**: \${cat.skills.join(', ')}
\`).join('\\n')}

### Current Interests
\${CURRENT_INTERESTS.join(', ')}

### Publications
He actively writes technical articles on Medium and DEV.to. You can find his latest posts in the "Writing" section of the portfolio, which are fetched live from their respective platforms.

### Education
- **Degree**: \${EDUCATION.degree}
- **Institution**: \${EDUCATION.institution}
- **Period**: \${EDUCATION.period}
- **CGPA**: \${EDUCATION.cgpa}
- **Coursework**: \${EDUCATION.coursework.join(', ')}
\`;
`;
};

const generateIconsFile = (): string => {
    return `import { IconMail } from './components/icons/IconMail';
import { IconGitHub } from './components/icons/IconGitHub';
import { IconLinkedIn } from './components/icons/IconLinkedIn';
import { IconGlobe } from './components/icons/IconGlobe';
import { IconNote } from './components/icons/IconNote';
import { IconLeetCode } from './components/icons/IconLeetCode';
import { IconDevTo } from './components/icons/IconDevTo';
import { IconMedium } from './components/icons/IconMedium';
import { IconTrophy } from './components/icons/IconTrophy';
import { IconCode } from './components/icons/IconCode';
import { IconCloud } from './components/icons/IconCloud';
import { IconDatabase } from './components/icons/IconDatabase';
import { IconApi } from './components/icons/IconApi';
import { IconBrain } from './components/icons/IconBrain';

export {
    IconMail,
    IconGitHub,
    IconLinkedIn,
    IconGlobe,
    IconNote,
    IconLeetCode,
    IconDevTo,
    IconMedium,
    IconTrophy,
    IconCode,
    IconCloud,
    IconDatabase,
    IconApi,
    IconBrain,
};
`;
};


// --- MAIN DASHBOARD COMPONENT ---

const Dashboard: React.FC = () => {
    const { theme } = useTheme();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // Normalize data by replacing React elements with string keys
    const initialFormData = useMemo(() => {
        const iconNameMap = Object.entries(ICON_MAP).reduce((acc, [name, comp]) => {
            // This mapping is imperfect but works for this specific set of components
            const compString = comp.toString();
            acc[compString] = name;
            return acc;
        }, {} as Record<string, string>);
    
        const normalizeIcon = (iconElement: React.ReactNode) => {
            if (React.isValidElement(iconElement)) {
                const el = iconElement as React.ReactElement;
                const func = el.type;
                const iconName = Object.keys(ICONS).find(key => ICONS[key as keyof typeof ICONS] === func);
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
    const [generatedConstants, setGeneratedConstants] = useState('');
    const [generatedIcons, setGeneratedIcons] = useState('');

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

    const handleListStringChange = (section: keyof typeof formData, index: number, subField: string, itemIndex: number, value: string) => {
        const list = Array.isArray(formData[section]) ? formData[section] as any[] : [];
        const updatedList = [...list];
        const updatedSubList = [...updatedList[index][subField]];
        updatedSubList[itemIndex] = value;
        updatedList[index] = { ...updatedList[index], [subField]: updatedSubList };
        handleFormChange(section, updatedList);
    }
    
    const handleAddItem = (section: keyof typeof formData, newItem: any) => {
        const list = Array.isArray(formData[section]) ? formData[section] as any[] : [];
        handleFormChange(section, [...list, newItem]);
    };

    const handleRemoveItem = (section: keyof typeof formData, index: number) => {
        const list = Array.isArray(formData[section]) ? formData[section] as any[] : [];
        handleFormChange(section, list.filter((_, i) => i !== index));
    };

    const handleGenerate = () => {
        setGeneratedConstants(generateConstantsFile(formData));
        setGeneratedIcons(generateIconsFile());
    };

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
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

    const renderArrayEditor = (section: keyof typeof formData, fields: {key: string, label: string, type?: 'text' | 'textarea' | 'icon' | 'string-array'}[], newItem: object) => (
        <div className="space-y-4">
            {(formData[section] as any[]).map((item, index) => (
                <div key={index} className="p-4 bg-slate-100/50 dark:bg-slate-900/30 rounded-lg border border-slate-200 dark:border-slate-700/50 space-y-3 relative">
                    <Button onClick={() => handleRemoveItem(section, index)} variant="danger" className="absolute top-2 right-2 !px-2 !py-1 text-xs">Remove</Button>
                    {fields.map(field => (
                        <div key={field.key}>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{field.label}</label>
                            {field.type === 'textarea' ? (
                                <Textarea 
                                    value={Array.isArray(item[field.key]) ? (item[field.key] as string[]).join('\n') : item[field.key]} 
                                    onChange={(e) => handleNestedChange(section, index, field.key, field.key === 'description' ? e.target.value.split('\n') : e.target.value)}
                                    rows={4}
                                />
                            ) : field.type === 'icon' ? (
                                <Select value={item[field.key]} onChange={(e) => handleNestedChange(section, index, field.key, e.target.value)}>
                                    {Object.keys(ICON_MAP).map(iconName => <option key={iconName} value={iconName}>{iconName}</option>)}
                                </Select>
                            ) : field.type === 'string-array' ? (
                                <div className="space-y-2">
                                    {(item[field.key] as string[]).map((val, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <Input value={val} onChange={(e) => handleListStringChange(section, index, field.key, i, e.target.value)} />
                                            <Button onClick={() => handleListStringChange(section, index, field.key, -1, '')} variant="danger" className="!px-2 !py-1 text-xs">x</Button>
                                        </div>
                                    ))}
                                    <Button onClick={() => handleListStringChange(section, index, field.key, item[field.key].length, '')}>Add Item</Button>
                                </div>

                            ) : (
                                <Input 
                                    value={Array.isArray(item[field.key]) ? (item[field.key] as string[]).join(', ') : item[field.key]}
                                    onChange={(e) => handleNestedChange(section, index, field.key, field.key === 'tech' || field.key === 'tags' || field.key === 'skills' || field.key === 'coursework' ? e.target.value.split(',').map(s => s.trim()) : e.target.value)} />
                            )}
                        </div>
                    ))}
                </div>
            ))}
            <Button onClick={() => handleAddItem(section, newItem)}>Add New</Button>
        </div>
    );
    
    const copyToClipboard = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert(`${type} copied to clipboard!`);
        } catch (err) {
            alert(`Failed to copy ${type}.`);
        }
    };

    return (
        <div className="min-h-screen text-slate-700 dark:text-slate-300">
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    <h1 className="text-xl font-bold">Portfolio Content Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <Button onClick={handleGenerate}>Generate `constants.ts`</Button>
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
                                        <Textarea rows={4} value={value} onChange={e => handleFormChange('PERSONAL_INFO', {...formData.PERSONAL_INFO, [key]: e.target.value})} />
                                    ) : (
                                        <Input value={value} onChange={e => handleFormChange('PERSONAL_INFO', {...formData.PERSONAL_INFO, [key]: e.target.value})} />
                                    )}
                                </div>
                            ))}
                        </div>
                   </Section>
                   <Section title="Social Links">
                       {renderArrayEditor('SOCIAL_LINKS', [{key: 'name', label: 'Name'}, {key: 'url', label: 'URL'}, {key: 'icon', label: 'Icon', type: 'icon'}], { name: '', url: '', icon: 'IconGlobe'})}
                   </Section>
                   <Section title="Key Highlights">
                        {renderArrayEditor('KEY_HIGHLIGHTS', [{key: 'metric', label: 'Metric'}, {key: 'description', label: 'Description'}, {key: 'icon', label: 'Icon', type: 'icon'}], {metric: '', description: '', icon: 'IconTrophy'})}
                   </Section>
                   <Section title="Experience">
                        {renderArrayEditor('EXPERIENCES', [{key: 'role', label: 'Role'}, {key: 'company', label: 'Company'}, {key: 'period', label: 'Period'}, {key: 'location', label: 'Location'}, {key: 'summary', label: 'Summary', type: 'textarea'}, {key: 'description', label: 'Description (one item per line)', type: 'textarea'}], {role: '', company: '', period: '', location: '', description: [], summary: ''})}
                   </Section>
                   <Section title="Projects">
                       {renderArrayEditor('PROJECTS', [{key: 'title', label: 'Title'}, {key: 'category', label: 'Category'}, {key: 'tech', label: 'Technologies (comma-separated)'}, {key: 'tags', label: 'Tags (comma-separated)'}, {key: 'description', label: 'Description', type: 'textarea'}, {key: 'link', label: 'GitHub Link'}, {key: 'liveDemoUrl', label: 'Live Demo URL'}, {key: 'imageUrl', label: 'Image URL'}], {title: '', category: 'Full-Stack', tech: [], tags: [], description: '', link: '', imageUrl: ''})}
                   </Section>
                   <Section title="Skills">
                       {renderArrayEditor('SKILLS', [{key: 'name', label: 'Category Name'}, {key: 'skills', label: 'Skills (comma-separated)'}], {name: '', skills: []})}
                   </Section>
                   <Section title="Education">
                        <div className="space-y-3">
                           {Object.entries(formData.EDUCATION).map(([key, value]) => (
                               <div key={key}>
                                   <label className="capitalize block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{key}</label>
                                   <Input value={Array.isArray(value) ? value.join(', ') : value} onChange={e => handleFormChange('EDUCATION', {...formData.EDUCATION, [key]: key === 'coursework' ? e.target.value.split(',').map(s => s.trim()) : e.target.value})} />
                               </div>
                           ))}
                        </div>
                   </Section>
                </div>
                <div className="sticky top-20">
                    {generatedConstants && (
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-lg">Generated `constants.ts`</h3>
                                    <Button onClick={() => copyToClipboard(generatedConstants, 'constants.ts code')}>Copy</Button>
                                </div>
                                <pre className="w-full h-[60vh] overflow-auto p-4 rounded-lg bg-slate-900 text-slate-100 border border-slate-700 text-sm">
                                    <code>{generatedConstants}</code>
                                </pre>
                             </div>
                             <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-lg">Generated `constants.icons.ts`</h3>
                                    <Button onClick={() => copyToClipboard(generatedIcons, 'constants.icons.ts code')}>Copy</Button>
                                </div>
                                <pre className="w-full h-auto overflow-auto p-4 rounded-lg bg-slate-900 text-slate-100 border border-slate-700 text-sm">
                                    <code>{generatedIcons}</code>
                                </pre>
                                <p className="text-xs mt-2 text-slate-500">Create a new file named `constants.icons.ts` in your `src` folder and paste this content.</p>
                             </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// Wrapper with ThemeProvider
const DashboardApp: React.FC = () => {
    return (
        <ThemeProvider>
            <Dashboard />
        </ThemeProvider>
    );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <DashboardApp />
    </React.StrictMode>
);