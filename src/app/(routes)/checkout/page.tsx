'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { playHapticSound } from '@/lib/sound';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<string | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');

  const handleGeneratePix = async (e: React.FormEvent) => {
    e.preventDefault();
    playHapticSound();
    setLoading(true);

    try {
      let customerId = null;
      const { data: extCustomer } = await supabase.from('customers').select('id').eq('email', email).single();
      
      if (extCustomer) {
        customerId = extCustomer.id;
        await supabase.from('customers').update({ full_name: fullName, phone, city, state }).eq('id', customerId);
      } else {
        const { data: newCustomer } = await supabase.from('customers').insert([{
          full_name: fullName, email, phone, city, state, rfm_tag: 'NEWBIE', total_purchases: 0, ltv: 0
        }]).select('id').single();
        if (newCustomer) customerId = newCustomer.id;
      }

      const orderNumber = `LR-${Math.floor(100000 + Math.random() * 900000)}`;
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, cpf, totalAmount: 320.00, orderNumber, customerId, state })
      });
      const data = await response.json();

      if (data.success) {
        setPixData(data.pixCopiaECola);
        localStorage.setItem('lr_last_order', JSON.stringify({
          orderNumber, customerName: fullName, email, total: 320.00,
          item: 'Camiseta Boxy Heavyweight', serial: 'Aguardando Liquidação'
        }));
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao processar aquisição. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPix = () => {
    playHapticSound();
    if (pixData) {
      navigator.clipboard.writeText(pixData);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3000);
    }
  };

  const handleConfirmPayment = () => {
    playHapticSound();
    router.push('/checkout/sucesso');
  };

  return (
    <main className="min-h-[100dvh] bg-black text-white font-sans flex flex-col items-center">
      
      <header className="w-full px-6 pt-14 pb-6 flex justify-between items-center max-w-4xl mx-auto border-b border-zinc-900">
        <Link href="/" onClick={playHapticSound} className="font-serif text-xl tracking-widest text-white hover:text-zinc-300 transition-colors">
          LaRomme.
        </Link>
        <span className="text-[10px] md:text-xs font-sans uppercase tracking-widest text-zinc-500">
          Aquisição Segura
        </span>
      </header>

      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-serif uppercase tracking-widest text-white">
            Finalizar Aquisição
          </h1>
          <p className="text-[11px] text-zinc-500 font-sans tracking-widest uppercase mt-2">
            Lote Zero • Envio via Logística Premium
          </p>
        </div>

        <form onSubmit={handleGeneratePix} className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          
          <div className="lg:col-span-3 space-y-10">
            <div className="space-y-6">
              <h2 className="text-xs font-sans uppercase tracking-widest text-zinc-300 border-b border-zinc-900 pb-3">
                1. Identificação
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" required placeholder="Nome Completo" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={!!pixData} className="w-full bg-[#050505] border border-zinc-800/80 px-4 py-3.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors" />
                <input type="email" required placeholder="E-mail (Rastreio)" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!!pixData} className="w-full bg-[#050505] border border-zinc-800/80 px-4 py-3.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors" />
                <input type="text" required placeholder="CPF (Nota Fiscal)" value={cpf} onChange={(e) => setCpf(e.target.value)} disabled={!!pixData} className="w-full bg-[#050505] border border-zinc-800/80 px-4 py-3.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors" />
                <input type="tel" required placeholder="WhatsApp / Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!!pixData} className="w-full bg-[#050505] border border-zinc-800/80 px-4 py-3.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors" />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xs font-sans uppercase tracking-widest text-zinc-300 border-b border-zinc-900 pb-3">
                2. Destino
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" required placeholder="CEP" value={cep} onChange={(e) => setCep(e.target.value)} disabled={!!pixData} className="w-full bg-[#050505] border border-zinc-800/80 px-4 py-3.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors" />
                <input type="text" required placeholder="Cidade" value={city} onChange={(e) => setCity(e.target.value)} disabled={!!pixData} className="w-full bg-[#050505] border border-zinc-800/80 px-4 py-3.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors" />
                <select value={state} onChange={(e) => setState(e.target.value)} disabled={!!pixData} className="w-full bg-[#050505] border border-zinc-800/80 px-4 py-3.5 text-xs text-white outline-none focus:border-zinc-500 transition-colors">
                  <option value="CE">CE</option><option value="SP">SP</option><option value="RJ">RJ</option><option value="PR">PR</option><option value="MG">MG</option>
                </select>
                <div className="md:col-span-3">
                  <input type="text" required placeholder="Endereço, Número e Complemento" value={address} onChange={(e) => setAddress(e.target.value)} disabled={!!pixData} className="w-full bg-[#050505] border border-zinc-800/80 px-4 py-3.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors" />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-[#070707] border border-zinc-900 p-6 md:p-8 space-y-8 sticky top-24">
              <h2 className="text-xs font-sans uppercase tracking-widest text-zinc-300 border-b border-zinc-800 pb-3">
                3. Liquidação
              </h2>

              <div className="space-y-4 font-sans text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Vestigium • Camiseta Boxy</span>
                  <span className="text-white">R$ 320,00</span>
                </div>
                <div className="border-t border-zinc-800 pt-4 flex justify-between text-sm">
                  <span className="font-bold text-white uppercase tracking-widest">Total</span>
                  <span className="font-bold text-white">R$ 320,00</span>
                </div>
              </div>

              {!pixData ? (
                <button type="submit" disabled={loading} className="w-full bg-white text-black font-sans font-bold text-[10px] uppercase tracking-widest py-4 hover:bg-zinc-200 transition-colors disabled:opacity-50">
                  {loading ? 'Processando Autenticação...' : 'Gerar Chave Pix'}
                </button>
              ) : (
                <div className="space-y-4 animate-in fade-in pt-6 border-t border-zinc-800">
                  <div className="space-y-2 text-center">
                    <span className="text-[10px] text-emerald-400 uppercase tracking-widest block font-bold">Autenticado com Sucesso</span>
                    <p className="text-[10px] text-zinc-500">Utilize o botão abaixo para copiar o código e efetuar a liquidação no aplicativo do seu banco.</p>
                  </div>
                  
                  <button type="button" onClick={handleCopyPix} className="w-full bg-zinc-900 border border-zinc-700 text-white text-[10px] py-4 hover:bg-zinc-800 transition-colors uppercase tracking-widest">
                    {copiedPix ? '✓ Código Copiado' : 'Copiar Código Pix'}
                  </button>

                  <button type="button" onClick={handleConfirmPayment} className="w-full bg-white text-black font-sans font-bold text-[10px] uppercase tracking-widest py-4 hover:bg-zinc-200 transition-colors mt-2">
                    Já efetuei a liquidação
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}