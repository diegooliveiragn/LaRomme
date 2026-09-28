'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { playHapticSound } from '@/lib/sound';

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  // FORMULÁRIO DE ENTREGA
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');

  const handleFinishPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    playHapticSound();
    setLoading(true);

    setTimeout(() => {
      localStorage.setItem('lr_last_order', JSON.stringify({
        orderNumber: `LR-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName: fullName,
        email,
        total: 320.00,
        item: 'Camiseta Boxy Heavyweight (Preta)',
        serial: `LR-D00-BOXY-${Math.floor(1000 + Math.random() * 9000)}`
      }));
      router.push('/checkout/sucesso');
    }, 1200);
  };

  const handleCopyPix = () => {
    playHapticSound();
    navigator.clipboard.writeText('00020126580014BR.GOV.BCB.PIX0136laromme-pix-chave-aleatoria-mock5204000053039865405320.005802BR5915LaRomme%20Brand6009Sao%20Paulo62070503***6304E2D1');
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER LIMPO */}
        <div className="border-b border-zinc-800 pb-6 flex justify-between items-end font-mono">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">LaRomme / Arquivo</span>
            <h1 className="text-xl font-serif uppercase tracking-widest mt-1">Checkout de Aquisição</h1>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-3 py-1 rounded">
            ✦ LOTE ZERO • RESERVA ATIVA
          </span>
        </div>

        <form onSubmit={handleFinishPurchase} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUNA 1 & 2: DADOS DE ENTREGA */}
          <div className="lg:col-span-2 space-y-6 bg-[#0d0d10] border border-zinc-800 p-6 rounded-lg">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 border-b border-zinc-800 pb-3">
              1. Identificação e Endereço de Entrega
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Nome Completo</label>
                <input type="text" required placeholder="Seu nome completo" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-black border border-zinc-800 px-3 py-2.5 text-xs text-white outline-none focus:border-white transition-colors" />
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">E-mail para Rastreio</label>
                <input type="email" required placeholder="seu.email@dominio.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-zinc-800 px-3 py-2.5 text-xs text-white outline-none focus:border-white transition-colors" />
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">CPF (Nota Fiscal)</label>
                <input type="text" required placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} className="w-full bg-black border border-zinc-800 px-3 py-2.5 text-xs text-white outline-none focus:border-white transition-colors" />
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">WhatsApp / Telefone</label>
                <input type="tel" required placeholder="(11) 99999-0000" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-black border border-zinc-800 px-3 py-2.5 text-xs text-white outline-none focus:border-white transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">CEP</label>
                <input type="text" required placeholder="00000-000" value={cep} onChange={(e) => setCep(e.target.value)} className="w-full bg-black border border-zinc-800 px-3 py-2.5 text-xs text-white outline-none focus:border-white transition-colors" />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Endereço com Número e Bairro</label>
                <input type="text" required placeholder="Rua, número, complemento" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-black border border-zinc-800 px-3 py-2.5 text-xs text-white outline-none focus:border-white transition-colors" />
              </div>
            </div>
          </div>

          {/* COLUNA 3: RESUMO E PAGAMENTO PIX */}
          <div className="space-y-6">
            <div className="bg-[#0d0d10] border border-zinc-800 p-6 rounded-lg space-y-6">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 border-b border-zinc-800 pb-3">
                2. Resumo da Reserva
              </h2>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between text-zinc-300">
                  <span>Camiseta Boxy Heavyweight</span>
                  <span className="font-bold text-white">R$ 320,00</span>
                </div>
                <div className="flex justify-between text-zinc-500 text-[10px]">
                  <span>Frete Expresso White Glove</span>
                  <span className="text-emerald-400 uppercase font-bold">GRÁTIS</span>
                </div>
                <div className="border-t border-zinc-800 pt-3 flex justify-between text-sm">
                  <span className="font-bold text-white">TOTAL</span>
                  <span className="font-bold text-emerald-400">R$ 320,00</span>
                </div>
              </div>

              {/* ÁREA DE PAGAMENTO PIX INSTANTÂNEO */}
              <div className="bg-black border border-zinc-800 p-4 rounded space-y-3 font-mono text-center">
                <span className="text-[10px] text-zinc-400 uppercase block font-bold">Pagamento Instantâneo via Pix</span>
                <button type="button" onClick={handleCopyPix} className="w-full bg-zinc-900 border border-zinc-700 text-zinc-200 text-[10px] py-2 rounded hover:bg-zinc-800 transition-colors uppercase">
                  {copiedPix ? '✓ Chave Pix Copiada!' : '[ Copiar Chave Pix ]'}
                </button>
              </div>

              {/* BOTÃO UTILITÁRIO "ZERO DÚVIDA" */}
              <div className="space-y-2 pt-2">
                <span className="text-[9px] text-zinc-500 font-mono text-center block uppercase tracking-wider">
                  ✦ Garantia de Serial Numérico Gravado
                </span>

                <button
                  type="submit"
                  disabled={loading}
                  onClick={playHapticSound}
                  className="w-full bg-white text-black font-mono font-bold text-xs uppercase tracking-widest py-4 hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  {loading ? '[ CONFIRMANDO RESERVA... ]' : '[ FINALIZAR COMPRA VIA PIX ]'}
                </button>
              </div>

            </div>
          </div>

        </form>

      </div>
    </main>
  );
}