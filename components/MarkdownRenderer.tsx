import React from 'react';

const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
  // Regex to find markdown links: [text](url)
  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(markdownLinkRegex)) {
    const [fullMatch, linkText, url] = match;
    const matchIndex = match.index ?? 0;

    // Push the text before the link
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }
    
    // Push the link element
    parts.push(
      <a
        key={matchIndex}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 font-semibold underline hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
      >
        {linkText}
      </a>
    );
    
    lastIndex = matchIndex + fullMatch.length;
  }
  
  // Push any remaining text after the last link
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return (
    <div className="text-sm break-words" style={{ whiteSpace: 'pre-wrap' }}>
      {parts.map((part, index) => <React.Fragment key={index}>{part}</React.Fragment>)}
    </div>
  );
};

export default MarkdownRenderer;