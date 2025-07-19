import React from 'react';

// Regex for inline elements
const BOLD_REGEX = /\*\*(.+?)\*\*/;
const LINK_REGEX = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/;

/**
 * A recursive function to parse and render inline markdown elements like bold and links.
 * It processes one type of element at a time to correctly handle nesting.
 */
const renderInlineMarkdown = (text: string): (string | JSX.Element)[] => {
    if (!text) return [];

    // Order of operations matters for nesting. Parse links first.
    const linkMatch = text.match(LINK_REGEX);
    if (linkMatch && typeof linkMatch.index === 'number') {
        const [fullMatch, linkText, url] = linkMatch;
        const before = text.substring(0, linkMatch.index);
        const after = text.substring(linkMatch.index + fullMatch.length);

        return [
            ...renderInlineMarkdown(before),
            <a
                key={`${linkMatch.index}-link`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-semibold underline hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
            >
                {renderInlineMarkdown(linkText)}
            </a>,
            ...renderInlineMarkdown(after)
        ];
    }
    
    const boldMatch = text.match(BOLD_REGEX);
    if (boldMatch && typeof boldMatch.index === 'number') {
        const [fullMatch, boldText] = boldMatch;
        const before = text.substring(0, boldMatch.index);
        const after = text.substring(boldMatch.index + fullMatch.length);

        return [
            ...renderInlineMarkdown(before),
            <strong key={`${boldMatch.index}-bold`}>{renderInlineMarkdown(boldText)}</strong>,
            ...renderInlineMarkdown(after)
        ];
    }

    // Base case: no more markdown, return plain text
    return [text];
};

const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
    // 1. Parse text into block-level elements (paragraphs, lists)
    const blocks: ({ type: 'p'; content: string } | { type: 'ul'; items: string[] })[] = [];
    let currentParagraph: string[] = [];
    let currentListItems: string[] = [];

    const flushParagraph = () => {
        if (currentParagraph.length > 0) {
            blocks.push({ type: 'p', content: currentParagraph.join('\n').trim() });
            currentParagraph = [];
        }
    };

    const flushList = () => {
        if (currentListItems.length > 0) {
            blocks.push({ type: 'ul', items: currentListItems });
            currentListItems = [];
        }
    };

    const lines = text.split('\n');

    lines.forEach(line => {
        const listItemMatch = line.match(/^\s*[\*\-]\s+(.*)/);
        if (listItemMatch) {
            flushParagraph(); // A list starts, so end the current paragraph
            currentListItems.push(listItemMatch[1].trim());
        } else if (line.trim() === '') {
            // Empty line is a block separator
            flushParagraph();
            flushList();
        } else {
            flushList(); // A paragraph starts, so end the current list
            currentParagraph.push(line);
        }
    });

    flushParagraph();
    flushList();

    // 2. Render the blocks
    return (
        <div className="text-sm break-words space-y-3">
            {blocks.map((block, index) => {
                if (block.type === 'p') {
                    // Don't render empty paragraphs
                    if (!block.content) return null;
                    return <p key={index}>{renderInlineMarkdown(block.content)}</p>;
                }
                if (block.type === 'ul') {
                    return (
                        <ul key={index} className="list-disc list-inside space-y-1 pl-2">
                            {block.items.map((item, itemIndex) => (
                                <li key={itemIndex}>{renderInlineMarkdown(item)}</li>
                            ))}
                        </ul>
                    );
                }
                return null;
            })}
        </div>
    );
};

export default MarkdownRenderer;