'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from '@/components/ui/FadeIn';
import { supabase } from '@/lib/supabase';

export default function AccessPage() {
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '', instagram: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Máscara de Telefone: (XX) X XXXX-XXXX
  const maskPhone = (value: string) => {
    const v = value.replace(/\D/g, '').substring(0, 11);
    if (v.length === 0) return '';
    if (v.length <= 2) return `(${v}`;
    if (v.length <= 3) return `(${v.substring(0,2)})${v.substring(2)}`;
    if (v.length <= 7) return `(${v.substring(0,2)}) ${v.substring(2,3)}${v.substring(3)}`;
    return `(${v.substring(0,2)})${v.substring(2,3)} ${v.substring(3,7)}-${v.substring(7)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'telefone') {
      setFormData(prev => ({ ...prev, [name]: maskPhone(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.nome || !formData.telefone) return;

    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const { error } = await supabase
        .from('senado_vip')
        .insert([{ 
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          instagram: formData.instagram,
          origin: 'acesso_page', 
          status: 'pending' 
        }]);

      if (error) {
         if (error.code === '23505') throw new Error('E-mail já registrado.');
         throw error;
      }
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Falha na conexão com o banco.');
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-brand-black flex flex-col justify-center items-center pt-24 px-6 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-brand-black to-brand-black pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <FadeIn direction="up">
          <div className="text-center mb-12">
            <h1 className="font-serif text-3xl sm:text-4xl text-white uppercase tracking-wider mb-4">Senado VIP</h1>
            <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest">Insira suas coordenadas para o primeiro drop.</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-6 sm:p-10">
            <AnimatePresence mode="wait">
              {status === 'idle' || status === 'error' ? (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-mono text-[8px] text-zinc-500 uppercase">Nome Completo</label>
                    <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full bg-brand-black border border-zinc-800 px-4 py-3 font-mono text-xs text-white uppercase" required />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[8px] text-zinc-500 uppercase">E-mail</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-brand-black border border-zinc-800 px-4 py-3 font-mono text-xs text-white uppercase" required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-mono text-[8px] text-zinc-500 uppercase">Telefone</label>
                      <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(XX) X XXXX-XXXX" maxLength={16} className="w-full bg-brand-black border border-zinc-800 px-4 py-3 font-mono text-xs text-white uppercase" required />
                    </div>
                    <div className="space-y-2">
                      <label className="font-mono text-[8px] text-zinc-500 uppercase">Instagram (Opcional)</label>
                      <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} className="w-full bg-brand-black border border-zinc-800 px-4 py-3 font-mono text-xs text-white uppercase" />
                    </div>
                  </div>

                  {status === 'error' && (
                    <p className="text-[10px] text-brand-red uppercase text-center mt-4 border border-brand-red p-2">{errorMessage}</p>
                  )}

                  <button type="submit" disabled={isSubmitting} className="w-full bg-white text-black py-4 font-mono text-[10px] uppercase hover:bg-zinc-300 mt-6">
                    {isSubmitting ? '[ PROCESSANDO... ]' : '[ SOLICITAR ACESSO VIP ]'}
                  </button>
                </motion.form>
              ) : (
                <motion.div key="success" className="text-center py-10 space-y-6">
                  <h3 className="font-serif text-xl text-white uppercase">Coordenadas Recebidas</h3>
                  <p className="text-[10px] text-zinc-500 uppercase">Seu acesso foi registrado.</p>
                  <Link href="/" className="text-[9px] text-zinc-400 uppercase border-b border-zinc-800">Retornar à Base</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}