'use client';

import { useInView } from '@/hooks/use-in-view';
import { ReactNode } from 'react';

interface AnimateInProps {
  children: ReactNode;
  className?: string;
  animation?: string;
  delay?: number;
  as?: 'div' | 'section' | 'span';
}

export function AnimateIn({
  children,
  className = '',
  animation = 'animate-fade-up',
  delay = 0,
  as: Tag = 'div',
}: AnimateInProps) {
  const { ref, inView } = useInView();

  return (
    <Tag
      ref={ref}
      className={`${animation} ${inView ? 'animate-in' : 'animate-hidden'} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
