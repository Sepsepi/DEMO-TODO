import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border-4 font-pixel shadow-2xl';

    const variants = {
      primary: 'bg-purple-600 hover:bg-purple-700 border-purple-500 text-white hover:shadow-purple-500/50 hover:scale-105 focus:ring-purple-400',
      secondary: 'bg-[#2a2139] border-[#3f3454] text-purple-300 hover:bg-[#3f3454] hover:border-purple-500 focus:ring-purple-400',
      danger: 'bg-red-600 hover:bg-red-700 border-red-500 text-white hover:shadow-red-500/50 focus:ring-red-400',
      ghost: 'hover:bg-purple-800/50 text-purple-300 border-transparent focus:ring-purple-400',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
