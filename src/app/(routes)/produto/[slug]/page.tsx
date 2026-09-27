'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProdutoPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Mock do Lote Zero
  const stock = { P: 8, M: 0, G: 15, GG: 5 };

  // --- MOTOR DE TELEMETRIA (OLHO DE DEUS) ---
  const trackEvent = async (eventType: string, details: any) => {
    let sessionId = localStorage.getItem('lr_session');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('lr_session', sessionId);
    }
    const isCeo = localStorage.getItem('lr_ceo_mode') === 'true';

    try {
      await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          event_type: eventType,
          path: `/produto/${params.slug || 'boxy'}`,
          details: { ...details, is_ceo: isCeo }
        })
      });
    } catch (e) {}
  };

  useEffect(() => {
    const startTime = Date.now();
    trackEvent('page_view', { item: 'Boxy Heavyweight' });

    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 5) trackEvent('time_on_page', { seconds: timeSpent });
    };
  }, []);

  const handleSizeClick = (size: string, qty: number) => {
    setSelectedSize(size);
    if (qty === 0) {
      // O cliente clicou no tamanho esgotado: Demanda Reprimida capturada!
      trackEvent('intent_out_of_stock', { size_clicked: size });
    } else {
      trackEvent('intent_select_size', { size_clicked: size });
    }
  };

  const handleCheckout = () => {
    if (!selectedSize || stock[selectedSize as keyof typeof stock] === 0) return;
    trackEvent('intent_checkout', { size: selectedSize, price: 320 });
    router.push('/checkout');
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 px-6 pb-20 font-sans selection:bg-emerald-500 selection:text-black">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        
        {/* LADO ESQUERDO: IMAGEM BRUTALISTA */}
        <div className="aspect-[3/4] bg-zinc-900 border border-zinc-800 flex items-center justify-center relative overflow-hidden group">
          <span className="text-zinc-700 font-mono text-sm tracking-widest uppercase rotate-90 absolute -right-8">Heavyweight 260gsm</span>
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center mix-blend-luminosity opacity-80 group-hover:opacity-100 transition-opacity duration-700"></div>
        </div>

        {/* LADO DIREITO: ENGENHARIA PSICOLÓGICA */}
        <div className="flex flex-col justify-center space-y-10">
          
          <div className="space-y-4">
            <span className="text-[10px] border border-zinc-700 px-3 py-1 uppercase tracking-widest text-zinc-400 font-mono">
              [ Lote Zero • Tiragem Restrita ]
            </span>
            <h1 className="text-4xl lg:text-5xl font-serif uppercase tracking-wider text-white leading-tight">
              Camiseta Boxy <br/><span className="text-zinc-500">Heavyweight</span>
            </h1>
            <p className="text-2xl font-mono text-white">R$ 320,00</p>
          </div>

          <div className="space-y-3 border-l-2 border-zinc-800 pl-4">
            <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
              Construção arquitetônica em algodão 260gsm. Desenvolvida não para a próxima estação, mas para a próxima década. Caimento encorpado que impõe presença sem ostentação.
            </p>
            {/* ANCORAGEM DE REDUÇÃO DE FRICÇÃO */}
            <p className="text-[11px] text-emerald-500 font-mono font-bold uppercase tracking-wide">
              ✦ Garantia White Glove: Primeira troca por tamanho 100% por nossa conta.
            </p>
          </div>

          {/* SELETOR DE TAMANHOS */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Arquitetura de Tamanho</span>
              <button className="text-[10px] text-zinc-400 underline uppercase font-mono hover:text-white transition-colors">Guia de Medidas</button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(stock).map(([size, qty]) => (
                <button
                  key={size}
                  onClick={() => handleSizeClick(size, qty)}
                  className={`py-3 text-sm font-mono border transition-all ${
                    qty === 0 
                      ? 'border-zinc-900 bg-zinc-900/30 text-zinc-600 line-through cursor-not-allowed'
                      : selectedSize === size 
                        ? 'border-white bg-white text-black font-bold'
                        : 'border-zinc-800 text-zinc-400 hover:border-zinc-500'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            
            {/* MICRO-COPY DINÂMICO PARA ESCASSEZ */}
            <div className="h-4">
              {selectedSize && stock[selectedSize as keyof typeof stock] === 0 && (
                <span className="text-[10px] text-amber-500 font-mono uppercase tracking-widest block animate-pulse">
                  [ LOTE ABSORVIDO ] • Registramos seu interesse.
                </span>
              )}
              {selectedSize && stock[selectedSize as keyof typeof stock] > 0 && stock[selectedSize as keyof typeof stock] <= 5 && (
                <span className="text-[10px] text-emerald-500 font-mono uppercase tracking-widest block">
                  Disponibilidade Crítica • Estoque Confirmado.
                </span>
              )}
            </div>
          </div>

          {/* BOTÃO DE CHECKOUT PSICOLÓGICO */}
          <button
            onClick={handleCheckout}
            disabled={!selectedSize || stock[selectedSize as keyof typeof stock] === 0}
            className={`w-full py-5 text-sm uppercase tracking-widest font-bold transition-all ${
              !selectedSize || stock[selectedSize as keyof typeof stock] === 0
                ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            {selectedSize && stock[selectedSize as keyof typeof stock] === 0 
              ? '[ INDISPONÍVEL ]' 
              : '[ GARANTIR POSSE ]'}
          </button>
        </div>

      </div>
    </main>
  );
}