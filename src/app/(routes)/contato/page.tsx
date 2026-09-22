'use client';

import { motion } from 'framer-motion';
import { siteConfig } from '@/config/site';
import { EASINGS, DURATIONS } from '@/config/motion';

export default function ContatoPage() {
  return (
    <div className="bg-brand-black text-brand-offwhite min-h-screen pt-36 pb-32">
      <div className="max-w-4xl mx-auto px-6 space-y-16">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
          className="text-center space-y-4"
        >
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block">
            LR / ATENDIMENTO
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold uppercase tracking-wider">
            Contato
          </h1>
          <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest max-w-md mx-auto">
            Canais diretos para suporte, imprensa e parcerias.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-zinc-900 pt-12">
          
          {/* Informações Direct Channel */}
          <div className="space-y-8 font-mono text-xs uppercase tracking-widest">
            <div>
              <span className="text-[10px] text-brand-red block mb-2">E-MAIL OFICIAL</span>
              <a href="mailto:contato@laromme.com.br" className="text-zinc-200 hover:text-white underline">
                contato@laromme.com.br
              </a>
            </div>

            <div>
              <span className="text-[10px] text-brand-red block mb-2">HORÁRIO DE ATENDIMENTO</span>
              <p className="text-zinc-400">SEGUNDA A SEXTA • 09H ÀS 18H</p>
            </div>

            <div>
              <span className="text-[10px] text-brand-red block mb-2">BASE DE ORIGEM</span>
              <p className="text-zinc-400">{siteConfig.location}</p>
              <p className="text-zinc-600 text-[10px]">{siteConfig.coordinates}</p>
            </div>
          </div>

          {/* Form Suporte Minimalista */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4 font-mono text-xs">
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">NOME</label>
              <input
                type="text"
                className="w-full bg-zinc-900/60 border border-zinc-800 p-3 text-white focus:outline-none focus:border-brand-red transition-colors"
                placeholder="SEU NOME COMPLETO"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">E-MAIL</label>
              <input
                type="email"
                className="w-full bg-zinc-900/60 border border-zinc-800 p-3 text-white focus:outline-none focus:border-brand-red transition-colors"
                placeholder="SEU E-MAIL"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">MENSAGEM</label>
              <textarea
                rows={4}
                className="w-full bg-zinc-900/60 border border-zinc-800 p-3 text-white focus:outline-none focus:border-brand-red transition-colors"
                placeholder="COMO PODEMOS AJUDAR?"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand-offwhite text-brand-black font-bold uppercase tracking-widest py-4 hover:bg-brand-red hover:text-white transition-colors"
            >
              Enviar Mensagem
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}