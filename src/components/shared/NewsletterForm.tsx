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
      <p className="text-xs text-brand-red font-bold uppercase tracking-wider py-2">
        Inscrição realizada com sucesso!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Seu e-mail principal"
        required
        className="bg-zinc-900 border border-zinc-800 text-xs px-3 py-2 text-white focus:outline-none focus:border-brand-red transition"
      />
      <button
        type="submit"
        className="bg-brand-red text-white text-xs uppercase tracking-widest py-2 font-bold hover:bg-red-700 transition"
      >
        Inscrever-se
      </button>
    </form>
  );
}