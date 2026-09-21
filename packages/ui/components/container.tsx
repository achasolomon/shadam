import * as React from 'react';
import { cn } from '../lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'narrow' | 'wide';
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto w-full px-4 sm:px-6 lg:px-8',
          {
            'max-w-7xl': size === 'default',
            'max-w-4xl': size === 'narrow',
            'max-w-[1400px]': size === 'wide',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Container.displayName = 'Container';

export { Container };
