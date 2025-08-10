import React from 'react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  children: React.ReactNode;
}

const typeStyles = {
  info: 'border-blue-500 bg-blue-50 text-blue-900',
  warning: 'border-yellow-500 bg-yellow-50 text-yellow-900',
  error: 'border-red-500 bg-red-50 text-red-900',
  success: 'border-green-500 bg-green-50 text-green-900',
};

const iconStyles = {
  info: '🛈',
  warning: '⚠️',
  error: '❌',
  success: '✅',
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  return (
    <div className={`border-l-4 p-4 my-6 rounded-r-lg ${typeStyles[type]}`}>
      {title && (
        <div className="flex items-center mb-2">
          <span className="mr-2 text-lg">{iconStyles[type]}</span>
          <h4 className="font-semibold text-base">{title}</h4>
        </div>
      )}
      <div className="prose prose-sm max-w-none">
        {children}
      </div>
    </div>
  );
}