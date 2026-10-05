'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import FadeIn from '@/components/FadeIn';

export default function CarrinhoPage() {
  const { items, removeFromCart, updateQuantity, subtotal, totalItems, isLoaded } = useCart();

  const [cep, setCep] = useState('');
  const [calculatingFrete, setCalculatingFrete] = useState(false);
  const [freightOption, setFreightOption] = useState<{ name: string; price: number; days: number } | null>(null);

  // CRONÔMETRO DE RESERVA DE LOTE (15 MINUTOS)
  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    if (items.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [items.length]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCalculateFrete = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length < 8) return;

    setCalculatingFrete(true);
    try {
      const res = await fetch('/api/frete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep: cleanCep, items }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setFreightOption({ 
            name: data[0].name || 'EXPRESSO FORTALEZA / BRASIL', 
            price: data[0].price || 0, 
            days: data[0].delivery_time || 3 
          });
        } else if (data.price !== undefined) {
          setFreightOption({ 
            name: data.name || 'ENTREGA PADRÃO', 
            price: Number(data.price), 
            days: Number(data.days || 3) 
          });
        }
      }
    } catch (e) {
      console.error('Erro ao consultar frete:', e);
    } finally {
      setCalculatingFrete(false);
    }
  };

  const formattedSubtotal = subtotal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const finalTotal = subtotal + (freightOption ? freightOption.price : 0);
  const formattedTotal = finalTotal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  if (!isLoaded) {
    return (
      <div className="pt-36 pb-24 px-6 md:px-12 max-w-4xl mx-auto text-center space-y-8 min-h-[70vh] flex flex-col items-center justify-center">
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">CARREGANDO SACOLA...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-36 pb-24 px-6 md:px-12 max-w-4xl mx-auto text-center space-y-8 min-h-[70vh] flex flex-col items-center justify-center font-sans">
        <FadeIn>
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block">SACOLA DE COMPRAS</span>
            <h1 className="font-serif text-3xl md:text-5xl tracking-[0.25em] text-white uppercase font-bold">SUA SACOLA ESTÁ VAZIA.</h1>
            <p className="text-xs text-zinc-400 tracking-wider max-w-md mx-auto font-light pt-2">
              Nenhum artefato foi adicionado à sua seleção até o momento.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={150}>
          <div className="pt-4">
            <Link
              href="/#origo"
              className="inline-block bg-white text-black font-bold text-[10px] md:text-[11px] tracking-[0.3em] uppercase px-8 py-3.5 hover:bg-zinc-200 transition-all shadow-xl"
            >
              EXPLORAR COLEÇÃO ORIGO.
            </Link>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* BANNER DE RESERVA DE LOTE */}
      <FadeIn>
        <div className="bg-[#080808] border border-zinc-900 px-4 py-3 text-center text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>RESERVA TEMPORÁRIA DE LOTE: <strong className="text-amber-400 font-bold">{formatTime(timeLeft)}</strong> MINUTOS.</span>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-900 pb-6 gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block mb-1">REVISÃO DE SELEÇÃO</span>
            <h1 className="font-serif text-2xl md:text-4xl tracking-[0.2em] text-white uppercase font-bold">SUA SACOLA ({totalItems}).</h1>
          </div>
          <Link href="/#origo" className="text-xs font-mono text-zinc-400 hover:text-white transition-colors">
            ← CONTINUAR COMPRANDO.
          </Link>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LISTA DE ITENS SELECIONADOS */}
        <div className="lg:col-span-8 space-y-6">
          {items.map((item) => (
            <FadeIn key={item.cartItemId}>
              <div className="bg-[#080808] border border-zinc-900 p-4 md:p-6 flex gap-6 items-center justify-between">
                <div className="flex gap-4 md:gap-6 items-center">
                  <div className="relative w-20 h-24 md:w-24 md:h-32 bg-zinc-950 border border-zinc-900 flex-shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block">{item.category}</span>
                    <h3 className="font-serif text-base md:text-lg text-white font-bold tracking-wider">{item.name}</h3>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400">
                      <span>TAM: <strong className="text-white">{item.size}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        COR: <span className="w-2.5 h-2.5 rounded-full border border-zinc-700 inline-block" style={{ backgroundColor: item.colorHex }} />
                        <strong className="text-white">{item.colorName}</strong>
                      </span>
                    </div>
                    <p className="text-xs font-mono text-white font-bold pt-1">{item.priceString}</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-end md:items-center gap-4 md:gap-6">
                  {/* CONTROLE DE QUANTIDADE */}
                  <div className="flex items-center border border-zinc-800 font-mono text-xs">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, -1)}
                      className="px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-white font-bold border-x border-zinc-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, 1)}
                      className="px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
                    >
                      +
                    </button>
                  </div>

                  {/* REMOVER ITEM */}
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="text-zinc-600 hover:text-red-400 text-xs font-mono p-1 transition-colors"
                    title="Remover Artefato"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* RESUMO DO PEDIDO */}
        <div className="lg:col-span-4 space-y-6">
          <FadeIn delay={100}>
            <div className="bg-[#080808] border border-zinc-900 p-6 md:p-8 space-y-6">
              <h2 className="font-serif text-lg text-white font-bold tracking-wider uppercase border-b border-zinc-900 pb-4">
                RESUMO DO PEDIDO.
              </h2>

              <div className="space-y-3 font-mono text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>SUBTOTAL:</span>
                  <span className="text-white font-bold">{formattedSubtotal}</span>
                </div>

                {/* SIMULADOR DE FRETE */}
                <div className="border-t border-b border-zinc-900 py-3 space-y-3">
                  <label className="text-[10px] text-zinc-500 uppercase block tracking-wider">CÁLCULO DE FRETE (CEP):</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={9}
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      placeholder="60000-000"
                      className="bg-zinc-950 border border-zinc-800 px-3 py-2 text-white text-xs w-full focus:outline-none focus:border-white font-mono"
                    />
                    <button
                      onClick={handleCalculateFrete}
                      disabled={calculatingFrete}
                      className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white px-4 py-2 text-[10px] font-bold uppercase transition-colors"
                    >
                      {calculatingFrete ? '...' : 'OK'}
                    </button>
                  </div>

                  {freightOption ? (
                    <div className="flex justify-between text-[11px] text-emerald-400 font-mono pt-1">
                      <span>{freightOption.name} ({freightOption.days}d):</span>
                      <span>{freightOption.price === 0 ? 'GRÁTIS' : freightOption.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-[10px]">
                      <span>FRETE ESTIMADO:</span>
                      <span className="text-zinc-500 uppercase">INFORME O CEP</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-between font-mono text-sm">
                <span className="text-white font-bold">TOTAL ESTIMADO:</span>
                <span className="text-white font-bold">{formattedTotal}</span>
              </div>

              <Link
                href="/checkout"
                className="block w-full text-center bg-white text-black font-bold text-xs tracking-[0.25em] uppercase py-4 hover:bg-zinc-200 transition-all shadow-xl font-sans"
              >
                AVANÇAR PARA CHECKOUT.
              </Link>

              <p className="text-[10px] font-mono text-zinc-500 text-center uppercase tracking-wider">
                ENVIO SEGURO • FORTALEZA & BRASIL
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}