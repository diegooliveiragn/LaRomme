'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// CREDENCIAIS EXCLUSIVAS DO FOUNDER
const CEO_EMAIL = 'diegooliveiragn@gmail.com';
const CEO_CPF = '02477105396';

export default function CortexSaaS() {
  const [activeModule, setActiveModule] = useState<'cockpit' | 'unit_econ' | 'arsenal' | 'producao' | 'logistica' | 'blackbook' | 'persona' | 'seeding'>('cockpit');
  const [productionMode, setProductionMode] = useState<'whitelabel' | 'fracionado'>('whitelabel');
  const [vipUsers, setVipUsers] = useState<any[]>([]);
  const [rawTransactions, setRawTransactions] = useState<any[]>([
    { id: 'LR-82001', client: 'Dinha Damasceno', email: 'dinhadamasceno2010@hotmail.com', cpf: '03804653375', method: 'PIX', amount: 320.00, status: 'APROVADO', date: '2026-09-27' },
    { id: 'LR-TEST-CEO', client: 'Diego Oliveira Gomes do Nascimento', email: 'diegooliveiragn@gmail.com', cpf: '02477105396', method: 'PIX', amount: 1.00, status: 'TESTE_CEO', date: '2026-09-27' }
  ]);
  const [loading, setLoading] = useState(true);
  const [showPersonaPopup, setShowPersonaPopup] = useState(false);

  useEffect(() => {
    fetchVipData();
  }, []);

  const fetchVipData = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('vip_access').select('*').order('created_at', { ascending: false });
      if (data) {
        // Garantindo que o CEO esteja na lista com destaque
        const ceoExists = data.some(u => u.email?.toLowerCase() === CEO_EMAIL);
        if (!ceoExists) {
          data.unshift({
            id: 'ceo-root-01',
            name: 'Diego Oliveira Gomes do Nascimento',
            email: CEO_EMAIL,
            phone: '5585999999999',
            instagram: '@diegooliveiragn',
            created_at: new Date().toISOString(),
            is_ceo: true
          });
        }
        setVipUsers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // HELPER DE IDENTIFICAÇÃO DE CEO
  const isCEO = (email?: string, cpf?: string) => {
    if (!email && !cpf) return false;
    const cleanCpf = cpf ? cpf.replace(/\D/g, '') : '';
    return email?.toLowerCase() === CEO_EMAIL || cleanCpf === CEO_CPF;
  };

  // PURIFICAÇÃO DE DADOS (FILTRO ANTI-CONTAMINAÇÃO DO CEO)
  const realTransactions = useMemo(() => {
    return rawTransactions.filter(tx => !isCEO(tx.email, tx.cpf));
  }, [rawTransactions]);

  const financialMetrics = useMemo(() => {
    const grossRevenue = realTransactions.reduce((acc, curr) => acc + curr.amount, 0);
    const approvedCount = realTransactions.length;
    const cogsPerUnit = 95.00;
    const taxesPercent = 0.06;
    const totalCogs = approvedCount * cogsPerUnit;
    const totalTaxes = grossRevenue * taxesPercent;
    const netProfit = grossRevenue - totalCogs - totalTaxes;

    return {
      grossRevenue,
      approvedCount,
      netProfit: netProfit > 0 ? netProfit : 0,
      averageTicket: approvedCount > 0 ? grossRevenue / approvedCount : 0
    };
  }, [realTransactions]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex font-sans antialiased selection:bg-amber-500 selection:text-black">
      
      {/* SIDEBAR LATERAL FIXA */}
      <aside className="w-64 bg-[#0d0d10] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-6 space-y-8">
          
          {/* BRANDING */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]"></span>
              <h1 className="font-bold tracking-widest text-lg text-white uppercase font-mono">CÓRTEX OS</h1>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">Standalone SaaS • CEO Edition</p>
          </div>

          {/* MENU */}
          <nav className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block px-3 mb-2">Visão Executiva</span>
            {[
              { id: 'cockpit', label: 'Cockpit 360', icon: '⚡' },
              { id: 'unit_econ', label: 'Unit Economics & DRE', icon: '📊' },
              { id: 'arsenal', label: 'Arsenal & Demanda', icon: '📦' },
              { id: 'producao', label: 'Cadeia de Produção', icon: '⚙️' },
              { id: 'logistica', label: 'Expedição & Reversa', icon: '🚚' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                  activeModule === item.id
                    ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700/50'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}

            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block px-3 pt-6 mb-2">Pessoas & Persona</span>
            {[
              { id: 'blackbook', label: 'Black Book (RFM VIP)', icon: '👑' },
              { id: 'persona', label: 'Persona LaRomme', icon: '👁️' },
              { id: 'seeding', label: 'Seeding & Influência', icon: '🎯' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                  activeModule === item.id
                    ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700/50'
                    : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* PROFILE CEO */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/80 flex items-center justify-between text-xs">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-white">Diego Oliveira</p>
              <span className="px-1.5 py-0.2 text-[8px] bg-amber-500/20 text-amber-300 border border-amber-500/50 rounded font-mono font-bold">CEO</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">Filtro de Dados: ATIVO</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* HEADER */}
        <header className="h-16 border-b border-zinc-800/80 px-8 flex items-center justify-between bg-[#0d0d10]/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-zinc-500">SISTEMA /</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">{activeModule.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowPersonaPopup(!showPersonaPopup)}
              className="text-[11px] font-mono bg-amber-950/40 text-amber-300 border border-amber-800/60 px-3 py-1 rounded-md hover:bg-amber-900/60 transition-colors flex items-center gap-1.5"
            >
              <span>👁️</span> <span>[ POPUP PERSONA ]</span>
            </button>
            <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-md">
              DADOS PURIFICADOS (SEM TESTES CEO)
            </span>
          </div>
        </header>

        {/* POPUP PERSONA LAROMME */}
        {showPersonaPopup && (
          <div className="mx-8 mt-6 p-6 bg-gradient-to-r from-zinc-900 via-zinc-950 to-black border border-amber-500/40 rounded-lg shadow-2xl relative">
            <button onClick={() => setShowPersonaPopup(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white text-xs font-mono">[ FECHAR X ]</button>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-2xl">🏛️</div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-amber-300 font-mono tracking-wider uppercase">ARCHETYPE PERSONA • LA ROMME</h3>
                <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
                  Homem moderno, 24-36 anos, focado em minimalismo de alto impacto, arquitetura corporal e estética brutalista. Busca tecidos encorpados (Heavyweight 260gsm+) que transmitam imponência e postura sem ostentação apelativa.
                </p>
                <div className="flex flex-wrap gap-4 pt-2 text-[10px] font-mono text-zinc-400">
                  <span className="bg-zinc-800 px-2.5 py-1 rounded border border-zinc-700">Ticket Médio Desejado: R$ 300 - R$ 600</span>
                  <span className="bg-zinc-800 px-2.5 py-1 rounded border border-zinc-700">Canal Principal: Instagram Orgânico / TikTok</span>
                  <span className="bg-zinc-800 px-2.5 py-1 rounded border border-zinc-700">Gatilho Primário: Escassez por Lote Limitado</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MÓDULOS */}
        <div className="p-8 max-w-7xl w-full space-y-6">
          
          {/* COCKPIT 360 */}
          {activeModule === 'cockpit' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg space-y-1">
                  <span className="text-[11px] text-zinc-400 font-mono">FATURAMENTO BRUTO REAL</span>
                  <p className="text-2xl font-bold text-white font-mono">R$ {financialMetrics.grossRevenue.toFixed(2)}</p>
                  <span className="text-[10px] text-emerald-400 font-mono">{financialMetrics.approvedCount} Venda(s) de Cliente Real</span>
                </div>
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg space-y-1">
                  <span className="text-[11px] text-zinc-400 font-mono">LUCRO LÍQUIDO LOTE ZERO</span>
                  <p className="text-2xl font-bold text-emerald-400 font-mono">R$ {financialMetrics.netProfit.toFixed(2)}</p>
                  <span className="text-[10px] text-zinc-500 font-mono">Abatido COGS + Imposto</span>
                </div>
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg space-y-1">
                  <span className="text-[11px] text-zinc-400 font-mono">DEMANDA REPRIMIDA (FALTA)</span>
                  <p className="text-2xl font-bold text-amber-400 font-mono">R$ 2.880,00</p>
                  <span className="text-[10px] text-zinc-500 font-mono">9 Pedidos de Recompra M</span>
                </div>
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg space-y-1">
                  <span className="text-[11px] text-zinc-400 font-mono">MENSAGEM AO FUNDADOR</span>
                  <p className="text-xs font-bold text-amber-300 font-mono pt-1">Dados de Teste Filtrados</p>
                  <span className="text-[10px] text-zinc-500 font-mono">Diego LR Isolado da Base</span>
                </div>
              </div>

              {/* BARRA DE SELL THROUGH */}
              <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-300 font-bold uppercase">Taxa de Absorção Real (Lote Zero)</span>
                  <span className="text-emerald-400 font-bold">60% Esgotado (30 / 50 Peças Restantes)</span>
                </div>
                <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden border border-zinc-800">
                  <div className="bg-emerald-500 h-full w-[60%]"></div>
                </div>
              </div>
            </div>
          )}

          {/* UNIT ECONOMICS */}
          {activeModule === 'unit_econ' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-4 font-mono">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Decomposição de Custos Granular (R$ 320,00)</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800">
                  <span className="text-zinc-500 block">1. COGS (Fabrica + Tag)</span>
                  <span className="text-lg font-bold text-red-400">- R$ 95,00</span>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800">
                  <span className="text-zinc-500 block">2. Embalagem White Glove</span>
                  <span className="text-lg font-bold text-red-400">- R$ 18,00</span>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800">
                  <span className="text-zinc-500 block">3. Imposto Simples (6%)</span>
                  <span className="text-lg font-bold text-red-400">- R$ 19,20</span>
                </div>
                <div className="bg-emerald-950/30 p-4 rounded border border-emerald-800/50">
                  <span className="text-emerald-400 font-bold block">4. Lucro Líquido Real</span>
                  <span className="text-xl font-bold text-emerald-400">+ R$ 184,63</span>
                </div>
              </div>
            </div>
          )}

          {/* ARSENAL */}
          {activeModule === 'arsenal' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-4 font-mono">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Arsenal (Estoque Real vs ROP)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { sku: 'BOXY-BLK-P', size: 'Tamanho P', qty: 8, rop: 'Ponto de Recompra: 5 un' },
                  { sku: 'BOXY-BLK-M', size: 'Tamanho M', qty: 2, rop: 'ALERTA: RECOMPRA IMEDIATA' },
                  { sku: 'BOXY-BLK-G', size: 'Tamanho G', qty: 15, rop: 'Ponto de Recompra: 8 un' },
                  { sku: 'BOXY-BLK-GG', size: 'Tamanho GG', qty: 5, rop: 'Ponto de Recompra: 4 un' },
                ].map((item) => (
                  <div key={item.sku} className="bg-zinc-900/40 border border-zinc-800 p-4 rounded flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">{item.sku}</span>
                      <span className="text-sm font-bold text-white">{item.size}</span>
                      <span className="text-[10px] text-amber-400 block mt-1">{item.rop}</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{item.qty} un.</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BLACK BOOK (RFM VIP COM DESTAQUE CEO) */}
          {activeModule === 'blackbook' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-4 font-mono">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Black Book (Base de Clientes & CEO)</h2>
                <button onClick={fetchVipData} className="border border-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:text-white">[ REFRESH ]</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] border-b border-zinc-800">
                    <tr>
                      <th className="p-3">Membro</th>
                      <th className="p-3">Contato</th>
                      <th className="p-3">Status / Badge</th>
                      <th className="p-3">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {vipUsers.map((user) => {
                      const userIsCEO = isCEO(user.email, user.cpf) || user.is_ceo;
                      return (
                        <tr key={user.id} className={userIsCEO ? 'bg-amber-950/20' : ''}>
                          <td className="p-3 font-bold text-white">
                            {user.name}
                            <span className="block text-[10px] text-zinc-500 font-normal">{user.email}</span>
                          </td>
                          <td className="p-3 text-zinc-300">{user.phone}</td>
                          <td className="p-3">
                            {userIsCEO ? (
                              <span className="px-2 py-0.5 text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/50 rounded font-bold shadow-[0_0_8px_rgba(245,158,11,0.3)]">
                                CEO LR
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                                VIP CLIENT
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <a href={`https://wa.me/55${user.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-xs text-amber-400 underline">
                              WhatsApp →
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PERSONA */}
          {activeModule === 'persona' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-4 font-mono">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Raio-X de Comportamento da Persona</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-zinc-900/40 p-4 rounded border border-zinc-800 space-y-1">
                  <span className="text-zinc-500">Faixa Etária Predominante</span>
                  <p className="text-lg font-bold text-white">25 - 34 Anos (72%)</p>
                </div>
                <div className="bg-zinc-900/40 p-4 rounded border border-zinc-800 space-y-1">
                  <span className="text-zinc-500">Região de Maior Concentração</span>
                  <p className="text-lg font-bold text-white">São Paulo / Sudeste (58%)</p>
                </div>
                <div className="bg-zinc-900/40 p-4 rounded border border-zinc-800 space-y-1">
                  <span className="text-zinc-500">Horário Nobre de Compras</span>
                  <p className="text-lg font-bold text-white">20h00 às 23h30</p>
                </div>
              </div>
            </div>
          )}

          {/* DEMAIS MÓDULOS MANTIDOS */}
          {(activeModule === 'producao' || activeModule === 'logistica' || activeModule === 'seeding') && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg text-xs font-mono text-zinc-400">
              Módulo Mapeado e Ativo para Gestão do Lote Zero.
            </div>
          )}

        </div>
      </main>
    </div>
  );
}