'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from '@/components/ui/FadeIn';
import { supabase } from '@/lib/supabase';

export default function AccessPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simular delay de criptografia
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const { error } = await supabase
        .from('senado_vip')
        .insert([{ email: email, origin: 'acesso_page', status: 'pending' }]);

      if (error) throw error;
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-brand-black flex flex-col justify-center items-center pt-24 px-6 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-brand-black to-brand-black pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        <FadeIn direction="up">
          <div className="text-center mb-12">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-[0.3em] block mb-4">Protocolo de Entrada</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-white uppercase tracking-wider mb-4">Senado VIP</h1>
            <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">
              O Lote Zero é classificado. <br/> Insira suas credenciais para solicitar decodificação.
            </p>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-900/80 p-8 backdrop-blur-sm relative overflow-hidden">
            <AnimatePresence mode="wait">
              {status === 'idle' || status === 'error' ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label htmlFor="email" className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest">Identificação (E-mail)</label>
                    <input 
                      type="email" 
                      id="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full bg-brand-black border-b border-zinc-800 px-0 py-3 font-mono text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-white transition-colors rounded-none"
                      required
                    />
                  </div>
                  {status === 'error' && (
                    <p className="font-mono text-[9px] text-brand-red uppercase tracking-wider">Falha na decodificação. E-mail já registrado ou conexão instável.</p>
                  )}
                  <button type="submit" disabled={isSubmitting} className="w-full bg-white text-brand-black py-4 font-mono text-[10px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-wait">
                    {isSubmitting ? '[ PROCESSANDO... ]' : '[ DECODIFICAR ACESSO ]'}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-6"
                >
                  <div className="w-12 h-12 mx-auto border border-zinc-800 rounded-full flex items-center justify-center bg-brand-black relative">
                    <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse"></span>
                    <span className="absolute w-full h-full border border-brand-red rounded-full animate-ping opacity-20"></span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl text-white uppercase tracking-widest">Credenciais Recebidas</h3>
                    <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">Seu dossiê está em análise. O acesso ao Cofre do Lote Zero será enviado por canal seguro (e-mail) caso aprovado.</p>
                  </div>
                  <Link href="/" className="inline-block mt-4 text-zinc-400 font-mono text-[9px] uppercase tracking-[0.2em] hover:text-white border-b border-zinc-800 pb-1 hover:border-white transition-colors">Retornar à Base</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}