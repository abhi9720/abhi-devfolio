import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { IconSun } from './icons/IconSun';
import { IconMoon } from './icons/IconMoon';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-cyan-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-300"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <IconMoon className="h-5 w-5" /> : <IconSun className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggle;
