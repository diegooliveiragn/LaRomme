'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { playHapticSound } from '@/lib/sound';

export default function CheckoutSucessoPage() {
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem('lr_last_order');
    if (savedOrder) {
      setOrderData(JSON.parse(savedOrder));
    }
  }, []);

  return (
    <main className="min-h-[100dvh] bg-black text-white font-sans flex flex-col items-center">
      
      <header className="w-full px-6 pt-14 pb-6 flex justify-between items-center max-w-3xl mx-auto border-b border-zinc-900">
        <span className="font-serif text-xl tracking-widest text-white">LaRomme.</span>
      </header>

      <div className="flex-1 w-full max-w-3xl mx-auto px-6 flex flex-col justify-center py-12">
        <div className="bg-[#050505] border border-zinc-900 p-8 md:p-12 space-y-10 text-center">
          
          <div className="space-y-4">
            <span className="text-3xl text-white block">✓</span>
            <h1 className="text-2xl font-serif uppercase tracking-widest text-white">
              Aquisição Registrada
            </h1>
            <p className="text-[11px] text-zinc-500 tracking-widest uppercase font-sans">
              O seu pedido foi recebido pelo nosso sistema.
            </p>
          </div>

          {orderData && (
            <div className="text-left bg-black border border-zinc-800/80 p-6 space-y-4 max-w-md mx-auto">
              <div className="flex justify-between text-[10px] uppercase tracking-widest border-b border-zinc-900 pb-2">
                <span className="text-zinc-500">Documento</span>
                <span className="text-white">{orderData.orderNumber}</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest border-b border-zinc-900 pb-2">
                <span className="text-zinc-500">Artefato</span>
                <span className="text-white">{orderData.item}</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest">
                <span className="text-zinc-500">Serial Designado</span>
                <span className="text-zinc-300">{orderData.serial}</span>
              </div>
            </div>
          )}

          <div className="space-y-4 pt-4 max-w-md mx-auto">
            <p className="text-[10px] text-zinc-500 tracking-widest uppercase font-sans leading-relaxed">
              Assim que o seu banco confirmar a liquidação do Pix, você receberá o recibo e o código de rastreio White Glove via e-mail.
            </p>
            <Link 
              href="/conta" 
              onClick={playHapticSound} 
              className="block w-full bg-white text-black font-sans font-bold text-[10px] uppercase tracking-widest py-4 hover:bg-zinc-200 transition-colors"
            >
              Acessar Arquivo Pessoal
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}