import { Variants } from 'framer-motion';

// Curvas de Easing Editoriais e Cinematográficas (tuplas estritas de 4 elementos para Cubic Bezier)
export const EASINGS = {
  easeOutCubic: [0.33, 1, 0.68, 1] as const,
  easeInOutCubic: [0.65, 0, 0.35, 1] as const,
  cinematic: [0.16, 1, 0.3, 1] as const,
  softOut: [0.25, 1, 0.5, 1] as const,
};

// Durações Padronizadas do Motion System
export const DURATIONS = {
  fast: 0.2,
  medium: 0.4,
  slow: 0.8,
  cinematic: 1.2,
};

// Variantes Reutilizáveis do Framer Motion
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATIONS.medium, ease: EASINGS.cinematic },
  },
};

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.slow, ease: EASINGS.cinematic },
  },
};

export const revealFromBottomVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.cinematic, ease: EASINGS.cinematic },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};