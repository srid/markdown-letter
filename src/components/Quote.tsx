import React from 'react';
import authors from '../config/authors.json';

interface QuoteProps {
  author?: string;
  source?: string;
  link?: string;
  children: React.ReactNode;
}

export function Quote({ author, source, link, children }: QuoteProps) {
  const authorConfig = authors[author as keyof typeof authors] || authors.default;
  
  return (
    <blockquote className={`border-l-4 ${authorConfig.borderColor} pl-6 py-4 my-6 ${authorConfig.bgColor} italic`}>
      <div className={`${authorConfig.textColor} text-lg leading-relaxed`}>
        {children}
      </div>
      {(author || source) && (
        <footer className="mt-3 text-sm not-italic">
          <cite className={authorConfig.textColor}>
            {author && <span className="font-medium">{author}</span>}
            {source && (
              <>
                {author && ', '}
                {link ? (
                  <a href={link} className={`${authorConfig.textColor} hover:underline font-medium`}>
                    {source}
                  </a>
                ) : (
                  <span className="font-medium">{source}</span>
                )}
              </>
            )}
          </cite>
        </footer>
      )}
    </blockquote>
  );
}