'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeInUpVariants } from '@/config/motion';

export default function NotFound() {
  return (
    <div className="bg-brand-black text-brand-offwhite min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUpVariants}
        className="max-w-md space-y-8"
      >
        <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block">
          [ ERROR // 404 ]
        </span>
        
        <h1 className="font-serif text-5xl sm:text-6xl font-bold uppercase tracking-wider text-white">
          Fora do Arquivo
        </h1>
        
        <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest leading-relaxed">
          A rota solicitada não existe ou foi movida na estrutura do sistema.
        </p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-block border border-zinc-800 text-zinc-300 px-8 py-4 font-mono text-[10px] uppercase tracking-widest hover:border-brand-offwhite hover:text-brand-black hover:bg-brand-offwhite transition-colors"
          >
            [ Retornar à Origem ]
          </Link>
        </div>
      </motion.div>
    </div>
  );
}