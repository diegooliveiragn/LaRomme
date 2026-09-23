'use client';

import { ReactLenis } from '@studio-freight/react-lenis';
import { CustomCursor } from './CustomCursor';
import { ReactNode } from 'react';

export function SensoryWrapper({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.4 }}>
      <CustomCursor />
      {children}
    </ReactLenis>
  );
}