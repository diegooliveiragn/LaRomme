'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ContaPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isCeo, setIsCeo] = useState(false);
  const [activeTab, setActiveTab] = useState<'posse' | 'rastreio' | 'garantia' | 'cofre'>('posse');
  const [exchangeRequested, setExchangeRequested] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('lr_user_email');
    const savedCeo = localStorage.getItem('lr_ceo_mode') === 'true';

    if (!savedEmail) {
      setUserEmail('membro.vip@laromme.com');
    } else {
      setUserEmail(savedEmail);
      setIsCeo(savedCeo);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('lr_user_email');
    localStorage.removeItem('lr_ceo_mode');
    router.push('/acesso');
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 px-4 sm:px-8 pb-20 font-mono selection:bg-emerald-500 selection:text-black">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER DO PERFIL VIP */}
        <div className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded font-bold">
                MEMBRO SENADO VIP
              </span>
              {isCeo && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/50 px-2.5 py-0.5 rounded font-bold">
                  FOUNDER MASTER
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif uppercase tracking-widest text-white">
              {isCeo ? 'Diego Oliveira' : 'Membro Exclusivo'}
            </h1>
            <p className="text-xs text-zinc-500">{userEmail}</p>
          </div>

          <div className="flex gap-3">
            {isCeo && (
              <button
                onClick={() => router.push('/cortex')}
                className="bg-amber-500 text-black text-xs font-bold px-4 py-2 uppercase tracking-widest hover:bg-amber-400 transition-colors"
              >
                [ CÓRTEX OS ]
              </button>
            )}
            <button
              onClick={handleLogout}
              className="border border-zinc-800 text-zinc-400 text-xs px-4 py-2 uppercase hover:text-white hover:border-zinc-600 transition-colors"
            >
              [ SAIR ]
            </button>
          </div>
        </div>

        {/* NAVEGAÇÃO INTERNA */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-900 pb-4">
          {[
            { id: 'posse', label: '1. CERTIFICADO DE POSSE' },
            { id: 'rastreio', label: '2. EXPEDIÇÃO MILITAR' },
            { id: 'garantia', label: '3. GARANTIA WHITE GLOVE' },
            { id: 'cofre', label: '4. COFRE DE DROPS' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs uppercase tracking-wider border transition-colors ${
                activeTab === tab.id
                  ? 'border-white bg-white text-black font-bold'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ABA 1: CERTIFICADO DE POSSE */}
        {activeTab === 'posse' && (
          <div className="bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg space-y-6">
            <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Série Limitada Autêntica</span>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider mt-1">Camiseta Boxy Heavyweight</h2>
                <span className="text-xs text-emerald-400 block mt-1">Lote Zero • Coleção ORIGO / 01</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-300 border border-amber-500/40 bg-amber-950/30 px-3 py-1.5 rounded uppercase block">
                  LR-D00-BOXY-0042
                </span>
                <span className="text-[9px] text-zinc-500 block mt-1">Serial Único Registrado</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800">
                <span className="text-zinc-500 block">Tamanho Reservado</span>
                <span className="text-sm font-bold text-white">Tamanho M (Heavyweight 260gsm)</span>
              </div>
              <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800">
                <span className="text-zinc-500 block">Data de Adquirição</span>
                <span className="text-sm font-bold text-white">27 de Setembro de 2026</span>
              </div>
              <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800">
                <span className="text-zinc-500 block">Canal Oficial</span>
                <a href="https://instagram.com/uselaromme" target="_blank" rel="noreferrer" className="text-sm font-bold text-emerald-400 underline">
                  @uselaromme
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: EXPEDIÇÃO MILITAR */}
        {activeTab === 'rastreio' && (
          <div className="bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Status do Envio (Pedido #LR-82001)</h2>
            
            <div className="space-y-6 relative border-l-2 border-zinc-800 pl-6 ml-2">
              <div className="relative">
                <span className="w-3 h-3 bg-emerald-500 rounded-full absolute -left-[31px] top-1 shadow-[0_0_8px_#10b981]"></span>
                <p className="text-xs font-bold text-emerald-400 uppercase">1. Pagamento Aprovado & Confirmado</p>
                <span className="text-[10px] text-zinc-500">Liquidação via Mercado Pago OK</span>
              </div>

              <div className="relative">
                <span className="w-3 h-3 bg-emerald-500 rounded-full absolute -left-[31px] top-1 shadow-[0_0_8px_#10b981]"></span>
                <p className="text-xs font-bold text-white uppercase">2. Em Separação White Glove no HQ</p>
                <span className="text-[10px] text-zinc-500">Embalagem especial + Perfumação + Tag Serial</span>
              </div>

              <div className="relative opacity-50">
                <span className="w-3 h-3 bg-zinc-700 rounded-full absolute -left-[31px] top-1"></span>
                <p className="text-xs font-bold text-zinc-400 uppercase">3. Despachado para Envio (Código Rastreio)</p>
                <span className="text-[10px] text-zinc-600">Aguardando Coleta dos Correios/Jadlog</span>
              </div>
            </div>
          </div>
        )}

        {/* ABA 3: GARANTIA WHITE GLOVE (TROCA 1-CLIQUE) */}
        {activeTab === 'garantia' && (
          <div className="bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg space-y-6">
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Garantia Absoluta de Caimento</h2>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                Se a sua peça do Lote Zero não vestir exatamente como você planejou, a primeira troca de tamanho é 100% por nossa conta, sem burocracias ou formulários extensos.
              </p>
            </div>

            {exchangeRequested ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 space-y-1">
                <p className="font-bold">✦ Solicitação Registrada com Sucesso.</p>
                <p className="text-[11px] text-zinc-400">Nossa equipe de Concierge entrará em contato via WhatsApp nas próximas horas com a etiqueta reversa pré-paga.</p>
              </div>
            ) : (
              <button
                onClick={() => setExchangeRequested(true)}
                className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
              >
                [ SOLICITAR TROCA WHITE GLOVE EM 1-CLIQUE ]
              </button>
            )}
          </div>
        )}

        {/* ABA 4: COFRE DE DROPS SECRETOS */}
        {activeTab === 'cofre' && (
          <div className="bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg space-y-4">
            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/50 px-2.5 py-0.5 rounded font-bold uppercase">
              EXCLUSIVO SENADO VIP
            </span>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Próximo Lançamento: DROP 01</h2>
            <p className="text-xs text-zinc-400 max-w-lg leading-relaxed">
              Membros cadastrados com o Lote Zero recebem acesso liberado 2 horas antes da abertura oficial do site ao público geral.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}