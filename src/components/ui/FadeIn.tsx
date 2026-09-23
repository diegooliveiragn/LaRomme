'use client';

import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'none';
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.8,
  direction = 'up',
  className = '',
}: FadeInProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const yOffset = direction === 'up' ? 20 : direction === 'down' ? -20 : 0;

  // Renderização inicial para evitar corte seco na hidratação
  if (!isMounted) {
    return (
      <div 
        className={className} 
        style={{ 
          opacity: 0, 
          transform: `translateY(${yOffset}px)`,
          transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s` 
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0], // Curva cúbica suave e constante
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}