'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { playHapticSound } from '@/lib/sound';

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
      // 1. UPSERT CLIENTE
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

      // 2. CHAMA A API PARA GERAR O PIX E O PEDIDO PENDENTE
      const orderNumber = `LR-${Math.floor(100000 + Math.random() * 900000)}`;
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName, email, cpf, totalAmount: 320.00, orderNumber, customerId, state
        })
      });
      const data = await response.json();

      if (data.success) {
        setPixData(data.pixCopiaECola);
        // Salva mock para a tela de sucesso enquanto o webhook processa
        localStorage.setItem('lr_last_order', JSON.stringify({
          orderNumber, customerName: fullName, email, total: 320.00,
          item: 'Camiseta Boxy Heavyweight (Preta)', serial: 'Processando...'
        }));
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao processar reserva. Tente novamente.");
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
    <main className="min-h-screen bg-[#050505] text-white font-sans py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="border-b border-zinc-800 pb-6 flex justify-between items-end font-mono">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">LaRomme / Arquivo</span>
            <h1 className="text-xl font-serif uppercase tracking-widest mt-1">Checkout de Aquisição</h1>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-3 py-1 rounded">
            ✦ LOTE ZERO • RESERVA ATIVA
          </span>
        </div>

        <form onSubmit={handleGeneratePix} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6 bg-[#0d0d10] border border-zinc-800 p-6 rounded-lg">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 border-b border-zinc-800 pb-3">1. Identificação e Entrega</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Nome Completo</label>
                <input type="text" required placeholder="Seu nome completo" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={!!pixData} className="w-full bg-black border border-zinc-800 px-3 py-2.5 text-xs text-white outline-none focus:border-white transition-colors" />
              </div>
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">E-mail para Rastreio</label>
                <input type="email" required placeholder="seu.email@dominio.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!!pixData} className="w-full bg-black border border-zinc-800 px-3 py-2.5 text-xs text-white outline-none focus:border-white transition-colors" />
              </div>
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">CPF (Nota Fiscal)</label>
                <input type="text" required placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} disabled={!!pixData} className="w-full bg-black border border-zinc-800 px-3 py-2.5 text-xs text-white outline-none focus:border-white transition-colors" />
              </div>
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">WhatsApp / Telefone</label>
                <input type="tel" required placeholder="(11) 99999-0000" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!!pixData} className="w-full bg-black border border-zinc-800 px-3 py-2.5 text-xs text-white outline-none focus:border-white transition-colors" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">CEP</label>
                <input type="text" required placeholder="00000-000" value={cep} onChange={(e) => setCep(e.target.value)} disabled={!!pixData} className="w-full bg-black border border-zinc-800 px-3 py-2.5 text-xs text-white outline-none focus:border-white transition-colors" />
              </div>
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Cidade</label>
                <input type="text" required placeholder="Sua cidade" value={city} onChange={(e) => setCity(e.target.value)} disabled={!!pixData} className="w-full bg-black border border-zinc-800 px-3 py-2.5 text-xs text-white outline-none focus:border-white transition-colors" />
              </div>
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Estado (UF)</label>
                <select value={state} onChange={(e) => setState(e.target.value)} disabled={!!pixData} className="w-full bg-black border border-zinc-800 px-3 py-2.5 text-xs text-white outline-none focus:border-white transition-colors">
                  <option value="SP">SP</option><option value="RJ">RJ</option><option value="PR">PR</option><option value="SC">SC</option><option value="MG">MG</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Endereço com Número e Bairro</label>
                <input type="text" required placeholder="Rua, número, bairro" value={address} onChange={(e) => setAddress(e.target.value)} disabled={!!pixData} className="w-full bg-black border border-zinc-800 px-3 py-2.5 text-xs text-white outline-none focus:border-white transition-colors" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0d0d10] border border-zinc-800 p-6 rounded-lg space-y-6">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 border-b border-zinc-800 pb-3">2. Pagamento Pix</h2>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between text-zinc-300"><span>Camiseta Boxy Heavyweight</span><span className="font-bold text-white">R$ 320,00</span></div>
                <div className="border-t border-zinc-800 pt-3 flex justify-between text-sm"><span className="font-bold text-white">TOTAL</span><span className="font-bold text-emerald-400">R$ 320,00</span></div>
              </div>

              {!pixData ? (
                <div className="space-y-2 pt-2">
                  <button type="submit" disabled={loading} className="w-full bg-white text-black font-mono font-bold text-xs uppercase tracking-widest py-4 hover:bg-zinc-200 transition-colors disabled:opacity-50">
                    {loading ? '[ GERANDO COBRANÇA... ]' : '[ FINALIZAR COMPRA VIA PIX ]'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in pt-4 border-t border-zinc-800">
                  <div className="bg-black border border-amber-900/50 p-4 rounded text-center space-y-3">
                    <span className="text-[10px] text-amber-400 uppercase block font-bold">Chave Pix Gerada</span>
                    <button type="button" onClick={handleCopyPix} className="w-full bg-zinc-900 border border-zinc-700 text-zinc-200 text-[10px] py-3 rounded hover:bg-zinc-800 transition-colors uppercase font-mono font-bold">
                      {copiedPix ? '✓ Chave Pix Copiada!' : '[ Copiar Chave Pix ]'}
                    </button>
                    <p className="text-[9px] text-zinc-500 font-mono">Abra seu aplicativo do banco, escolha "Pix Copia e Cola" e confirme o pagamento.</p>
                  </div>

                  <button type="button" onClick={handleConfirmPayment} className="w-full bg-emerald-500 text-black font-mono font-bold text-xs uppercase tracking-widest py-4 hover:bg-emerald-400 transition-colors">
                    [ JÁ REALIZEI O PAGAMENTO ]
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