'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import FadeIn from '@/components/FadeIn';

export default function CheckoutPage() {
  const { items, clearCart, setActiveOrderData } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [payer, setPayer] = useState({ fullName: '', email: '', cpf: '', phone: '' });
  const [address, setAddress] = useState({ cep: '', street: '', number: '', neighborhood: '', city: '', state: '' });

  const subtotal = items.reduce((acc, item) => acc + item.priceNumeric * item.quantity, 0);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          payer,
          address,
          paymentMethod: 'pix',
          subtotal,
          shippingCost: 0,
        }),
      });

      const data = await res.json();

      if (data.success && data.orderUuid) {
        // Grava a Reserva Ativa no contexto global e esvazia o carrinho
        setActiveOrderData({ id: data.orderUuid, shortId: data.orderShortId });
        clearCart();
        router.push(`/pedido/${data.orderUuid}`);
      } else {
        setErrorMsg(data.error || 'Erro ao registrar pedido.');
      }
    } catch (err) {
      setErrorMsg('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-36 pb-24 px-6 max-w-xl mx-auto text-center font-mono text-xs text-zinc-500 uppercase tracking-widest space-y-4">
        <p>Sua sacola está vazia.</p>
        <button onClick={() => router.push('/#origo')} className="text-white border-b border-white pb-0.5">
          VOLTAR AO ACERVO
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-3xl mx-auto font-mono text-xs text-white space-y-8">
      <FadeIn>
        <div className="border-b border-zinc-900 pb-4 mb-8">
          <span className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] block mb-1">AQUISITION PROCESS</span>
          <h1 className="font-serif text-2xl uppercase tracking-[0.2em] font-bold">CHECKOUT DA MAISON</h1>
        </div>

        {errorMsg && (
          <div className="p-4 border border-red-900/50 bg-red-950/20 text-red-400 text-xs uppercase tracking-wider mb-6">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleCreateOrder} className="space-y-8">
          {/* IDENTIFICAÇÃO */}
          <div className="space-y-4 border-b border-zinc-900 pb-8">
            <h2 className="text-sm font-serif tracking-widest uppercase text-zinc-300">01. IDENTIFICAÇÃO</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <input
                type="text"
                placeholder="NOME COMPLETO"
                required
                value={payer.fullName}
                onChange={(e) => setPayer({ ...payer, fullName: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
              />
              <input
                type="email"
                placeholder="E-MAIL"
                required
                value={payer.email}
                onChange={(e) => setPayer({ ...payer, email: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
              />
              <input
                type="text"
                placeholder="CPF"
                required
                value={payer.cpf}
                onChange={(e) => setPayer({ ...payer, cpf: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
              />
              <input
                type="text"
                placeholder="TELEFONE / WHATSAPP"
                required
                value={payer.phone}
                onChange={(e) => setPayer({ ...payer, phone: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* ENDEREÇO */}
          <div className="space-y-4 border-b border-zinc-900 pb-8">
            <h2 className="text-sm font-serif tracking-widest uppercase text-zinc-300">02. DESTINO DE ENTREGA</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="CEP"
                required
                value={address.cep}
                onChange={(e) => setAddress({ ...address, cep: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
              />
              <input
                type="text"
                placeholder="RUA / LOGRADOURO"
                required
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="w-full md:col-span-2 bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
              />
              <input
                type="text"
                placeholder="NÚMERO"
                required
                value={address.number}
                onChange={(e) => setAddress({ ...address, number: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
              />
              <input
                type="text"
                placeholder="BAIRRO"
                required
                value={address.neighborhood}
                onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
              />
              <div className="flex space-x-2 md:col-span-1">
                <input
                  type="text"
                  placeholder="CIDADE"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-2/3 bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                />
                <input
                  type="text"
                  placeholder="UF"
                  required
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-1/3 bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors uppercase"
                />
              </div>
            </div>
          </div>

          {/* BOTÃO SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 font-mono font-bold uppercase tracking-[0.25em] hover:bg-zinc-200 transition-colors text-xs disabled:opacity-50"
          >
            {loading ? 'GERANDO CÓDIGO PIX...' : 'GERAR PEDIDO PIX'}
          </button>
        </form>
      </FadeIn>
    </div>
  );
}