import { cn } from '../../lib/utils/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline';
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variant === 'default' && 'bg-blue-100 text-blue-800 border-blue-200',
        variant === 'outline' && 'border-gray-200 bg-white text-gray-800',
        className
      )}
      {...props}
    />
  );
}
