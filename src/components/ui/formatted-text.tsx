import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

export function FormattedText({ text, className = "" }: FormattedTextProps) {
  // Simple but effective markdown parser that preserves line breaks
  const formatText = (text: string) => {
    // Handle bold text **text** - only for headers
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-lg">$1</strong>');
    // Handle italic text *text* (but not bold which uses **)
    formattedText = formattedText.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em class="italic">$1</em>');
    
    return formattedText;
  };

  return (
    <div 
      className={`leading-relaxed whitespace-pre-line ${className}`}
      dangerouslySetInnerHTML={{ __html: formatText(text) }}
    />
  );
}