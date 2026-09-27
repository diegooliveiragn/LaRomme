'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function CortexSaaS() {
  const [activeModule, setActiveModule] = useState<'cockpit' | 'unit_econ' | 'arsenal' | 'producao' | 'logistica' | 'blackbook' | 'seeding'>('cockpit');
  const [productionMode, setProductionMode] = useState<'whitelabel' | 'fracionado'>('whitelabel');
  const [vipUsers, setVipUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // MOCK DATA - UNIT ECONOMICS (BOX HEAVYWEIGHT R$ 320,00)
  const unitEcon = {
    salePrice: 320.00,
    cogs: 95.00, // Fabrica + Tag + Embalagem
    gatewayFeePix: 3.17, // ~0.99%
    gatewayFeeCard: 12.76, // ~3.99%
    taxes: 19.20, // Simples Nacional ~6%
    netProfitPix: 202.63,
    netProfitCard: 193.04,
    marginPixPercent: '63.3%',
  };

  // MOCK DATA - SEEDING (INFLUENCE)
  const seedingKits = [
    { influencer: '@lucas.style', item: 'Boxy Heavyweight M', status: 'ENTREGUE', reach: '45k', salesGenerated: 6, roi: '18.2x' },
    { influencer: '@matheus.fit', item: 'Boxy Heavyweight G', status: 'EM TRÂNSITO', reach: '120k', salesGenerated: 0, roi: '-' },
  ];

  useEffect(() => {
    fetchVipData();
  }, []);

  const fetchVipData = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('vip_access').select('*').order('created_at', { ascending: false });
      if (data) setVipUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex font-sans antialiased selection:bg-emerald-500 selection:text-black">
      
      {/* SIDEBAR LATERAL FIXA */}
      <aside className="w-64 bg-[#0d0d10] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-6 space-y-8">
          
          {/* BRANDING DEDICADO */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
              <h1 className="font-bold tracking-widest text-lg text-white uppercase font-mono">CÓRTEX OS</h1>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">Standalone SaaS • v3.0</p>
          </div>

          {/* MENU DE NAVEGAÇÃO */}
          <nav className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block px-3 mb-2">Módulos Principais</span>
            {[
              { id: 'cockpit', label: 'Cockpit 360', icon: '⚡' },
              { id: 'unit_econ', label: 'Unit Economics & DRE', icon: '📊' },
              { id: 'arsenal', label: 'Arsenal (Estoque)', icon: '📦' },
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

            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block px-3 pt-6 mb-2">Relacionamento & Influência</span>
            {[
              { id: 'blackbook', label: 'Black Book (RFM VIP)', icon: '👑' },
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

        {/* PROFILE FOOTER */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/50 flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-white">Diego Oliveira</p>
            <span className="text-[10px] text-zinc-500 font-mono">Solo Founder • LaRomme</span>
          </div>
          <span className="px-2 py-0.5 text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800/50 rounded font-mono">ONLINE</span>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* HEADER SUPERIOR DEDICADO */}
        <header className="h-16 border-b border-zinc-800/80 px-8 flex items-center justify-between bg-[#0d0d10]/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-zinc-500">PAINEL /</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">{activeModule.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-md">
              LOTE ZERO: ACTIVE
            </span>
          </div>
        </header>

        {/* CORPO DOS MÓDULOS */}
        <div className="p-8 max-w-7xl w-full space-y-6">
          
          {/* MÓDULO 1: COCKPIT 360 */}
          {activeModule === 'cockpit' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg space-y-1">
                  <span className="text-[11px] text-zinc-400 font-mono">FATURAMENTO BRUTO</span>
                  <p className="text-2xl font-bold text-white font-mono">R$ 640,00</p>
                  <span className="text-[10px] text-emerald-400 font-mono">2 Vendas Homologadas</span>
                </div>
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg space-y-1">
                  <span className="text-[11px] text-zinc-400 font-mono">LUCRO LÍQUIDO REAL</span>
                  <p className="text-2xl font-bold text-emerald-400 font-mono">R$ 395,67</p>
                  <span className="text-[10px] text-zinc-500 font-mono">Margem Líquida ~61.8%</span>
                </div>
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg space-y-1">
                  <span className="text-[11px] text-zinc-400 font-mono">VELOCIDADE DO DROP (PPM)</span>
                  <p className="text-2xl font-bold text-amber-400 font-mono">0.4 PPM</p>
                  <span className="text-[10px] text-zinc-500 font-mono">Pedidos por Minuto</span>
                </div>
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg space-y-1">
                  <span className="text-[11px] text-zinc-400 font-mono">CADASTROS VIP</span>
                  <p className="text-2xl font-bold text-white font-mono">{vipUsers.length}</p>
                  <span className="text-[10px] text-zinc-500 font-mono">Base no Senado VIP</span>
                </div>
              </div>

              {/* PROGRESSO DO ESTOQUE */}
              <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-300 font-bold uppercase">Taxa de Esgotamento do Lote Zero (Sell-Through Rate)</span>
                  <span className="text-emerald-400 font-bold">60% Esgotado (30 / 50 Peças Restantes)</span>
                </div>
                <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden border border-zinc-800">
                  <div className="bg-emerald-500 h-full w-[60%] transition-all duration-500"></div>
                </div>
              </div>
            </div>
          )}

          {/* MÓDULO 2: UNIT ECONOMICS & DRE */}
          {activeModule === 'unit_econ' && (
            <div className="space-y-6">
              <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Análise de Lucratividade por SKU — Camiseta Boxy Heavyweight</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800 space-y-2">
                    <span className="text-xs text-zinc-400 font-mono block">PREÇO DE VENDA</span>
                    <span className="text-xl font-bold text-white font-mono">R$ {unitEcon.salePrice.toFixed(2)}</span>
                  </div>
                  <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800 space-y-2">
                    <span className="text-xs text-zinc-400 font-mono block">CUSTO DE PRODUÇÃO (COGS)</span>
                    <span className="text-xl font-bold text-red-400 font-mono">- R$ {unitEcon.cogs.toFixed(2)}</span>
                  </div>
                  <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800 space-y-2">
                    <span className="text-xs text-zinc-400 font-mono block">IMPOSTOS ESTIMADOS (SIMPLES)</span>
                    <span className="text-xl font-bold text-red-400 font-mono">- R$ {unitEcon.taxes.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-950/20 border border-emerald-800/50 p-4 rounded space-y-1">
                    <span className="text-xs text-emerald-400 font-mono font-bold block">LUCRO LÍQUIDO LOTE ZERO (PIX)</span>
                    <span className="text-2xl font-bold text-emerald-400 font-mono">R$ {unitEcon.netProfitPix.toFixed(2)}</span>
                    <p className="text-[10px] text-zinc-400 font-mono">Taxa Gateway (Pix ~0.99%): -R$ {unitEcon.gatewayFeePix.toFixed(2)}</p>
                  </div>
                  <div className="bg-emerald-950/20 border border-emerald-800/50 p-4 rounded space-y-1">
                    <span className="text-xs text-emerald-400 font-mono font-bold block">LUCRO LÍQUIDO LOTE ZERO (CARTÃO)</span>
                    <span className="text-2xl font-bold text-emerald-400 font-mono">R$ {unitEcon.netProfitCard.toFixed(2)}</span>
                    <p className="text-[10px] text-zinc-400 font-mono">Taxa Gateway (Cartão ~3.99%): -R$ {unitEcon.gatewayFeeCard.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MÓDULO 3: ARSENAL (ESTOQUE) */}
          {activeModule === 'arsenal' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Matriz de Estoque Físico & SKUs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { sku: 'BOXY-BLK-P', size: 'Tamanho P', qty: 8, status: 'DISPONÍVEL' },
                  { sku: 'BOXY-BLK-M', size: 'Tamanho M', qty: 2, status: 'CRÍTICO' },
                  { sku: 'BOXY-BLK-G', size: 'Tamanho G', qty: 15, status: 'DISPONÍVEL' },
                  { sku: 'BOXY-BLK-GG', size: 'Tamanho GG', qty: 5, status: 'DISPONÍVEL' },
                ].map((item) => (
                  <div key={item.sku} className="bg-zinc-900/40 border border-zinc-800 p-4 rounded flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-mono block">{item.sku}</span>
                      <span className="text-sm font-bold text-white">{item.size}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold font-mono text-white block">{item.qty} un.</span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${item.status === 'CRÍTICO' ? 'border-amber-800 text-amber-400 bg-amber-950' : 'border-zinc-700 text-zinc-300'}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MÓDULO 4: CADEIA DE PRODUÇÃO */}
          {activeModule === 'producao' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Monitoramento de Oficina & Fornecedor</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setProductionMode('whitelabel')}
                    className={`px-3 py-1 text-xs rounded border font-mono ${productionMode === 'whitelabel' ? 'bg-white text-black font-bold' : 'border-zinc-800 text-zinc-400'}`}
                  >
                    White Label
                  </button>
                  <button
                    onClick={() => setProductionMode('fracionado')}
                    className={`px-3 py-1 text-xs rounded border font-mono ${productionMode === 'fracionado' ? 'bg-white text-black font-bold' : 'border-zinc-800 text-zinc-400'}`}
                  >
                    Linha Fracionada
                  </button>
                </div>
              </div>

              {productionMode === 'whitelabel' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded space-y-2">
                    <span className="text-xs font-bold text-zinc-400 font-mono">1. Pedido em Produção</span>
                    <p className="text-sm font-bold text-white">50x Boxy Heavyweight 260gsm</p>
                    <span className="text-[10px] text-zinc-500 font-mono block">Fornecedor: Private Label BR</span>
                  </div>
                  <div className="bg-amber-950/20 border border-amber-900/50 p-4 rounded space-y-2">
                    <span className="text-xs font-bold text-amber-400 font-mono">2. Personalização & Tags</span>
                    <p className="text-sm font-bold text-amber-200">Costura de Ribana & Etiquetagem</p>
                    <span className="text-[10px] text-amber-500 font-mono block">Previsão de Envio: 3 dias</span>
                  </div>
                  <div className="bg-emerald-950/20 border border-emerald-900/50 p-4 rounded space-y-2">
                    <span className="text-xs font-bold text-emerald-400 font-mono">3. Estabilização no HQ</span>
                    <p className="text-sm font-bold text-emerald-200">Aguardando Lote Físico</p>
                    <span className="text-[10px] text-emerald-500 font-mono block">Pronto para Expedição</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {['Modelagem & Pilotagem', 'Serigrafia / Estamparia', 'Oficina de Costura', 'Quality Control'].map((stage, idx) => (
                    <div key={idx} className="bg-zinc-900/40 border border-zinc-800 p-4 rounded space-y-2">
                      <span className="text-xs font-bold text-zinc-400 font-mono">{idx + 1}. {stage}</span>
                      <p className="text-xs text-zinc-500 font-mono">Status: Aprovado</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MÓDULO 5: EXPEDIÇÃO & REVERSA */}
          {activeModule === 'logistica' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Central de Despacho & Logística Reversa</h2>
              <div className="space-y-3">
                <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold text-white block">LR-001 — Dinha Damasceno</span>
                    <span className="text-xs text-zinc-400">1x Camiseta Boxy Heavyweight • Tamanho M</span>
                  </div>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Código de Rastreio" defaultValue="BR982341239BR" className="bg-black border border-zinc-800 px-3 py-1 text-xs text-white rounded font-mono focus:border-white outline-none" />
                    <button className="bg-emerald-500 text-black font-bold text-xs px-3 py-1 rounded hover:bg-emerald-400 font-mono">[ ATUALIZAR ]</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MÓDULO 6: BLACK BOOK (RFM VIP) */}
          {activeModule === 'blackbook' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Black Book — Ficha VIP de Compradores</h2>
                <button onClick={fetchVipData} className="border border-zinc-800 px-3 py-1 text-xs rounded font-mono text-zinc-400 hover:text-white">[ ATUALIZAR ]</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] border-b border-zinc-800">
                    <tr>
                      <th className="p-3">Membro VIP</th>
                      <th className="p-3">Contato</th>
                      <th className="p-3">Instagram</th>
                      <th className="p-3">Classificação RFM</th>
                      <th className="p-3">Ação Concierge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {loading ? (
                      <tr><td colSpan={5} className="p-4 text-center text-zinc-500">Buscando cadastros VIP...</td></tr>
                    ) : vipUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="p-3 font-bold text-white">{user.name} <span className="block text-[10px] text-zinc-500">{user.email}</span></td>
                        <td className="p-3 text-zinc-300">{user.phone}</td>
                        <td className="p-3 text-zinc-400">{user.instagram || '-'}</td>
                        <td className="p-3"><span className="px-2 py-0.5 text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">CHAMPION (LOTE ZERO)</span></td>
                        <td className="p-3">
                          <a href={`https://wa.me/55${user.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-xs text-emerald-400 underline hover:text-emerald-300">
                            WhatsApp VIP →
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MÓDULO 7: SEEDING & INFLUÊNCIA */}
          {activeModule === 'seeding' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Atribuição de Seeding & ROI de Influência</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] border-b border-zinc-800">
                    <tr>
                      <th className="p-3">Influenciador / Criador</th>
                      <th className="p-3">Peça Enviada</th>
                      <th className="p-3">Status Envio</th>
                      <th className="p-3">Alcance Estimado</th>
                      <th className="p-3">Vendas Convertidas</th>
                      <th className="p-3">ROI Atribuído</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {seedingKits.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-bold text-white">{item.influencer}</td>
                        <td className="p-3 text-zinc-300">{item.item}</td>
                        <td className="p-3 text-emerald-400 font-bold">{item.status}</td>
                        <td className="p-3 text-zinc-400">{item.reach}</td>
                        <td className="p-3 text-white font-bold">{item.salesGenerated} pedidos</td>
                        <td className="p-3 text-emerald-400 font-bold">{item.roi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}