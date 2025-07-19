import React, { useEffect } from 'react';
import { IconDownload } from './icons/IconDownload';
import { IconX } from './icons/IconX';
import { RESUME_LINK } from '../constants';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300"
      style={{ animation: 'fade-in 0.3s ease-out' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
    >
      <div
        className="bg-slate-50 dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col p-4 md:p-6 border border-slate-200 dark:border-slate-700 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 id="resume-modal-title" className="text-xl font-bold text-slate-900 dark:text-slate-200">Resume Preview</h2>
          <div className="flex items-center gap-4">
            <a
              href={RESUME_LINK}
              download="Abhishek_Tiwari_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 transition-colors duration-300"
            >
              <IconDownload className="h-4 w-4" />
              Download
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
              aria-label="Close"
            >
              <IconX className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="flex-grow bg-slate-200 dark:bg-slate-900 rounded-md overflow-hidden border border-slate-300 dark:border-slate-700">
          <iframe
            src={RESUME_LINK}
            title="Resume Preview"
            className="w-full h-full border-0"
          >
            <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                <p>Your browser does not support PDFs. <a href={RESUME_LINK} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400 underline">Download it here</a>.</p>
            </div>
          </iframe>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;