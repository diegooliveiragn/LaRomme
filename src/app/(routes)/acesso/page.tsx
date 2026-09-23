'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AcessoPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', instagram: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/acesso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao registrar acesso.');
      }

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', instagram: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Falha na conexão com os servidores.');
    }
  };

  return (
    <div className="bg-brand-black min-h-screen text-brand-offwhite pt-32 pb-32 px-6 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto space-y-12">
        
        {/* Cabeçalho */}
        <div className="text-center space-y-4 border-b border-zinc-900 pb-8">
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block">
            Acesso Restrito // Lista VIP
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl uppercase tracking-wider text-white">
            Lote Zero
          </h1>
          <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest max-w-md mx-auto leading-relaxed">
            Inscreva suas coordenadas para garantir prioridade de alocação no primeiro Drop da coleção Origo.
          </p>
        </div>

        {/* Formulário ou Feedback de Sucesso */}
        {status === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-zinc-950 border border-zinc-800 p-8 text-center space-y-6 shadow-2xl"
          >
            <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block">
              PROTOCOLO CONFIRMADO // LEI DE PRIORIDADE
            </span>
            <h2 className="font-serif text-2xl uppercase text-white">
              Sua chave de acesso foi gerada
            </h2>
            <p className="font-mono text-xs text-zinc-400 max-w-sm mx-auto">
              Você receberá a notificação de abertura do Lote Zero antes do lançamento oficial público.
            </p>
            <button 
              onClick={() => setStatus('idle')}
              className="border border-zinc-800 text-zinc-400 hover:text-white px-8 py-3 font-mono text-[10px] uppercase tracking-widest transition-colors"
            >
              [ Registrar Novo Acesso ]
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-2">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="EX: ARTHUR ROMME" 
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 font-mono text-[10px] uppercase tracking-widest text-white placeholder-zinc-700 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-2">E-mail de Acesso</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="E-MAIL@DOMINIO.COM" 
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 font-mono text-[10px] uppercase tracking-widest text-white placeholder-zinc-700 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-2">Telefone / WhatsApp</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 99999-9999" 
                    className="w-full bg-zinc-950 border border-zinc-800 p-4 font-mono text-[10px] uppercase tracking-widest text-white placeholder-zinc-700 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-2">Instagram (Opcional)</label>
                  <input 
                    type="text" 
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="@SEUPERFIL" 
                    className="w-full bg-zinc-950 border border-zinc-800 p-4 font-mono text-[10px] uppercase tracking-widest text-white placeholder-zinc-700 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {status === 'error' && (
              <div className="border border-brand-red/50 bg-brand-red/10 p-4 font-mono text-[10px] text-brand-red uppercase tracking-widest text-center">
                {errorMessage}
              </div>
            )}

            <button 
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-white text-brand-black py-5 font-mono text-[11px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-colors duration-300 shadow-2xl disabled:opacity-50"
            >
              {status === 'loading' ? '[ REGISTRANDO PROTOCOLO... ]' : '[ SOLICITAR ACESSO VIP ]'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}