import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Loading spinner component
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Size of the spinner ('sm', 'md', 'lg')
 * @param {string} props.text - Optional loading text
 * @returns {JSX.Element}
 */
export function LoadingSpinner({ className, size = 'md', text }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

/**
 * Full page loading component
 * @param {Object} props - Component props
 * @param {string} props.text - Loading text
 * @returns {JSX.Element}
 */
export function PageLoading({ text = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

export default LoadingSpinner;

