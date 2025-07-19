import React from 'react';

export interface Link {
  name: string;
  url: string;
  icon: React.ReactNode;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string[];
  summary: string;
}

export interface Project {
  title: string;
  category: 'Backend' | 'Frontend' | 'AI' | 'Full-Stack';
  tech: string[];
  tags: string[];
  description: string;
  link: string;
  liveDemoUrl?: string;
  imageUrl: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface CategorizedSkillGroup {
  name: string;
  icon: React.ReactNode;
  skills: string[];
}

export interface Article {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  platform: 'Medium' | 'DEV.to';
  thumbnail: string;
}

export interface KeyHighlight {
  metric: string;
  description: string;
  icon: React.ReactNode;
}

export interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
}