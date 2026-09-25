'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from '@/components/ui/FadeIn';
import { supabase } from '@/lib/supabase';

export default function AccessPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    instagram: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Lógica da Máscara de Telefone: (XX) X XXXX-XXXX
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
    
    await new Promise(resolve => setTimeout(resolve, 800));

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
         if (error.code === '23505') throw new Error('E-mail já registrado no Senado VIP.');
         throw error;
      }
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Falha na conexão com o banco de dados.');
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
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-[0.3em] block mb-4">Protocolo de Entrada</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-white uppercase tracking-wider mb-4">Senado VIP</h1>
            <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">
              Inscreva suas coordenadas para garantir prioridade de <br/>alocação no primeiro drop da coleção Origo.
            </p>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-900/80 p-6 sm:p-10 backdrop-blur-sm relative overflow-hidden">
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
                    <label className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest">Nome Completo</label>
                    <input 
                      type="text" 
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="SEU NOME"
                      className="w-full bg-brand-black border border-zinc-800 px-4 py-3 font-mono text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white transition-colors rounded-none uppercase"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest">E-mail de Acesso</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="SEU E-MAIL"
                      className="w-full bg-brand-black border border-zinc-800 px-4 py-3 font-mono text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white transition-colors rounded-none uppercase"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest">Telefone / Whatsapp</label>
                      <input 
                        type="text" 
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        placeholder="(XX) X XXXX-XXXX"
                        maxLength={16}
                        className="w-full bg-brand-black border border-zinc-800 px-4 py-3 font-mono text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white transition-colors rounded-none uppercase"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest">Instagram (Opcional)</label>
                      <input 
                        type="text" 
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        placeholder="@SEUPERFIL"
                        className="w-full bg-brand-black border border-zinc-800 px-4 py-3 font-mono text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white transition-colors rounded-none uppercase"
                      />
                    </div>
                  </div>

                  {status === 'error' && (
                    <div className="border border-brand-red/50 bg-brand-red/10 p-4 text-center mt-4">
                      <p className="font-mono text-[9px] text-brand-red uppercase tracking-wider">{errorMessage}</p>
                    </div>
                  )}

                  <button type="submit" disabled={isSubmitting} className="w-full bg-white text-brand-black py-4 font-mono text-[10px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-wait mt-6">
                    {isSubmitting ? '[ PROCESSANDO... ]' : '[ SOLICITAR ACESSO VIP ]'}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-6"
                >
                  <div className="w-12 h-12 mx-auto border border-zinc-800 rounded-full flex items-center justify-center bg-brand-black relative">
                    <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse"></span>
                    <span className="absolute w-full h-full border border-brand-red rounded-full animate-ping opacity-20"></span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl text-white uppercase tracking-widest">Coordenadas Recebidas</h3>
                    <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed max-w-md mx-auto">
                      Seu dossiê foi registrado com sucesso. O acesso ao primeiro drop da coleção Origo será enviado para o e-mail cadastrado.
                    </p>
                  </div>
                  <Link href="/" className="inline-block mt-4 text-zinc-400 font-mono text-[9px] uppercase tracking-[0.2em] hover:text-white border-b border-zinc-800 pb-1 hover:border-white transition-colors">
                    Retornar à Base
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}