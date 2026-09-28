'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { playHapticSound } from '@/lib/sound';

export default function CheckoutSucessoPage() {
  const [orderInfo, setOrderInfo] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lr_last_order');
    if (saved) {
      try {
        setOrderInfo(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans py-16 px-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg space-y-6 font-mono text-center">
        
        <div className="w-12 h-12 bg-emerald-950/60 border border-emerald-500/50 rounded-full flex items-center justify-center mx-auto text-emerald-400 text-xl font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          ✓
        </div>

        <div className="space-y-2">
          <span className="text-[10px] text-emerald-400 uppercase tracking-widest block font-bold">
            ✦ AQUISIÇÃO REGISTRADA NO SUPABASE
          </span>
          <h1 className="text-xl font-serif uppercase tracking-widest text-white">
            Reserva Confirmada
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Sua peça foi reservada com sucesso. O serial numérico exclusivo foi vinculado ao seu registro de aquisição.
          </p>
        </div>

        {orderInfo && (
          <div className="bg-black border border-zinc-800 p-4 rounded text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-500">Pedido:</span>
              <span className="font-bold text-white">{orderInfo.orderNumber}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-500">Item:</span>
              <span className="text-zinc-200">{orderInfo.item}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-500">Serial Exclusivo:</span>
              <span className="font-bold text-amber-300">{orderInfo.serial}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-zinc-500">Titular:</span>
              <span className="text-zinc-300">{orderInfo.customerName}</span>
            </div>
          </div>
        )}

        {/* CARD SOFT-ONBOARDING SENADO VIP */}
        <div className="bg-zinc-950 border border-amber-900/40 p-4 rounded text-left space-y-3">
          <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">
            [ SENADO VIP • ACESSO RESTRITO ]
          </span>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
            Crie sua senha no portal do cliente para acompanhar o status do frete White Glove e visualizar seus seriais ativos.
          </p>
          <Link
            href="/acesso"
            onClick={playHapticSound}
            className="block text-center w-full bg-white text-black font-bold text-xs uppercase tracking-widest py-3 hover:bg-zinc-200 transition-colors"
          >
            [ ACTIVAR REGISTRO VIP ]
          </Link>
        </div>

        <Link
          href="/"
          onClick={playHapticSound}
          className="block text-[10px] text-zinc-500 hover:text-zinc-300 uppercase tracking-widest transition-colors pt-2"
        >
          ← Voltar à Galeria
        </Link>

      </div>
    </main>
  );
}
