'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '@/config/site';

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Exibe o preloader apenas na primeira sessão
    const hasVisited = sessionStorage.getItem('laromme_intro_seen');
    if (hasVisited) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('laromme_intro_seen', 'true');
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
          className="fixed inset-0 z-50 bg-brand-black flex flex-col items-center justify-center select-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 px-6"
          >
            <span className="font-serif text-4xl font-bold tracking-widest text-white block">
              LR
            </span>
            <div className="font-mono text-[10px] text-brand-red uppercase tracking-widest animate-pulse">
              [ {siteConfig.coordinates} ]
            </div>
            <span className="font-sans text-[9px] text-zinc-600 uppercase tracking-widest block pt-2">
              Inicializando Arquivo
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}