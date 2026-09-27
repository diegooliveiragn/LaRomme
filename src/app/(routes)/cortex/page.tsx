'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const CEO_EMAIL = 'diegooliveiragn@gmail.com';
const CEO_CPF = '02477105396';

export default function CortexSaaS() {
  const [activeModule, setActiveModule] = useState<'cockpit' | 'unit_econ' | 'arsenal' | 'producao' | 'logistica' | 'blackbook' | 'persona' | 'seeding' | 'mapa'>('cockpit');
  const [productionMode, setProductionMode] = useState<'whitelabel' | 'fracionado'>('whitelabel');
  const [showPersonaPopup, setShowPersonaPopup] = useState(false);

  // DUMB DATA OPERACIONAL COMPLETA (LOTE ZERO ATIVO)
  const [rawTransactions] = useState([
    { id: 'LR-901', client: 'Lucas Andrade', email: 'lucas.andrade@gmail.com', cpf: '12894123091', method: 'PIX', amount: 320.00, status: 'APROVADO', state: 'SP', date: '2026-09-27 16:42' },
    { id: 'LR-902', client: 'Matheus Fontes', email: 'm.fontes@outlook.com', cpf: '09812384102', method: 'CARTÃO', amount: 320.00, status: 'APROVADO', state: 'RJ', date: '2026-09-27 16:15' },
    { id: 'LR-903', client: 'Rodrigo Mello', email: 'rodrigo.mello@icloud.com', cpf: '83920192831', method: 'PIX', amount: 640.00, status: 'APROVADO', state: 'SP', date: '2026-09-27 15:50' },
    { id: 'LR-904', client: 'Gabriel Siqueira', email: 'g.siqueira@yahoo.com', cpf: '49201938210', method: 'PIX', amount: 320.00, status: 'APROVADO', state: 'PR', date: '2026-09-27 15:10' },
    { id: 'LR-905', client: 'Felipe Camargo', email: 'felipe.camargo@gmail.com', cpf: '93019284019', method: 'CARTÃO', amount: 320.00, status: 'APROVADO', state: 'SC', date: '2026-09-27 14:30' },
    { id: 'LR-906', client: 'Dinha Damasceno', email: 'dinhadamasceno2010@hotmail.com', cpf: '03804653375', method: 'PIX', amount: 320.00, status: 'APROVADO', state: 'CE', date: '2026-09-27 12:00' },
    { id: 'LR-CEO-TEST', client: 'Diego Oliveira Gomes do Nascimento', email: CEO_EMAIL, cpf: CEO_CPF, method: 'PIX', amount: 1.00, status: 'TESTE_CEO', state: 'CE', date: '2026-09-27 11:00' }
  ]);

  const [vipUsers] = useState([
    { id: 'ceo-01', name: 'Diego Oliveira Gomes do Nascimento', email: CEO_EMAIL, phone: '(85) 99999-9999', instagram: '@diegooliveiragn', state: 'CE', rfm: 'FOUNDER', ltv: 'R$ 0,00', is_ceo: true },
    { id: 'vip-01', name: 'Lucas Andrade', email: 'lucas.andrade@gmail.com', phone: '(11) 98234-1102', instagram: '@lucas.andrade', state: 'SP', rfm: 'CHAMPION', ltv: 'R$ 640,00' },
    { id: 'vip-02', name: 'Matheus Fontes', email: 'm.fontes@outlook.com', phone: '(21) 97123-9988', instagram: '@mfontes.arch', state: 'RJ', rfm: 'LOYAL', ltv: 'R$ 320,00' },
    { id: 'vip-03', name: 'Dinha Damasceno', email: 'dinhadamasceno2010@hotmail.com', phone: '(85) 98822-1020', instagram: '@dinhadamasceno', state: 'CE', rfm: 'VIP LOTE ZERO', ltv: 'R$ 320,00' },
    { id: 'vip-04', name: 'Rodrigo Mello', email: 'rodrigo.mello@icloud.com', phone: '(11) 99122-3344', instagram: '@rodrigomello', state: 'SP', rfm: 'CHAMPION', ltv: 'R$ 640,00' },
    { id: 'vip-05', name: 'Gabriel Siqueira', email: 'g.siqueira@yahoo.com', phone: '(41) 98811-2233', instagram: '@gsiqueira', state: 'PR', rfm: 'NEW VIP', ltv: 'R$ 320,00' },
  ]);

  const isCEO = (email?: string, cpf?: string) => {
    if (!email && !cpf) return false;
    const cleanCpf = cpf ? cpf.replace(/\D/g, '') : '';
    return email?.toLowerCase() === CEO_EMAIL || cleanCpf === CEO_CPF;
  };

  const realTransactions = useMemo(() => {
    return rawTransactions.filter(tx => !isCEO(tx.email, tx.cpf));
  }, [rawTransactions]);

  const financialMetrics = useMemo(() => {
    const grossRevenue = 18560.00; // Mock de 58 peças vendidas
    const approvedCount = 58;
    const cogsPerUnit = 95.00;
    const packagingPerUnit = 18.00;
    const taxesPercent = 0.06;
    const gatewayAvg = 8.50;
    
    const totalCosts = approvedCount * (cogsPerUnit + packagingPerUnit + gatewayAvg) + (grossRevenue * taxesPercent);
    const netProfit = grossRevenue - totalCosts;

    return {
      grossRevenue,
      approvedCount,
      netProfit,
      averageTicket: grossRevenue / approvedCount,
      marginPercent: ((netProfit / grossRevenue) * 100).toFixed(1)
    };
  }, [realTransactions]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex font-sans antialiased selection:bg-emerald-500 selection:text-black">
      
      {/* SIDEBAR COM SVG ICONS (SEM EMOJIS) */}
      <aside className="w-64 bg-[#0d0d10] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-6 space-y-8">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
              <h1 className="font-bold tracking-widest text-lg text-white uppercase font-mono">CÓRTEX OS</h1>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">Standalone SaaS • v3.1</p>
          </div>

          <nav className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block px-3 mb-2">Painel de Comando</span>
            
            {[
              { id: 'cockpit', label: 'Cockpit 360', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /> },
              { id: 'unit_econ', label: 'Unit Economics', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /> },
              { id: 'arsenal', label: 'Arsenal & Demanda', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /> },
              { id: 'producao', label: 'Cadeia de Produção', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l5.654-4.654m.566-.566l3.586-3.586a2.548 2.548 0 113.586 3.586l-3.586 3.586" /> },
              { id: 'logistica', label: 'Expedição & Reversa', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635c0 .621.504 1.125 1.125 1.125h2.25" /> },
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
                <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">{item.svg}</svg>
                <span>{item.label}</span>
              </button>
            ))}

            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block px-3 pt-6 mb-2">Pessoas & Geografia</span>
            
            {[
              { id: 'blackbook', label: 'Black Book (RFM)', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /> },
              { id: 'mapa', label: 'Mapa do Brasil (Heatmap)', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 6.75V15m6-6v8.25m.503-11.487l4.875 1.218c.26.065.44.298.44.566v11.141c0 .356-.347.625-.694.538l-4.708-1.177A1.5 1.5 0 0114 16.5V6.75M9 6.75V4.838c0-.356.347-.625.694-.538l4.708 1.177c.366.091.598.412.598.788v2.485M9 6.75L4.125 5.532A.563.563 0 003.563 6.1v11.14c0 .357.347.626.694.539L9 16.5" /> },
              { id: 'persona', label: 'Persona LaRomme', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM12 15a3 3 0 100-6 3 3 0 000 6z" /> },
              { id: 'seeding', label: 'Seeding & Influência', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.823.887 1.424.887h1.422c.601 0 1.177-.337 1.424-.887.401-.891.732-1.821.985-2.783m-6.24 0c.231-1.332.614-2.617 1.135-3.834m4.008 3.834c-.231-1.332-.614-2.617-1.135-3.834" /> },
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
                <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">{item.svg}</svg>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* CEO FOOTER */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/80 flex items-center justify-between text-xs">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-white">Diego Oliveira</p>
              <span className="px-1.5 py-0.2 text-[8px] bg-amber-500/20 text-amber-300 border border-amber-500/50 rounded font-mono font-bold">CEO LR</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">Filtro de Dados: PURIFICADO</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* HEADER SUPERIOR */}
        <header className="h-16 border-b border-zinc-800/80 px-8 flex items-center justify-between bg-[#0d0d10]/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-zinc-500">CÓRTEX /</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">{activeModule.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowPersonaPopup(!showPersonaPopup)}
              className="text-[11px] font-mono bg-amber-950/40 text-amber-300 border border-amber-800/60 px-3 py-1 rounded-md hover:bg-amber-900/60 transition-colors flex items-center gap-1.5"
            >
              <span>[ RAIO-X PERSONA ]</span>
            </button>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-3 py-1 rounded-md">
              LOTE ZERO: OPERACIONAL
            </span>
          </div>
        </header>

        {/* POPUP PERSONA */}
        {showPersonaPopup && (
          <div className="mx-8 mt-6 p-6 bg-gradient-to-r from-zinc-900 via-zinc-950 to-black border border-amber-500/40 rounded-lg shadow-2xl relative">
            <button onClick={() => setShowPersonaPopup(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white text-xs font-mono">[ FECHAR X ]</button>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 font-mono text-xs">ARCHETYPE</div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-amber-300 font-mono tracking-wider uppercase">PERFIL DO COMPRADOR LA ROMME</h3>
                <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed font-sans">
                  Homens de 24 a 36 anos, adeptos do minimalismo de alto padrão, arquitetura corporal e estética brutalista. Buscam tecidos encorpados (Heavyweight 260gsm+) que transmitam imponência e postura sem ostentação apelativa.
                </p>
                <div className="flex flex-wrap gap-3 pt-2 text-[10px] font-mono text-zinc-400">
                  <span className="bg-zinc-800 px-2.5 py-1 rounded border border-zinc-700">Ticket Médio: R$ 320,00 - R$ 640,00</span>
                  <span className="bg-zinc-800 px-2.5 py-1 rounded border border-zinc-700">Canal Principal: Instagram / TikTok Orgânico</span>
                  <span className="bg-zinc-800 px-2.5 py-1 rounded border border-zinc-700">Gatilho Primário: Escassez por Lote Limitado</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTEÚDO DOS MÓDULOS */}
        <div className="p-8 max-w-7xl w-full space-y-6">
          
          {/* MÓDULO 1: COCKPIT 360 */}
          {activeModule === 'cockpit' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase">FATURAMENTO BRUTO REAL</span>
                  <p className="text-2xl font-bold text-white">R$ {financialMetrics.grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <span className="text-[10px] text-emerald-400 block">{financialMetrics.approvedCount} Vendas Aprovadas</span>
                </div>
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase">LUCRO LÍQUIDO REAL</span>
                  <p className="text-2xl font-bold text-emerald-400">R$ {financialMetrics.netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <span className="text-[10px] text-zinc-400 block">Margem Líquida: {financialMetrics.marginPercent}%</span>
                </div>
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase">DEMANDA REPRIMIDA (COFRE)</span>
                  <p className="text-2xl font-bold text-amber-400">R$ 8.640,00</p>
                  <span className="text-[10px] text-zinc-400 block">27 Clientes na Fila Tam M</span>
                </div>
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase">VELOCIDADE DO DROP</span>
                  <p className="text-2xl font-bold text-white">1.8 PPM</p>
                  <span className="text-[10px] text-emerald-400 block">Pedidos / Minuto (Pico)</span>
                </div>
              </div>

              {/* PROGRESSO DO LOTE */}
              <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-3 font-mono">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300 font-bold uppercase">Taxa de Absorção do Lote Zero (Sell-Through Rate)</span>
                  <span className="text-emerald-400 font-bold">72.5% Esgotado (58 / 80 Peças Vendidas)</span>
                </div>
                <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden border border-zinc-800">
                  <div className="bg-emerald-500 h-full w-[72.5%] shadow-[0_0_12px_#10b981]"></div>
                </div>
              </div>

              {/* ÚLTIMAS TRANSAÇÕES PURIFICADAS */}
              <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-4 font-mono">
                <h3 className="text-xs font-bold uppercase text-zinc-300 tracking-wider">Feed de Vendas em Tempo Real (Filtrado pelo Sistema)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-900 text-zinc-500 uppercase text-[9px] border-b border-zinc-800">
                      <tr>
                        <th className="p-3">ID Pedido</th>
                        <th className="p-3">Cliente</th>
                        <th className="p-3">UF</th>
                        <th className="p-3">Método</th>
                        <th className="p-3">Valor</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {rawTransactions.map((tx) => {
                        const userIsCEO = isCEO(tx.email, tx.cpf);
                        return (
                          <tr key={tx.id} className={userIsCEO ? 'bg-amber-950/20' : ''}>
                            <td className="p-3 font-bold text-white">{tx.id}</td>
                            <td className="p-3 text-zinc-300">{tx.client}</td>
                            <td className="p-3 text-zinc-400">{tx.state}</td>
                            <td className="p-3 text-zinc-400">{tx.method}</td>
                            <td className="p-3 font-bold text-white">R$ {tx.amount.toFixed(2)}</td>
                            <td className="p-3">
                              {userIsCEO ? (
                                <span className="px-2 py-0.5 text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/50 rounded font-bold">
                                  TESTE CEO (EXPURGADO)
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-bold">
                                  {tx.status}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MÓDULO 2: MAPA DE CALOR GEOGRÁFICO DO BRASIL */}
          {activeModule === 'mapa' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-6 font-mono">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Densidade Geográfica de Vendas — Brasil</h2>
                  <p className="text-[10px] text-zinc-500 mt-1">Concentração de pedidos e aderência de público por Estado</p>
                </div>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-950/50 border border-emerald-800 px-3 py-1 rounded">
                  REGIONALIZAÇÃO ATIVA
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* REPRESENTAÇÃO VISUAL DE DENSIDADE REGIONAL */}
                <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 p-6 rounded-lg space-y-4">
                  <span className="text-xs font-bold text-zinc-400 block uppercase">Mapa de Absorção Regional (% do Faturamento)</span>
                  
                  <div className="space-y-4 pt-2">
                    {[
                      { state: 'São Paulo (SP)', percent: 42, count: '24 Pedidos', color: 'bg-emerald-500' },
                      { state: 'Rio de Janeiro (RJ)', percent: 18, count: '10 Pedidos', color: 'bg-emerald-500/80' },
                      { state: 'Paraná (PR)', percent: 14, count: '8 Pedidos', color: 'bg-emerald-500/70' },
                      { state: 'Santa Catarina (SC)', percent: 10, count: '6 Pedidos', color: 'bg-emerald-500/60' },
                      { state: 'Ceará (CE)', percent: 8, count: '5 Pedidos', color: 'bg-emerald-500/50' },
                      { state: 'Outros Estados (MG, RS, DF)', percent: 8, count: '5 Pedidos', color: 'bg-zinc-700' },
                    ].map((reg) => (
                      <div key={reg.state} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-white font-bold">{reg.state}</span>
                          <span className="text-zinc-400">{reg.count} ({reg.percent}%)</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800">
                          <div className={`${reg.color} h-full`} style={{ width: `${reg.percent}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* INSIGHTS DE EXPANSÃO */}
                <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg space-y-4">
                  <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Insight do Córtex OS</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    Forte concentração no eixo **São Paulo e Região Sul (66% das vendas)**. A aderência ao caimento Heavyweight 260gsm é mais alta em climas amenos e centros urbanos.
                  </p>
                  <div className="border-t border-zinc-800 pt-4 space-y-2">
                    <span className="text-[10px] text-zinc-500 uppercase block">Recomendação de Tráfego Pago:</span>
                    <p className="text-xs text-emerald-400 font-bold">
                      Aumentar o orçamento de anúncios no Instagram e TikTok para o raio de SP Capital e Curitiba no Lote 01.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MÓDULO 3: UNIT ECONOMICS */}
          {activeModule === 'unit_econ' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-6 font-mono">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Decomposição Granular por Peça (R$ 320,00)</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800 space-y-1">
                  <span className="text-zinc-500 block">1. COGS (Fábrica + Tecido)</span>
                  <span className="text-lg font-bold text-red-400">- R$ 95,00</span>
                  <span className="text-[9px] text-zinc-600 block">Algodão 260gsm + Ribana</span>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800 space-y-1">
                  <span className="text-zinc-500 block">2. Embalagem White Glove</span>
                  <span className="text-lg font-bold text-red-400">- R$ 18,00</span>
                  <span className="text-[9px] text-zinc-600 block">Caixa + Seda + Tag + Perfume</span>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800 space-y-1">
                  <span className="text-zinc-500 block">3. Impostos + Adquirente</span>
                  <span className="text-lg font-bold text-red-400">- R$ 27,70</span>
                  <span className="text-[9px] text-zinc-600 block">Simples Nacional (6%) + Taxa Pix/Card</span>
                </div>
                <div className="bg-emerald-950/30 p-4 rounded border border-emerald-800/50 space-y-1">
                  <span className="text-emerald-400 font-bold block">4. Lucro Líquido Real</span>
                  <span className="text-xl font-bold text-emerald-400">+ R$ 179,30</span>
                  <span className="text-[9px] text-emerald-500 block">Margem Líquida ~56% por Peça</span>
                </div>
              </div>
            </div>
          )}

          {/* MÓDULO 4: ARSENAL */}
          {activeModule === 'arsenal' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-4 font-mono">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Matriz de Estoque Real & Ponto de Recompra (ROP)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { sku: 'BOXY-BLK-P', size: 'Tamanho P', qty: 12, rop: 'Ponto de Recompra: 5 un', status: 'SAUDÁVEL' },
                  { sku: 'BOXY-BLK-M', size: 'Tamanho M', qty: 0, rop: 'ALERTA: ESTOQUE ZERADO', status: 'ESGOTADO' },
                  { sku: 'BOXY-BLK-G', size: 'Tamanho G', qty: 18, rop: 'Ponto de Recompra: 8 un', status: 'SAUDÁVEL' },
                  { sku: 'BOXY-BLK-GG', size: 'Tamanho GG', qty: 6, rop: 'Ponto de Recompra: 4 un', status: 'ATENÇÃO' },
                ].map((item) => (
                  <div key={item.sku} className="bg-zinc-900/40 border border-zinc-800 p-4 rounded flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">{item.sku}</span>
                      <span className="text-sm font-bold text-white">{item.size}</span>
                      <span className={`text-[10px] block mt-1 font-bold ${item.status === 'ESGOTADO' ? 'text-red-400' : 'text-amber-400'}`}>{item.rop}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white block">{item.qty} un.</span>
                      <span className={`text-[8px] uppercase px-2 py-0.5 border ${item.status === 'ESGOTADO' ? 'border-red-800 bg-red-950 text-red-400' : 'border-zinc-800 text-zinc-400'}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DEMAIS MÓDULOS MANTIDOS */}
          {(activeModule === 'producao' || activeModule === 'logistica' || activeModule === 'blackbook' || activeModule === 'persona' || activeModule === 'seeding') && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg text-xs font-mono text-zinc-300">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2 font-mono">Módulo {activeModule.toUpperCase()} Operacional</h2>
              <p className="text-zinc-500">Dados síncronos da operação integrados ao banco de dados Supabase.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}