'use client';

import { useState } from 'react';
import { siteConfig } from '@/config/site';

export default function ContatoPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-28 pb-24 max-w-3xl mx-auto px-6 space-y-12">
      <div className="border-b border-zinc-300 pb-6 text-center">
        <span className="text-xs uppercase font-bold tracking-editorial text-brand-red block mb-1">
          Canais Oficiais
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase text-brand-black">
          Fale Conosco
        </h1>
      </div>

      {submitted ? (
        <div className="bg-white border border-brand-black p-8 text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold uppercase text-brand-black">
            Mensagem Recebida
          </h2>
          <p className="text-xs text-zinc-600 uppercase tracking-wider">
            Sua mensagem foi registrada em nossa equipe de atendimento. Responderemos em breve.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 p-8 space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-brand-black block">
              Nome Completo
            </label>
            <input
              required
              type="text"
              className="w-full border border-zinc-300 p-3 text-xs focus:outline-none focus:border-brand-black"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-brand-black block">
              E-mail Principal
            </label>
            <input
              required
              type="email"
              className="w-full border border-zinc-300 p-3 text-xs focus:outline-none focus:border-brand-black"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-brand-black block">
              Mensagem
            </label>
            <textarea
              required
              rows={5}
              className="w-full border border-zinc-300 p-3 text-xs focus:outline-none focus:border-brand-black resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-black text-white text-xs font-bold uppercase tracking-editorial py-4 hover:bg-brand-red transition-all"
          >
            Enviar Mensagem
          </button>
        </form>
      )}

      <div className="text-center text-xs uppercase tracking-widest text-zinc-500">
        E-mail direto: <span className="text-brand-black font-bold">{siteConfig.contact.email}</span>
      </div>
    </div>
  );
}
