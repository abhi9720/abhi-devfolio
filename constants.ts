import React from 'react';
import { Experience, Project, SkillCategory, Link, KeyHighlight, CategorizedSkillGroup, Certification, TechRadarData, TechRadarEntry
} from './types';
import { FaDev, FaGithub, FaLinkedin, FaMedium
} from 'react-icons/fa';
import { HiOutlineDocumentText, HiOutlineMail
} from 'react-icons/hi';
import { FiCloud, FiCode, FiDatabase, FiGlobe
} from 'react-icons/fi';
import { SiLeetcode
} from 'react-icons/si';
import { RiBrainLine
} from 'react-icons/ri';
import { BsFillDiagram3Fill
} from 'react-icons/bs';


export const PERSONAL_INFO = {
  "name": "Abhishek Tiwari",
  "nickname": "abhi9720",
  "title": "Backend-leaning Full-Stack Software Engineer",
  "location": "Bangalore / Gwalior, India",
  "email": "abhishek.nitmn@gmail.com",
  "phone": "+91-9720409597",
  "photoUrl": "https://avatars.githubusercontent.com/u/68281476?v=4",
  "summary": "Backend-leaning full-stack Software Engineer with strong foundations in Golang, Java, Spring Boot, Distributed Systems, and Cloud Architecture. Proven experience handling high-load systems (100K+ req/day), real-time pipelines, and LLM-based applications. Fast adopter of emerging technologies like vector search, RAG, and Kubernetes-based microservices."
};

export const RESUME_LINK = 'https: //drive.google.com/file/d/1UWDYhLGwUqb5UhvK9uq5nN1GkCFxF3FQ/preview';

export const SOCIAL_LINKS: Link[] = [
  {
    "name": "GitHub",
    "url": "https://github.com/abhi9720",
    "icon": React.createElement(FaGithub)
  },
  {
    "name": "LinkedIn",
    "url": "https://linkedin.com/in/abhi9720",
    "icon": React.createElement(FaLinkedin)
  },
  {
    "name": "Email",
    "url": "mailto:abhishek.nitmn@gmail.com",
    "icon": React.createElement(HiOutlineMail)
  },
  {
    "name": "Portfolio",
    "url": "https://abhi9720-dev.netlify.app",
    "icon": React.createElement(FiGlobe)
  },
  {
    "name": "Notes & Blog",
    "url": "https://abhisheks-notes.super.site",
    "icon": React.createElement(HiOutlineDocumentText)
  },
  {
    "name": "LeetCode",
    "url": "https://leetcode.com/abhi9720",
    "icon": React.createElement(SiLeetcode)
  },
  {
    "name": "DEV.to",
    "url": "https://dev.to/abhi9720",
    "icon": React.createElement(FaDev)
  },
  {
    "name": "Medium",
    "url": "https://medium.com/@Abhishektiwari",
    "icon": React.createElement(FaMedium)
  }
];

export const KEY_HIGHLIGHTS: KeyHighlight[] = [
  {
    "metric": "100K+ req/day",
    "description": "Built scalable REST APIs using Spring Boot, optimized with Redis and connection pooling to reduce response time by 35% and improve SLA adherence",
    "icon": React.createElement(FiCode)
  },
  {
    "metric": "20K+ QPS with <100ms latency",
    "description": "Developed a tenant-aware Global Search API using Elasticsearch and Kafka (via Debezium CDC) to enable real-time, full-text LMS search.",
    "icon": React.createElement(RiBrainLine)
  },
  {
    "metric": "99.9% task success rate",
    "description": "Designed a fault-tolerant distributed task system in Go using Asynq, Redis, and Kubernetes with Prometheus-based monitoring and DLQ support",
    "icon": React.createElement(BsFillDiagram3Fill)
  }
];

export const EXPERIENCES: Experience[] = [
  {
    "role": "Software Development Engineer",
    "company": "PeopleStrong",
    "period": "Apr 2024 – Present",
    "location": "Bangalore, India",
    "description": [
      "Delivered high-traffic REST APIs via Spring Boot microservice handling 100K+ API requests/day, reducing response time by 35% using Redis caching and connection pooling, improving SLA adherence.",
      "Engineered a gamification engine in Go, Redis, and Kafka, processing over 10,000 events per minute to track engagement metrics (course completion, skill achievements), driving user motivation via points, badges, certificates.",
      "Built a scalable Role-Based Access Control (RBAC) system using Strategy, Factory, and Proxy design patterns; enforced permissions via AOP and Spring Security to ensure secure, scalable access control across the LMS.",
      "Engineered a real-time ILT Attendance System handling 50K+ daily API hits, ensuring consistent performance during peak training hours through asynchronous processing and optimized database queries.",
      "Developed a scalable, tenant-aware Global Search API using Spring Boot, Elasticsearch, enabling real-time, full-text search across courses, wikis, certificates, and catalogs with 20K+ QPS and < 100ms latency.",
      "Integrated real-time data synchronization from MySQL to Elasticsearch using Debezium and Kafka for Change Data Capture (CDC), enabling consistent, low-latency indexing with row-based tenant isolation across all entities.",
      "Architected a Course Rating & Review System using Spring Boot, MySQL, and Redis, leveraging write-through caching and lazy cache population to deliver 3× faster read performance and enable consistent, scalable feedback tracking across high-traffic catalogs — contributing to a 28% increase in enrollments."
    ],
    "summary": "Delivered high-throughput microservices in Spring Boot and Go, powering 100K+ daily requests and 20K+ QPS real-time search with <100ms latency using Redis, Kafka, and Elasticsearch.\nBuilt gamification, ILT attendance, RBAC, and feedback systems using design patterns, AOP, and CDC (Debezium + Kafka), enhancing engagement, access control, and SLA adherence.\nAchieved 35% latency reduction, 3× faster reads, and 28% boost in course enrollments through caching strategies, async processing, and optimized multi-tenant architecture."
  },
  {
    "role": "Associate Software Engineer",
    "company": "Imperva",
    "period": "Nov 2023 – Mar 2024",
    "location": "Bangalore, India",
    "description": [
      "Designed a scalable distributed task execution system using Go, Redis, and Asynq to process background tasks asynchronously with automatic retries, a Dead-Letter Queue (DLQ), and fault tolerance.",
      "Developed a worker pool system orchestrated with Kubernetes, enabling horizontal scaling of workers to efficiently handle high-volume tasks while maintaining 99.9% task success rate and minimizing failures.",
      "Integrated Prometheus to monitor task metrics (success, failure, retries, latency), enabling real-time alerting and proactive issue resolution, improving system observability and incident response time."
    ],
    "summary": "Developed a resilient, distributed async task system in Go with Redis and Asynq, deployed on Kubernetes. Achieved 99.9% reliability with integrated monitoring via Prometheus and DLQ handling."
  },
  {
    "role": "Software Engineer Intern",
    "company": "Nagarro",
    "period": "Mar 2023 – Nov 2023",
    "location": "Noida, India",
    "description": [
      "Developed performant REST APIs using Spring Boot and Hibernate; implemented second-level caching to reduce average response time by 25% under peak load.",
      "Optimized 50+ Oracle queries by rewriting them into T-SQL for SQL Server, eliminating Cartesian joins, and creating stored procedures and triggers, leading to a 30% improvement in query performance.",
      "Deployed microservice on AWS, utilizing EC2 for scalable computing, RDS for managed databases, S3 bucket for storage, and VPC for secure networking, ensuring high availability and resilience."
    ],
    "summary": "Boosted Spring Boot API performance by 25% via Hibernate caching and optimized database workloads by 30% through SQL migration. Deployed and managed highly available services on AWS."
  }
];

export const PROJECTS: Project[] = [
  {
    "title": "BankingPortal ",
    "category": "Backend",
    "tech": [
      "Spring Boot",
      "JWT",
      "MySQL",
      "Angular"
    ],
    "tags": [
      "#API",
      "#Security",
      "#FinTech"
    ],
    "description": "Secure REST API with role-based access for modern banking operations, including a full frontend with Angular.",
    "link": "https://github.com/abhi9720/BankingPortal-API",
    "liveDemoUrl": "#",
    "imageUrl": "https://repository-images.githubusercontent.com/669542190/53e01f5c-4266-4b89-ad00-5f5e66327aaa"
  },
  {
    "title": "CoderTab",
    "category": "Frontend",
    "tech": [
      "React",
      "Monaco Editor",
      "Tailwind CSS"
    ],
    "tags": [
      "#IDE",
      "#Web-Tools",
      "#Real-Time"
    ],
    "description": "A web-based IDE for multiple languages with custom themes, code execution, and sharing capabilities.",
    "link": "https://github.com/abhi9720/CoderTab",
    "liveDemoUrl": "https://codertab.netlify.app",
    "imageUrl": "https://placehold.co/1280x720/1e293b/f1f5f9/png?text=CoderTab&font=inter"
  },
  {
    "title": "Pastebin",
    "category": "Full-Stack",
    "tech": [
      "Go",
      "React",
      "PostgreSQL",
      "Redis"
    ],
    "tags": [
      "#Full-Stack",
      "#High-Performance",
      "#Go"
    ],
    "description": "A modern Pastebin alternative with a high-performance Go backend and a clean React frontend.",
    "link": "https://github.com/abhi9720/pastebin-clone-go-react",
    "imageUrl": "https://placehold.co/1280x720/1e293b/f1f5f9/png?text=Pastebin&font=inter",
    "liveDemoUrl": "http://pasteebin.netlify.app"
  },
  {
    "title": "Postgram",
    "category": "Full-Stack",
    "tech": [
      "React",
      "Express.js",
      "MongoDB",
      "Socket.io"
    ],
    "tags": [
      "#Social-Media",
      "#Real-Time",
      "#MERN"
    ],
    "description": "Full-stack social media clone with image uploads, follows, likes, comments, and real-time chat functionality.",
    "link": "https://github.com/abhi9720/Postgram",
    "liveDemoUrl": "http://postgram-social.netlify.app",
    "imageUrl": "https://abhi-9720.github.io/img/Postframimg/homepostgram.png"
  },
  {
    "title": "DSA Task Manager",
    "category": "Full-Stack",
    "tech": [
      "Node.js",
      "MongoDB",
      "Cloudinary",
      "Passport-Google-Auth",
      "EJS"
    ],
    "tags": [
      "#Full-Stack",
      "#Productivity",
      "#Node.js"
    ],
    "description": "A productivity web app to track DSA problem-solving progress. Features include adding questions, daily revision prompts, a random picker, and Google OAuth.",
    "link": "https://github.com/abhi9720/DSA-TASK-MANAGER",
    "imageUrl": "https://abhi-9720.github.io/img/dtm/login.png"
  },
  {
    "title": "NotePad PWA",
    "category": "Frontend",
    "tech": [
      "HTML",
      "JavaScript",
      "IndexedDB",
      "PWA"
    ],
    "tags": [
      "#Offline-First",
      "#Web-APIs",
      "#Utility"
    ],
    "description": "An offline-first Progressive Web App for notes, to-dos, and image resizing, installable on any device.",
    "link": "https://github.com/abhi9720/NotePad-PWA",
    "imageUrl": "https://placehold.co/1280x720/1e293b/f1f5f9/png?text=NotePad+PWA&font=inter",
    "liveDemoUrl": "#"
  },
  {
    "title": "DevConnector",
    "category": "Full-Stack",
    "tech": [
      "Nodejs",
      "Mongodb",
      "Reactjs",
      "Redux",
      "Material-UI"
    ],
    "tags": [],
    "description": "Dev Connector is Providing a Platform where developer can ask their doubts, and discuss with other community member .\nAlong with that developer can also maintain their awesome profile with experience, education and github projects",
    "link": "https://github.com/abhi9720/devconnector-backend",
    "imageUrl": "https://abhi-9720.github.io/img/dev/discuss.png",
    "liveDemoUrl": "https://querydiscuser.netlify.app/"
  }
];

export const SKILLS: SkillCategory[] = [
  {
    "name": "Languages",
    "skills": [
      "Java",
      "Golang",
      "TypeScript",
      "JavaScript (ES6)",
      "Python"
    ]
  },
  {
    "name": "Frontend",
    "skills": [
      "React.js",
      "Angular 10",
      "Tailwind CSS",
      "HTML",
      "CSS",
      "EJS"
    ]
  },
  {
    "name": "Backend",
    "skills": [
      "Spring Boot",
      "Hibernate",
      "GORM",
      "Gin",
      "Node.js",
      "Express.js"
    ]
  },
  {
    "name": "Databases",
    "skills": [
      "MySQL",
      "PostgreSQL",
      "Redis",
      "MongoDB",
      "Oracle SQL"
    ]
  },
  {
    "name": "Infrastructure",
    "skills": [
      "AWS (EC2, RDS, S3, VPC, Lambda)",
      "Docker",
      "Kubernetes"
    ]
  },
  {
    "name": "Messaging",
    "skills": [
      "Apache Kafka",
      "Socket.io"
    ]
  },
  {
    "name": "Monitoring",
    "skills": [
      "Prometheus"
    ]
  },
  {
    "name": "Tools & DevOps",
    "skills": [
      "Git",
      "Swagger",
      "Postman",
      "Maven",
      "CI/CD",
      "Bash",
      "IndexedDB"
    ]
  },
  {
    "name": "AI/ML",
    "skills": [
      "OpenAI API",
      "LangChain",
      "LLM Integration",
      "Vector DBs (RAG)"
    ]
  },
  {
    "name": "Other",
    "skills": [
      "JWT",
      "WebSockets",
      "System Design",
      "Algorithm Optimization"
    ]
  }
];

export const CURRENT_INTERESTS: string[] = [
  "Golang concurrency patterns",
  "LangChain.js & OpenAI APIs",
  "Kubernetes advanced use cases (Helm, ArgoCD)",
  "System Design + Real-time distributed systems",
  "AI-enhanced developer tools (LLM + Web IDEs)"
];

export const SKILL_CATEGORIES: CategorizedSkillGroup[] = [
  {
    "name": "Technologies & Tooling",
    "icon": React.createElement(FiCode),
    "skills": [
      "Java",
      "Golang",
      "TypeScript",
      "JavaScript (ES6)",
      "Python",
      "React.js",
      "Angular 10",
      "Spring Boot",
      "Node.js",
      "Express.js",
      "Hibernate",
      "GORM",
      "Gin",
      "Tailwind CSS",
      "HTML/CSS",
      "Git",
      "Maven",
      "Postman",
      "Bash",
      "System Design",
      "Algorithm Optimization"
    ]
  },
  {
    "name": "Cloud & DevOps",
    "icon": React.createElement(FiCloud),
    "skills": [
      "AWS (EC2, RDS, S3, VPC)",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Prometheus"
    ]
  },
  {
    "name": "Databases",
    "icon": React.createElement(FiDatabase),
    "skills": [
      "MySQL",
      "PostgreSQL",
      "Redis",
      "MongoDB",
      "Oracle SQL",
      "IndexedDB"
    ]
  },
  {
    "name": "APIs & Integration",
    "icon": React.createElement(BsFillDiagram3Fill),
    "skills": [
      "Apache Kafka",
      "Socket.io",
      "JWT",
      "WebSockets",
      "Swagger",
      "OpenAI API",
      "LangChain",
      "LLM Integration",
      "Vector DBs (RAG)"
    ]
  },
  {
    "name": "Current Interests & Learning",
    "icon": React.createElement(RiBrainLine),
    "skills": [
      "Golang concurrency patterns",
      "LangChain.js & OpenAI APIs",
      "Kubernetes advanced use cases (Helm, ArgoCD)",
      "System Design + Real-time distributed systems",
      "AI-enhanced developer tools (LLM + Web IDEs)"
    ]
  }
];

export const TECH_RADAR_DATA: TechRadarData = {
  "techniques": [
    {
      "name": "CI/CD",
      "quadrant": "techniques",
      "ring": "adopt",
      "description": "Automating the build, test, and deployment pipeline for faster releases."
    },
    {
      "name": "System Design",
      "quadrant": "techniques",
      "ring": "trial",
      "description": "Architecting scalable and resilient systems for high-load scenarios."
    },
    {
      "name": "Vector DBs (RAG)",
      "quadrant": "techniques",
      "ring": "trial",
      "description": "Enhancing LLMs with external knowledge bases for more accurate, context-aware responses using Retrieval-Augmented Generation."
    }
  ],
  "tools": [
    {
      "name": "Docker",
      "quadrant": "tools",
      "ring": "adopt",
      "description": "The de-facto standard for containerizing applications."
    },
    {
      "name": "Git",
      "quadrant": "tools",
      "ring": "adopt",
      "description": "Essential for version control and collaborative development."
    },
    {
      "name": "Postman",
      "quadrant": "tools",
      "ring": "adopt",
      "description": "My go-to tool for API development, testing, and documentation."
    },
    {
      "name": "Kubernetes",
      "quadrant": "tools",
      "ring": "trial",
      "description": "Orchestrating containerized applications at scale. Gaining production experience."
    },
    {
      "name": "Prometheus",
      "quadrant": "tools",
      "ring": "trial",
      "description": "For monitoring and alerting in cloud-native environments."
    },
    {
      "name": "LangChain",
      "quadrant": "tools",
      "ring": "trial",
      "description": "A framework for developing applications powered by language models."
    }
  ],
  "platforms": [
    {
      "name": "AWS (EC2, RDS, S3, VPC)",
      "quadrant": "platforms",
      "ring": "adopt",
      "description": "Core AWS services for compute, storage, database management, and networking."
    },
    {
      "name": "Apache Kafka",
      "quadrant": "platforms",
      "ring": "adopt",
      "description": "A distributed event streaming platform for high-throughput data pipelines."
    },
    {
      "name": "Redis",
      "quadrant": "platforms",
      "ring": "adopt",
      "description": "High-performance in-memory data store used for caching and message brokering."
    }
  ],
  "languagesAndFrameworks": [
    {
      "name": "Golang",
      "quadrant": "languagesAndFrameworks",
      "ring": "adopt",
      "description": "My primary language for high-performance, concurrent backend services."
    },
    {
      "name": "Java",
      "quadrant": "languagesAndFrameworks",
      "ring": "adopt",
      "description": "A robust, object-oriented language used for building enterprise-grade applications with Spring Boot."
    },
    {
      "name": "Spring Boot",
      "quadrant": "languagesAndFrameworks",
      "ring": "adopt",
      "description": "A powerful framework for creating stand-alone, production-grade Spring based Applications that I use with Java."
    },
    {
      "name": "React.js",
      "quadrant": "languagesAndFrameworks",
      "ring": "adopt",
      "description": "The go-to library for building modern, interactive user interfaces."
    },
    {
      "name": "Tailwind CSS",
      "quadrant": "languagesAndFrameworks",
      "ring": "adopt",
      "description": "A utility-first CSS framework that dramatically speeds up UI development."
    },
    {
      "name": "Node.js",
      "quadrant": "languagesAndFrameworks",
      "ring": "trial",
      "description": "JavaScript runtime for building fast and scalable network applications."
    },
    {
      "name": "Express.js",
      "quadrant": "languagesAndFrameworks",
      "ring": "trial",
      "description": "Minimalist web framework for Node.js, used in several projects for its speed in building APIs."
    },
    {
      "name": "Python",
      "quadrant": "languagesAndFrameworks",
      "ring": "assess",
      "description": "Primarily used for scripting and exploring AI/ML libraries."
    },
    {
      "name": "Angular 10",
      "quadrant": "languagesAndFrameworks",
      "ring": "hold",
      "description": "Have past experience, but currently focusing on React.js for frontend development."
    }
  ]
};

export const EXAMPLE_PROMPTS: string[] = [
  "Summarize resume.",
  "What are your strongest backend skills?",
  "Tell me about the 'Banking Portal' project."
];

export const EDUCATION = {
  "degree": "B.Tech in Computer Science & Engineering",
  "institution": "National Institute of Technology, Manipur",
  "period": "2019 – 2023",
  "cgpa": "8.8 CGPA",
  "coursework": [
    "Algorithms",
    "Databases",
    "Operating Systems",
    "Computer Networks",
    "Machine Learning"
  ]
};

export const CERTIFICATIONS: Certification[] = [
  {
    "name": "Go Design Patterns – Issued Dec 2023",
    "link": "https://www.linkedin.com/in/abhi9720/details/certifications/?entityUrn=urn%3Ali%3Acertification%3A[credential-id-1]"
  },
  {
    "name": "Go Essentials: Concurrency, Connectivity, and High‑Performance Apps – Issued Nov 2023",
    "link": "https://www.linkedin.com/in/abhi9720/details/certifications/?entityUrn=urn%3Ali%3Acertification%3A[credential-id-2]"
  }
];

export const AI_CONTEXT_DOCUMENT = `
This is a document about Abhishek “Abhi” Tiwari, a Backend-leaning Full-Stack Software Engineer. Use this information to answer questions about him.

### Personal & Contact Information
- **Name**: Abhishek Tiwari
- **Title**: Backend-leaning Full-Stack Software Engineer
- **Location**: Bangalore / Gwalior, India
- **Email**: abhishek.nitmn@gmail.com
- **Phone**: +91-9720409597
- **Resume Link**: https: //drive.google.com/file/d/1UWDYhLGwUqb5UhvK9uq5nN1GkCFxF3FQ/preview
- **Summary**: Backend-leaning full-stack Software Engineer with strong foundations in Golang, Java, Spring Boot, Distributed Systems, and Cloud Architecture. Proven experience handling high-load systems (100K+ req/day), real-time pipelines, and LLM-based applications. Fast adopter of emerging technologies like vector search, RAG, and Kubernetes-based microservices.

### Social Links
- **GitHub**: https: //github.com/abhi9720
- **LinkedIn**: https: //linkedin.com/in/abhi9720
- **Email**: mailto:abhishek.nitmn@gmail.com
- **Portfolio**: https: //abhi9720-dev.netlify.app
- **Notes & Blog**: https: //abhisheks-notes.super.site
- **LeetCode**: https: //leetcode.com/abhi9720
- **DEV.to**: https: //dev.to/abhi9720
- **Medium**: https: //medium.com/@Abhishektiwari

### Key Career Highlights
- **100K+ req/day**: Built scalable REST APIs using Spring Boot, optimized with Redis and connection pooling to reduce response time by 35% and improve SLA adherence
- **20K+ QPS with <100ms latency**: Developed a tenant-aware Global Search API using Elasticsearch and Kafka (via Debezium CDC) to enable real-time, full-text LMS search.
- **99.9% task success rate**: Designed a fault-tolerant distributed task system in Go using Asynq, Redis, and Kubernetes with Prometheus-based monitoring and DLQ support

### Professional Experience

- **Role**: Software Development Engineer
- **Company**: PeopleStrong
- **Period**: Apr 2024 – Present
- **Location**: Bangalore, India
- **Details**: 
  - Delivered high-traffic REST APIs via Spring Boot microservice handling 100K+ API requests/day, reducing response time by 35% using Redis caching and connection pooling, improving SLA adherence.
  - Engineered a gamification engine in Go, Redis, and Kafka, processing over 10,
000 events per minute to track engagement metrics (course completion, skill achievements), driving user motivation via points, badges, certificates.
  - Built a scalable Role-Based Access Control (RBAC) system using Strategy, Factory, and Proxy design patterns; enforced permissions via AOP and Spring Security to ensure secure, scalable access control across the LMS.
  - Engineered a real-time ILT Attendance System handling 50K+ daily API hits, ensuring consistent performance during peak training hours through asynchronous processing and optimized database queries.
  - Developed a scalable, tenant-aware Global Search API using Spring Boot, Elasticsearch, enabling real-time, full-text search across courses, wikis, certificates, and catalogs with 20K+ QPS and < 100ms latency.
  - Integrated real-time data synchronization from MySQL to Elasticsearch using Debezium and Kafka for Change Data Capture (CDC), enabling consistent, low-latency indexing with row-based tenant isolation across all entities.
  - Architected a Course Rating & Review System using Spring Boot, MySQL, and Redis, leveraging write-through caching and lazy cache population to deliver 3× faster read performance and enable consistent, scalable feedback tracking across high-traffic catalogs — contributing to a 28% increase in enrollments.


- **Role**: Associate Software Engineer
- **Company**: Imperva
- **Period**: Nov 2023 – Mar 2024
- **Location**: Bangalore, India
- **Details**: 
  - Designed a scalable distributed task execution system using Go, Redis, and Asynq to process background tasks asynchronously with automatic retries, a Dead-Letter Queue (DLQ), and fault tolerance.
  - Developed a worker pool system orchestrated with Kubernetes, enabling horizontal scaling of workers to efficiently handle high-volume tasks while maintaining 99.9% task success rate and minimizing failures.
  - Integrated Prometheus to monitor task metrics (success, failure, retries, latency), enabling real-time alerting and proactive issue resolution, improving system observability and incident response time.


- **Role**: Software Engineer Intern
- **Company**: Nagarro
- **Period**: Mar 2023 – Nov 2023
- **Location**: Noida, India
- **Details**: 
  - Developed performant REST APIs using Spring Boot and Hibernate; implemented second-level caching to reduce average response time by 25% under peak load.
  - Optimized 50+ Oracle queries by rewriting them into T-SQL for SQL Server, eliminating Cartesian joins, and creating stored procedures and triggers, leading to a 30% improvement in query performance.
  - Deployed microservice on AWS, utilizing EC2 for scalable computing, RDS for managed databases, S3 bucket for storage, and VPC for secure networking, ensuring high availability and resilience.


### Projects

- **Title**: BankingPortal 
- **Category**: Backend
- **Technologies**: Spring Boot, JWT, MySQL, Angular
- **Tags**: #API, #Security, #FinTech
- **Description**: Secure REST API with role-based access for modern banking operations, including a full frontend with Angular.
- **Link**: https: //github.com/abhi9720/BankingPortal-API


- **Title**: CoderTab
- **Category**: Frontend
- **Technologies**: React, Monaco Editor, Tailwind CSS
- **Tags**: #IDE, #Web-Tools, #Real-Time
- **Description**: A web-based IDE for multiple languages with custom themes, code execution, and sharing capabilities.
- **Link**: https: //github.com/abhi9720/CoderTab


- **Title**: Pastebin
- **Category**: Full-Stack
- **Technologies**: Go, React, PostgreSQL, Redis
- **Tags**: #Full-Stack, #High-Performance, #Go
- **Description**: A modern Pastebin alternative with a high-performance Go backend and a clean React frontend.
- **Link**: https: //github.com/abhi9720/pastebin-clone-go-react


- **Title**: Postgram
- **Category**: Full-Stack
- **Technologies**: React, Express.js, MongoDB, Socket.io
- **Tags**: #Social-Media, #Real-Time, #MERN
- **Description**: Full-stack social media clone with image uploads, follows, likes, comments, and real-time chat functionality.
- **Link**: https: //github.com/abhi9720/Postgram


- **Title**: DSA Task Manager
- **Category**: Full-Stack
- **Technologies**: Node.js, MongoDB, Cloudinary, Passport-Google-Auth, EJS
- **Tags**: #Full-Stack, #Productivity, #Node.js
- **Description**: A productivity web app to track DSA problem-solving progress. Features include adding questions, daily revision prompts, a random picker, and Google OAuth.
- **Link**: https: //github.com/abhi9720/DSA-TASK-MANAGER


- **Title**: NotePad PWA
- **Category**: Frontend
- **Technologies**: HTML, JavaScript, IndexedDB, PWA
- **Tags**: #Offline-First, #Web-APIs, #Utility
- **Description**: An offline-first Progressive Web App for notes, to-dos, and image resizing, installable on any device.
- **Link**: https: //github.com/abhi9720/NotePad-PWA


- **Title**: DevConnector
- **Category**: Full-Stack
- **Technologies**: Nodejs, Mongodb, Reactjs, Redux, Material-UI
- **Tags**: 
- **Description**: Dev Connector is Providing a Platform where developer can ask their doubts, and discuss with other community member .
Along with that developer can also maintain their awesome profile with experience, education and github projects
- **Link**: https: //github.com/abhi9720/devconnector-backend


### Skills

- **Languages**: Java, Golang, TypeScript, JavaScript (ES6), Python


- **Frontend**: React.js, Angular 10, Tailwind CSS, HTML, CSS, EJS


- **Backend**: Spring Boot, Hibernate, GORM, Gin, Node.js, Express.js


- **Databases**: MySQL, PostgreSQL, Redis, MongoDB, Oracle SQL


- **Infrastructure**: AWS (EC2, RDS, S3, VPC, Lambda), Docker, Kubernetes


- **Messaging**: Apache Kafka, Socket.io


- **Monitoring**: Prometheus


- **Tools & DevOps**: Git, Swagger, Postman, Maven, CI/CD, Bash, IndexedDB


- **AI/ML**: OpenAI API, LangChain, LLM Integration, Vector DBs (RAG)


- **Other**: JWT, WebSockets, System Design, Algorithm Optimization


### Tech Radar
My tech radar represents my current view on different technologies.
- **Adopt**: Technologies I have high confidence in and use for production builds.
- **Trial**: Technologies I have used in projects and am becoming proficient with.
- **Assess**: Technologies I am currently learning or exploring for future projects.
- **Hold**: Technologies I have experience with but am not actively using in new projects.

#### Techniques\n- CI/CD (adopt): Automating the build, test, and deployment pipeline for faster releases.\n- System Design (trial): Architecting scalable and resilient systems for high-load scenarios.\n- Vector DBs (RAG) (trial): Enhancing LLMs with external knowledge bases for more accurate, context-aware responses using Retrieval-Augmented Generation.\n\n#### Tools\n- Docker (adopt): The de-facto standard for containerizing applications.\n- Git (adopt): Essential for version control and collaborative development.\n- Postman (adopt): My go-to tool for API development, testing, and documentation.\n- Kubernetes (trial): Orchestrating containerized applications at scale. Gaining production experience.\n- Prometheus (trial): For monitoring and alerting in cloud-native environments.\n- LangChain (trial): A framework for developing applications powered by language models.\n\n#### Platforms\n- AWS (EC2, RDS, S3, VPC) (adopt): Core AWS services for compute, storage, database management, and networking.\n- Apache Kafka (adopt): A distributed event streaming platform for high-throughput data pipelines.\n- Redis (adopt): High-performance in-memory data store used for caching and message brokering.\n\n#### Languages And Frameworks\n- Golang (adopt): My primary language for high-performance, concurrent backend services.\n- Java (adopt): A robust, object-oriented language used for building enterprise-grade applications with Spring Boot.\n- Spring Boot (adopt): A powerful framework for creating stand-alone, production-grade Spring based Applications that I use with Java.\n- React.js (adopt): The go-to library for building modern, interactive user interfaces.\n- Tailwind CSS (adopt): A utility-first CSS framework that dramatically speeds up UI development.\n- Node.js (trial): JavaScript runtime for building fast and scalable network applications.\n- Express.js (trial): Minimalist web framework for Node.js, used in several projects for its speed in building APIs.\n- Python (assess): Primarily used for scripting and exploring AI/ML libraries.\n- Angular 10 (hold): Have past experience, but currently focusing on React.js for frontend development.

### Certifications
- **Go Design Patterns – Issued Dec 2023**: View at https: //www.linkedin.com/learning/certificates/a2a68ce48c6bfcb1d026d6520489947e5090d40bef43a5f236273a283732aaba
- **Go Essentials: Concurrency, Connectivity, and High‑Performance Apps – Issued Nov 2023**: View at https: //www.linkedin.com/learning/certificates/197ad5e18a4689e92958c06011c00ddbb71e3de21b731b277864fb637696791f

### Current Interests
Golang concurrency patterns, LangChain.js & OpenAI APIs, Kubernetes advanced use cases (Helm, ArgoCD), System Design + Real-time distributed systems, AI-enhanced developer tools (LLM + Web IDEs)

### Publications
He actively writes technical articles on Medium and DEV.to. You can find his latest posts in the "Writing" section of the portfolio, which are fetched live from their respective platforms.

### Education
- **Degree**: B.Tech in Computer Science & Engineering
- **Institution**: National Institute of Technology, Manipur
- **Period**: 2019 – 2023
- **CGPA**: 8.8 CGPA
- **Coursework**: Algorithms, Databases, Operating Systems, Computer Networks, Machine Learning
`;