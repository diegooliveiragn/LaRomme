'use client';

import { useState } from 'react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  if (subscribed) {
    return (
      <div className="py-4 border-t border-brand-red">
        <p className="font-serif text-lg text-brand-offwhite italic">
          Bem-vindo ao território LaRomme.
        </p>
        <p className="font-mono text-[10px] text-brand-red uppercase tracking-widest mt-2">
          Acesso confirmado.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wider text-brand-offwhite">
        Entre No Próximo Capítulo
      </h4>
      <p className="font-sans text-xs text-zinc-400 leading-relaxed max-w-sm">
        Acesso antecipado aos próximos drops, editoriais exclusivos e eventos da nossa comunidade. Nenhuma interrupção desnecessária.
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 pt-2 border-b border-zinc-600 focus-within:border-brand-offwhite transition-colors duration-500">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="SEU E-MAIL PRINCIPAL"
          required
          className="bg-transparent border-none text-xs font-mono uppercase tracking-widest px-0 py-3 text-white focus:outline-none focus:ring-0 w-full placeholder:text-zinc-600"
        />
        <button
          type="submit"
          className="font-mono text-[10px] text-brand-red hover:text-brand-offwhite uppercase tracking-widest py-3 font-bold transition-colors duration-300"
        >
          Solicitar Acesso
        </button>
      </form>
    </div>
  );
}