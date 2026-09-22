'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASINGS, DURATIONS } from '@/config/motion';
import { trackEvent } from '@/lib/analytics';

export default function AcessoVIPPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', size: '' });

  const handleSizeSelect = (size: string) => {
    setFormData({ ...formData, size });
    trackEvent('size_selection', { selected_size: size });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.size) {
      trackEvent('access_request', { 
        size: formData.size,
        has_name: !!formData.name,
        has_email: !!formData.email 
      });
      setIsSubmitted(true);
    }
  };

  return (
    <div className="bg-brand-black text-brand-offwhite min-h-screen flex flex-col justify-center items-center relative overflow-hidden pt-28 pb-20">
      <div className="w-full max-w-lg px-6 z-10">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
              className="space-y-10"
            >
              <div className="text-center space-y-4">
                <span className="font-serif text-3xl opacity-50 block mb-4">LR</span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wider text-white">
                  Abertura de Arquivo
                </h1>
                
                <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest leading-relaxed max-w-sm mx-auto pt-2">
                  Antes do lançamento público, o Drop 01 será disponibilizado de forma antecipada para os membros cadastrados.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4 font-mono text-[10px] uppercase tracking-widest">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="IDENTIFICAÇÃO (NOME)"
                    className="w-full bg-zinc-900/50 border border-zinc-800 text-white p-4 focus:outline-none focus:border-brand-offwhite transition-colors placeholder:text-zinc-600"
                  />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="E-MAIL DE CONTATO"
                    className="w-full bg-zinc-900/50 border border-zinc-800 text-white p-4 focus:outline-none focus:border-brand-offwhite transition-colors placeholder:text-zinc-600"
                  />

                  <div className="pt-2">
                    <span className="block text-zinc-500 mb-3 ml-1">SELECIONE SUA ESTRUTURA (TAMANHO)</span>
                    <div className="grid grid-cols-4 gap-2">
                      {['P', 'M', 'G', 'GG'].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeSelect(size)}
                          className={`py-3 border transition-all ${
                            formData.size === size
                              ? 'bg-brand-offwhite text-brand-black border-brand-offwhite font-bold'
                              : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-500'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!formData.size}
                  className={`w-full py-5 font-mono text-[11px] uppercase tracking-widest transition-all ${
                    !formData.size
                      ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'
                      : 'bg-brand-red text-white hover:bg-red-800 shadow-xl'
                  }`}
                >
                  [ Solicitar Acesso ]
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: DURATIONS.medium, ease: EASINGS.cinematic }}
              className="text-center space-y-8 py-12 border border-zinc-800 bg-zinc-900/30 p-8"
            >
              <div className="w-12 h-12 rounded-full border border-brand-red flex items-center justify-center mx-auto mb-6 text-brand-red">
                <span className="font-mono text-xl">✓</span>
              </div>
              <h2 className="font-serif text-2xl uppercase tracking-wider text-white">
                Registro Confirmado
              </h2>
              <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest space-y-2">
                <p>NOME: {formData.name}</p>
                <p>ESTRUTURA SOLICITADA: {formData.size}</p>
                <p>STATUS: AGUARDANDO LIBERAÇÃO</p>
              </div>
              <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest leading-relaxed max-w-xs mx-auto pt-6 border-t border-zinc-800">
                Seu acesso ao ORIGO / 01 foi registrado. A próxima etapa será comunicada diretamente por e-mail.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}