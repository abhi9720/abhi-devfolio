import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { FiUser, FiMail, FiMessageSquare, FiSend, FiAlertTriangle } from 'react-icons/fi';
import { ImSpinner2 } from 'react-icons/im';

// Use environment variables for configuration.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const GEMINI_MODEL = process.env.GEMINI_CHAT_MODEL || 'gemini-2.5-flash';
const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT;


const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <div className="sticky top-0 z-10 py-4 mb-4 bg-slate-50/75 dark:bg-slate-900/75 backdrop-blur lg:hidden">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200">{title}</h2>
    </div>
);

const ContactForm: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    // Check if the endpoint is configured and not a placeholder
    const isFormConfigured = !!FORMSPREE_ENDPOINT;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormConfigured) {
            setStatus('error');
            setFeedbackMessage('This contact form is not configured. Please contact the site administrator.');
            return;
        }

        if (!formData.name || !formData.email || !formData.message) {
            setStatus('error');
            setFeedbackMessage('Please fill out all fields.');
            return;
        }

        setStatus('loading');
        setFeedbackMessage('');

        try {
            // Step 1: Categorize the message with AI
            const schema = {
                type: Type.OBJECT,
                properties: { category: { type: Type.STRING, enum: ["Job Opportunity", "Collaboration Request", "Feedback", "General Question", "Other"] } },
                required: ['category']
            };
            const prompt = `Categorize the following inquiry. Message: "${formData.message}"`;
            const aiResponse = await ai.models.generateContent({
                model: GEMINI_MODEL,
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: schema },
            });

            let category = "General Question";
            try {
                const jsonResponse = JSON.parse(aiResponse.text);
                if (jsonResponse.category) {
                    category = jsonResponse.category;
                }
            } catch (parseError) {
                console.warn("Could not parse AI response, using fallback category.", parseError);
            }

            // Step 2: Prepare data and submit to the form backend
            const subject = `[Portfolio Contact] New ${category} from ${formData.name}`;
            const submissionData = {
                ...formData,
                _subject: subject,
                "AI Category": category,
            };

            const formResponse = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify(submissionData),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (formResponse.ok) {
                setStatus('success');
                setFeedbackMessage('Thank you! Your message has been sent successfully.');
                setFormData({ name: '', email: '', message: '' }); // Clear form on success
            } else {
                throw new Error('Form submission failed.');
            }

        } catch (error) {
            console.error('Contact form error:', error);
            setStatus('error');
            setFeedbackMessage('Sorry, there was an error sending your message. Please try again later.');
        }
    };

    const isSubmittable = formData.name && formData.email && formData.message;

    return (
        <section id="contact" className="scroll-mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <h2 className="sticky top-0 hidden lg:block py-4 text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-slate-900 to-blue-500 dark:from-slate-200 dark:to-blue-500 text-transparent bg-clip-text">Contact</h2>
                </div>
                <div className="lg:col-span-3">
                    <SectionHeader title="Contact" />
                    <div className="bg-white dark:bg-slate-800/50 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-lg">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Get In Touch</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Have a question or want to work together? Fill out the form below. My AI assistant will categorize your message and I'll get back to you soon.
                        </p>

                        {!isFormConfigured && (
                            <div className="mb-6 flex items-center gap-3 p-3 rounded-lg bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-500/30">
                                <FiAlertTriangle className="h-5 w-5 flex-shrink-0" />
                                <span className="text-sm font-medium">This contact form is currently not configured by the site owner.</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <fieldset disabled={!isFormConfigured}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <label htmlFor="name" className="sr-only">Name</label>
                                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                                        <input type="text" name="name" id="name" placeholder="Your Name" required value={formData.name} onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-60" />
                                    </div>
                                    <div className="relative">
                                        <label htmlFor="email" className="sr-only">Email</label>
                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                                        <input type="email" name="email" id="email" placeholder="Your Email" required value={formData.email} onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-60" />
                                    </div>
                                </div>
                                <div className="relative mt-6">
                                    <label htmlFor="message" className="sr-only">Message</label>
                                    <FiMessageSquare className="absolute left-4 top-5 h-5 w-5 text-slate-400 dark:text-slate-500" />
                                    <textarea name="message" id="message" placeholder="Your Message" required rows={5} value={formData.message} onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-60" />
                                </div>
                                <div className="mt-6">
                                    <button type="submit" disabled={status === 'loading' || !isSubmittable} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105">
                                        {status === 'loading' ? (
                                            <>
                                                <ImSpinner2 className="h-5 w-5 animate-spin" />
                                                <span>Categorizing & Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FiSend className="h-5 w-5" />
                                                <span>Send Message</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </fieldset>
                            {feedbackMessage && status !== 'idle' && (
                                <div className={`mt-4 text-center p-3 rounded-lg text-sm font-medium transition-opacity duration-300 ${status === 'error' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300' :
                                    status === 'success' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300' :
                                        'opacity-0'
                                    }`}>
                                    {feedbackMessage}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;