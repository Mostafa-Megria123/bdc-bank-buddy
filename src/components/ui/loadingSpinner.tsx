import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-8 w-8',
  lg: 'h-8 w-8',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className, size = 'md', label, ...props }) => {
  return (
    <div
      role="status"
      className={cn('flex flex-col items-center justify-center gap-2', className)}
      {...props}
    >
      <img
        src="/favicon.ico"
        alt="Loading..."
        className={cn('animate-spin', sizeClasses[size])}
      />
      {label && <p className="text-muted-foreground">{label}</p>}
      <span className="sr-only">Loading...</span>
    </div>
  );
};