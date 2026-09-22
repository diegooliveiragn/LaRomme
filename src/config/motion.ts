export const EASINGS = {
  cinematic: [0.16, 1, 0.3, 1],
  gentle: [0.25, 1, 0.5, 1],
  smooth: [0.33, 1, 0.68, 1],
} as const;

export const DURATIONS = {
  fast: 0.5,
  medium: 0.9,
  slow: 1.3,
  editorial: 1.8,
  cinematic: 1.3,
} as const;

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.cinematic,
      ease: EASINGS.cinematic,
    },
  },
};