import React from 'react';

interface QuoteProps {
  author?: string;
  source?: string;
  year?: string;
  link?: string;
  children: React.ReactNode;
}

export function Quote({ author, source, year, link, children }: QuoteProps) {
  return (
    <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 italic">
      <div className="text-gray-800 text-lg leading-relaxed">
        {children}
      </div>
      {(author || source) && (
        <footer className="mt-3 text-sm text-gray-600 not-italic">
          <cite>
            {author && <span className="font-medium">{author}</span>}
            {source && (
              <>
                {author && ', '}
                {link ? (
                  <a href={link} className="text-blue-600 hover:underline">
                    {source}
                  </a>
                ) : (
                  <span>{source}</span>
                )}
              </>
            )}
            {year && <span> ({year})</span>}
          </cite>
        </footer>
      )}
    </blockquote>
  );
}