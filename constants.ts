import React from 'react';
import { Experience, Project, SkillCategory, Link, KeyHighlight, CategorizedSkillGroup } from './types';
import { IconMail } from './components/icons/IconMail';
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

export const PERSONAL_INFO = {
  name: 'Abhishek “Abhi” Tiwari',
  nickname: 'abhi9720',
  title: 'Backend-leaning Full-Stack Software Engineer',
  location: 'Bangalore / Gwalior, India',
  email: 'abhishek.nitmn@gmail.com',
  phone: '+91-9876543210',
  photoUrl: 'https://avatars.githubusercontent.com/u/68281476?v=4',
  summary: 'Backend-leaning full-stack Software Engineer with strong foundations in Golang, Java, Spring Boot, Distributed Systems, and Cloud Architecture. Proven experience handling high-load systems (100K+ req/day), real-time pipelines, and LLM-based applications. Fast adopter of emerging technologies like vector search, RAG, and Kubernetes-based microservices.',
};

export const RESUME_LINK = 'https://drive.google.com/file/d/1UWDYhLGwUqb5UhvK9uq5nN1GkCFxF3FQ/preview';

export const SOCIAL_LINKS: Link[] = [
  { name: 'GitHub', url: 'https://github.com/abhi9720', icon: React.createElement(IconGitHub) },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/abhi9720', icon: React.createElement(IconLinkedIn) },
  { name: 'Email', url: `mailto:${PERSONAL_INFO.email}`, icon: React.createElement(IconMail) },
  { name: 'Portfolio', url: 'https://abhi9720.netlify.app', icon: React.createElement(IconGlobe) },
  { name: 'Notes & Blog', url: 'https://abhisheks-notes.super.site', icon: React.createElement(IconNote) },
  { name: 'LeetCode', url: 'https://leetcode.com/abhi9720', icon: React.createElement(IconLeetCode) },
  { name: 'DEV.to', url: 'https://dev.to/abhi9720', icon: React.createElement(IconDevTo) },
  { name: 'Medium', url: 'https://medium.com/@Abhishektiwari', icon: React.createElement(IconMedium) },
];

export const KEY_HIGHLIGHTS: KeyHighlight[] = [
    {
        metric: '100K+ req/day',
        description: 'Handled microservices & achieved a 35% latency drop.',
        icon: React.createElement(IconTrophy)
    },
    {
        metric: '99.9% Reliability',
        description: 'Built a resilient async distributed task system.',
        icon: React.createElement(IconTrophy)
    },
    {
        metric: '50K+ Daily Users',
        description: 'Engineered a real-time gamification platform.',
        icon: React.createElement(IconTrophy)
    },
];

export const EXPERIENCES: Experience[] = [
  {
    role: 'Software Development Engineer I',
    company: 'PeopleStrong',
    period: 'Apr 2024 – Present',
    location: 'Bangalore, India',
    description: [
      'Built microservices using Java + Spring Boot handling 100K+ requests/day with 35% latency improvement using Redis caching and connection pooling.',
      'Developed a real-time gamification engine and ILT attendance system processing 50K+ daily API calls using Go, Kafka, and Redis.',
      'Designed a secure RBAC system using Spring Security and industry design patterns.',
    ],
    summary: 'Built scalable Java microservices for 100K+ daily requests and a real-time gamification engine with Go & Kafka. Optimized latency by 35% using Redis and designed a secure RBAC system.',
  },
  {
    role: 'Associate Software Engineer',
    company: 'Imperva',
    period: 'Nov 2023 – Mar 2024',
    location: 'Bangalore, India',
    description: [
      'Created a distributed async task system using Go, Redis, Asynq, integrated DLQ handling and monitoring via Prometheus.',
      'Deployed the system on Kubernetes with auto-scaling, achieving 99.9% success rate.',
    ],
    summary: 'Developed a resilient, distributed async task system in Go with Redis and Asynq, deployed on Kubernetes. Achieved 99.9% reliability with integrated monitoring via Prometheus and DLQ handling.',
  },
  {
    role: 'Software Engineer Intern',
    company: 'Nagarro',
    period: 'Mar 2023 – Nov 2023',
    location: 'Gwalior, India',
    description: [
      'Optimized Spring Boot APIs using Hibernate-level caching for 25% performance boost.',
      'Migrated Oracle SQL workloads to SQL Server, improving execution by 30%.',
      'Deployed services on AWS (EC2, RDS, S3, VPC) ensuring high uptime.',
    ],
    summary: 'Boosted Spring Boot API performance by 25% via Hibernate caching and optimized database workloads by 30% through SQL migration. Deployed and managed highly available services on AWS.',
  },
];

export const PROJECTS: Project[] = [
    {
        title: 'BankingPortal-API',
        category: 'Backend',
        tech: ['Spring Boot', 'JWT', 'MySQL', 'Angular'],
        tags: ['#API', '#Security', '#FinTech'],
        description: 'Secure REST API with role-based access for modern banking operations, including a full frontend with Angular.',
        link: 'https://github.com/abhi9720/BankingPortal-API',
        liveDemoUrl: '#',
        imageUrl: 'https://placehold.co/1280x720/1e293b/f1f5f9/png?text=Banking+API&font=inter',
    },
     {
        title: 'AI Resume Analyzer',
        category: 'AI',
        tech: ['Python', 'LangChain', 'OpenAI', 'VectorDB'],
        tags: ['#LLM', '#RAG', '#NLP'],
        description: 'A smart tool to analyze resumes, extract key info, and score them against job descriptions using modern AI.',
        link: 'https://github.com/abhi9720/ai-resume-analyzer',
        imageUrl: 'https://placehold.co/1280x720/1e293b/f1f5f9/png?text=AI+Analyzer&font=inter',
    },
    {
        title: 'CoderTab',
        category: 'Frontend',
        tech: ['React', 'Monaco Editor', 'Tailwind CSS'],
        tags: ['#IDE', '#Web-Tools', '#Real-Time'],
        description: 'A web-based IDE for multiple languages with custom themes, code execution, and sharing capabilities.',
        link: 'https://github.com/abhi9720/CoderTab',
        liveDemoUrl: '#',
        imageUrl: 'https://placehold.co/1280x720/1e293b/f1f5f9/png?text=CoderTab&font=inter',
    },
    {
        title: 'Pastebin Clone',
        category: 'Full-Stack',
        tech: ['Go', 'React', 'PostgreSQL', 'Redis'],
        tags: ['#Full-Stack', '#High-Performance', '#Go'],
        description: 'A modern Pastebin alternative with a high-performance Go backend and a clean React frontend.',
        link: 'https://github.com/abhi9720/pastebin-clone-go-react',
        imageUrl: 'https://placehold.co/1280x720/1e293b/f1f5f9/png?text=Pastebin+Clone&font=inter'
    },
    {
        title: 'Postgram',
        category: 'Full-Stack',
        tech: ['React', 'Express.js', 'MongoDB', 'Socket.io'],
        tags: ['#Social-Media', '#Real-Time', '#MERN'],
        description: 'Full-stack social media clone with image uploads, follows, likes, comments, and real-time chat functionality.',
        link: 'https://github.com/abhi9720/Postgram',
        liveDemoUrl: '#',
        imageUrl: 'https://placehold.co/1280x720/1e293b/f1f5f9/png?text=Postgram&font=inter',
    },
    {
        title: 'NotePad PWA',
        category: 'Frontend',
        tech: ['HTML', 'JavaScript', 'IndexedDB', 'PWA'],
        tags: ['#Offline-First', '#Web-APIs', '#Utility'],
        description: 'An offline-first Progressive Web App for notes, to-dos, and image resizing, installable on any device.',
        link: 'https://github.com/abhi9720/NotePad-PWA',
        imageUrl: 'https://placehold.co/1280x720/1e293b/f1f5f9/png?text=NotePad+PWA&font=inter'
    }
];

export const SKILLS: SkillCategory[] = [
    { name: 'Languages', skills: ['Java', 'Golang', 'TypeScript', 'JavaScript (ES6)', 'Python'] },
    { name: 'Frontend', skills: ['React.js', 'Angular 10', 'Tailwind CSS', 'HTML', 'CSS', 'EJS'] },
    { name: 'Backend', skills: ['Spring Boot', 'Hibernate', 'GORM', 'Gin', 'Node.js', 'Express.js'] },
    { name: 'Databases', skills: ['MySQL', 'PostgreSQL', 'Redis', 'MongoDB', 'Oracle SQL'] },
    { name: 'Infrastructure', skills: ['AWS (EC2, RDS, S3, VPC, Lambda)', 'Docker', 'Kubernetes'] },
    { name: 'Messaging', skills: ['Apache Kafka', 'Socket.io'] },
    { name: 'Monitoring', skills: ['Prometheus'] },
    { name: 'Tools & DevOps', skills: ['Git', 'Swagger', 'Postman', 'Maven', 'CI/CD', 'Bash', 'IndexedDB'] },
    { name: 'AI/ML', skills: ['OpenAI API', 'LangChain', 'LLM Integration', 'Vector DBs (RAG)'] },
    { name: 'Other', skills: ['JWT', 'WebSockets', 'System Design', 'Algorithm Optimization'] },
];

export const CURRENT_INTERESTS: string[] = [
    'Golang concurrency patterns',
    'LangChain.js & OpenAI APIs',
    'Kubernetes advanced use cases (Helm, ArgoCD)',
    'System Design + Real-time distributed systems',
    'AI-enhanced developer tools (LLM + Web IDEs)',
];

export const SKILL_CATEGORIES: CategorizedSkillGroup[] = [
    {
        name: 'Technologies & Tooling',
        icon: React.createElement(IconCode, { className: 'h-6 w-6' }),
        skills: ['Java', 'Golang', 'TypeScript', 'JavaScript (ES6)', 'Python', 'React.js', 'Angular 10', 'Spring Boot', 'Node.js', 'Express.js', 'Hibernate', 'GORM', 'Gin', 'Tailwind CSS', 'HTML/CSS', 'Git', 'Maven', 'Postman', 'Bash', 'System Design', 'Algorithm Optimization'],
    },
    {
        name: 'Cloud & DevOps',
        icon: React.createElement(IconCloud, { className: 'h-6 w-6' }),
        skills: ['AWS (EC2, RDS, S3, VPC)', 'Docker', 'Kubernetes', 'CI/CD', 'Prometheus'],
    },
    {
        name: 'Databases',
        icon: React.createElement(IconDatabase, { className: 'h-6 w-6' }),
        skills: ['MySQL', 'PostgreSQL', 'Redis', 'MongoDB', 'Oracle SQL', 'IndexedDB'],
    },
    {
        name: 'APIs & Integration',
        icon: React.createElement(IconApi, { className: 'h-6 w-6' }),
        skills: ['Apache Kafka', 'Socket.io', 'JWT', 'WebSockets', 'Swagger', 'OpenAI API', 'LangChain', 'LLM Integration', 'Vector DBs (RAG)'],
    },
    {
        name: 'Current Interests & Learning',
        icon: React.createElement(IconBrain, { className: 'h-6 w-6' }),
        skills: [...CURRENT_INTERESTS],
    },
];


export const EDUCATION = {
  degree: 'B.Tech in Computer Science & Engineering',
  institution: 'National Institute of Technology, Manipur',
  period: '2019 – 2023',
  cgpa: '8.8 CGPA',
  coursework: ['Algorithms', 'Databases', 'Operating Systems', 'Computer Networks', 'Machine Learning'],
};


export const AI_CONTEXT_DOCUMENT = `
This is a document about Abhishek “Abhi” Tiwari, a Backend-leaning Full-Stack Software Engineer. Use this information to answer questions about him.

### Personal & Contact Information
- **Name**: ${PERSONAL_INFO.name}
- **Title**: ${PERSONAL_INFO.title}
- **Location**: ${PERSONAL_INFO.location}
- **Email**: ${PERSONAL_INFO.email}
- **Phone**: ${PERSONAL_INFO.phone}
- **Resume Link**: ${RESUME_LINK}
- **Summary**: ${PERSONAL_INFO.summary}

### Social Links
${SOCIAL_LINKS.map(link => `- **${link.name}**: ${link.url}`).join('\n')}

### Key Career Highlights
${KEY_HIGHLIGHTS.map(h => `- **${h.metric}**: ${h.description}`).join('\n')}

### Professional Experience
${EXPERIENCES.map(exp => `
- **Role**: ${exp.role}
- **Company**: ${exp.company}
- **Period**: ${exp.period}
- **Location**: ${exp.location}
- **Details**: 
${exp.description.map(d => `  - ${d}`).join('\n')}
`).join('\n')}

### Projects
${PROJECTS.map(p => `
- **Title**: ${p.title}
- **Category**: ${p.category}
- **Technologies**: ${p.tech.join(', ')}
- **Tags**: ${p.tags.join(', ')}
- **Description**: ${p.description}
- **Link**: ${p.link}
`).join('\n')}

### Skills
${SKILLS.map(cat => `
- **${cat.name}**: ${cat.skills.join(', ')}
`).join('\n')}

### Current Interests
${CURRENT_INTERESTS.join(', ')}

### Publications
He actively writes technical articles on Medium and DEV.to. You can find his latest posts in the "Writing" section of the portfolio, which are fetched live from their respective platforms.

### Education
- **Degree**: ${EDUCATION.degree}
- **Institution**: ${EDUCATION.institution}
- **Period**: ${EDUCATION.period}
- **CGPA**: ${EDUCATION.cgpa}
- **Coursework**: ${EDUCATION.coursework.join(', ')}
`;