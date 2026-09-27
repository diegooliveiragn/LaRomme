'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'cockpit' | 'financas' | 'arsenal' | 'producao' | 'logistica' | 'vip'>('cockpit');
  const [productionModel, setProductionModel] = useState<'whitelabel' | 'fracionado'>('whitelabel');
  const [vipList, setVipList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // MOCK DE ESTOQUE (ARSENAL)
  const [stock, setStock] = useState([
    { sku: 'BOXY-BLK-P', item: 'Camiseta Boxy Heavyweight - P', qty: 8, status: 'DISPONÍVEL' },
    { sku: 'BOXY-BLK-M', item: 'Camiseta Boxy Heavyweight - M', qty: 2, status: 'CRÍTICO' },
    { sku: 'BOXY-BLK-G', item: 'Camiseta Boxy Heavyweight - G', qty: 15, status: 'DISPONÍVEL' },
    { sku: 'BOXY-BLK-GG', item: 'Camiseta Boxy Heavyweight - GG', qty: 5, status: 'DISPONÍVEL' },
  ]);

  // MOCK DE EXPEDIÇÃO (LOGÍSTICA)
  const [orders, setOrders] = useState([
    { id: 'LR-001', client: 'Dinha Damasceno', tracking: 'BR982341239BR', status: 'DESPACHADO', value: 'R$ 320,00' },
    { id: 'LR-002', client: 'Gabriel Santos', tracking: '', status: 'AGUARDANDO ENVIO', value: 'R$ 320,00' },
  ]);

  useEffect(() => {
    fetchVipUsers();
  }, []);

  const fetchVipUsers = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('vip_access').select('*').order('created_at', { ascending: false });
      if (data) setVipList(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-20 px-4 md:px-8 pb-20 font-mono">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER EXECUTIVO */}
        <div className="border-b border-zinc-900 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl sm:text-3xl uppercase tracking-widest text-white">Córtex OS</h1>
              <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 tracking-widest">SOLO FOUNDER EDITION</span>
            </div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Centro de Comando Unificado • LaRomme Lote Zero</p>
          </div>
          <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-900 px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] text-zinc-300 uppercase tracking-widest">Servidor Vercel / Supabase OK</span>
          </div>
        </div>

        {/* NAVEGAÇÃO PRINCIPAL */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-900 pb-4">
          {[
            { id: 'cockpit', label: '1. VISÃO 360' },
            { id: 'financas', label: '2. FINANÇAS' },
            { id: 'arsenal', label: '3. ARSENAL (ESTOQUE)' },
            { id: 'producao', label: '4. PRODUÇÃO' },
            { id: 'logistica', label: '5. LOGÍSTICA' },
            { id: 'vip', label: '6. SENADO VIP' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 text-[11px] uppercase tracking-widest border transition-colors ${
                activeTab === tab.id ? 'border-white bg-white text-black font-bold' : 'border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: VISÃO 360 (COCKPIT) */}
        {activeTab === 'cockpit' && (
          <div className="space-y-6">
            {/* KPI METRICS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-950 border border-zinc-900 p-5 space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Faturamento Acumulado</span>
                <p className="text-xl sm:text-2xl font-bold text-white">R$ 640,00</p>
                <span className="text-[9px] text-emerald-400 block">+100% vs Meta Inicial</span>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 p-5 space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Envios Pendentes</span>
                <p className="text-xl sm:text-2xl font-bold text-amber-400">1 Pedido</p>
                <span className="text-[9px] text-zinc-500 block">Aguardando Etiqueta</span>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 p-5 space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Saúde de Estoque</span>
                <p className="text-xl sm:text-2xl font-bold text-white">30 Peças</p>
                <span className="text-[9px] text-amber-500 block">Tamanho M Crítico (2 rest.)</span>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 p-5 space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Membros Senado VIP</span>
                <p className="text-xl sm:text-2xl font-bold text-white">{vipList.length}</p>
                <span className="text-[9px] text-zinc-500 block">Leads Capturados</span>
              </div>
            </div>

            {/* BARRA DE PROGRESSO DO LOTE */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-3">
              <div className="flex justify-between text-xs uppercase tracking-widest">
                <span>Capacidade de Absorção - Lote Zero</span>
                <span className="text-emerald-400 font-bold">60% Concluído (30 / 50 peças)</span>
              </div>
              <div className="w-full bg-zinc-900 h-3 border border-zinc-800">
                <div className="bg-white h-full w-[60%]"></div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FINANÇAS */}
        {activeTab === 'financas' && (
          <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-300">Livro Razão de Liquidação</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 text-zinc-400 text-[9px] uppercase tracking-widest border-b border-zinc-800">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Método</th>
                    <th className="p-3">Valor</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  <tr>
                    <td className="p-3 font-bold text-white">LR-001</td>
                    <td className="p-3 text-zinc-300">Dinha Damasceno</td>
                    <td className="p-3 text-zinc-400">PIX</td>
                    <td className="p-3 font-bold text-white">R$ 320,00</td>
                    <td className="p-3 text-emerald-400 uppercase font-bold">APROVADO</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">LR-002</td>
                    <td className="p-3 text-zinc-300">Gabriel Santos</td>
                    <td className="p-3 text-zinc-400">CARTÃO DE CRÉDITO</td>
                    <td className="p-3 font-bold text-white">R$ 320,00</td>
                    <td className="p-3 text-emerald-400 uppercase font-bold">APROVADO</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ARSENAL (ESTOQUE) */}
        {activeTab === 'arsenal' && (
          <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-300">Matriz de Estoque Físico</h2>
              <span className="text-[10px] text-zinc-500 uppercase">Sincronização em Tempo Real com o Checkout</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stock.map((item) => (
                <div key={item.sku} className="border border-zinc-900 p-4 bg-zinc-900/40 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] text-zinc-500 block uppercase">{item.sku}</span>
                    <span className="text-xs font-bold text-white uppercase">{item.item}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold block text-white">{item.qty} un.</span>
                    <span className={`text-[9px] uppercase px-2 py-0.5 border ${item.status === 'CRÍTICO' ? 'border-amber-800 text-amber-400 bg-amber-950' : 'border-zinc-800 text-zinc-400'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PRODUÇÃO HÍBRIDA */}
        {activeTab === 'producao' && (
          <div className="space-y-6">
            <div className="flex gap-4 border-b border-zinc-900 pb-3 items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-zinc-400">Modelo Operacional:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setProductionModel('whitelabel')}
                  className={`px-3 py-1 text-[10px] uppercase border ${productionModel === 'whitelabel' ? 'border-white text-white font-bold' : 'border-zinc-800 text-zinc-500'}`}
                >
                  White Label (Pacote Fechado)
                </button>
                <button
                  onClick={() => setProductionModel('fracionado')}
                  className={`px-3 py-1 text-[10px] uppercase border ${productionModel === 'fracionado' ? 'border-white text-white font-bold' : 'border-zinc-800 text-zinc-500'}`}
                >
                  Linha Fracionada (Oficinas)
                </button>
              </div>
            </div>

            {productionModel === 'whitelabel' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-950 border border-zinc-900 p-4 space-y-3">
                  <span className="text-[10px] font-bold uppercase text-zinc-400">1. Pedido em Fornecedor</span>
                  <div className="border border-zinc-800 p-3 bg-zinc-900/50 text-xs">
                    <p className="font-bold text-white">50x Boxy Heavyweight 260gsm</p>
                    <span className="text-[9px] text-zinc-500">Fornecedor: Private Label BR</span>
                  </div>
                </div>
                <div className="bg-zinc-950 border border-zinc-900 p-4 space-y-3">
                  <span className="text-[10px] font-bold uppercase text-amber-400">2. Em Confecção / Etiquetagem</span>
                  <div className="border border-amber-900/50 p-3 bg-amber-950/20 text-xs">
                    <p className="font-bold text-amber-200">Personalização de Ribana & Tag</p>
                    <span className="text-[9px] text-amber-500">Previsão: 5 dias úteis</span>
                  </div>
                </div>
                <div className="bg-zinc-950 border border-zinc-900 p-4 space-y-3">
                  <span className="text-[10px] font-bold uppercase text-emerald-400">3. Recebido no HQ (Pronto)</span>
                  <div className="border border-emerald-900/50 p-3 bg-emerald-950/20 text-xs">
                    <p className="font-bold text-emerald-200">Qualidade Aprovada</p>
                    <span className="text-[9px] text-emerald-500">Pronto para Envio</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['Modelagem & Pilotagem', 'Estamparia / Serigrafia', 'Oficina de Costura', 'Controle de Qualidade'].map((stage, idx) => (
                  <div key={idx} className="bg-zinc-950 border border-zinc-900 p-4 space-y-2">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">{idx + 1}. {stage}</span>
                    <div className="text-xs text-zinc-400 border border-zinc-800 p-3">Aguardando Lote</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: LOGÍSTICA & EXPEDIÇÃO */}
        {activeTab === 'logistica' && (
          <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-300">Fila de Despacho VIP</h2>
            <div className="space-y-3">
              {orders.map((ord) => (
                <div key={ord.id} className="border border-zinc-900 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900/30">
                  <div>
                    <span className="text-xs font-bold text-white uppercase">{ord.id} — {ord.client}</span>
                    <span className="text-[10px] text-zinc-500 block uppercase">Item: Camiseta Boxy Heavyweight</span>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <input
                      type="text"
                      placeholder="Inserir Rastreio (ex: BR123...)"
                      defaultValue={ord.tracking}
                      className="bg-black border border-zinc-800 px-3 py-1.5 text-xs text-white uppercase focus:border-white outline-none w-full md:w-64"
                    />
                    <button className="bg-white text-black text-[10px] font-bold px-3 py-2 uppercase tracking-widest hover:bg-zinc-300 transition-colors">
                      [ SALVAR ]
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SENADO VIP */}
        {activeTab === 'vip' && (
          <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-300">Base de Dados VIP ({vipList.length})</h2>
              <button onClick={fetchVipUsers} className="border border-zinc-800 px-3 py-1 text-[10px] uppercase hover:bg-zinc-900 transition-colors">[ REFRESH ]</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 text-zinc-400 text-[9px] uppercase tracking-widest border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Nome / E-mail</th>
                    <th className="p-3">Telefone</th>
                    <th className="p-3">Instagram</th>
                    <th className="p-3">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {loading ? (
                    <tr><td colSpan={4} className="p-4 text-zinc-500 text-center">Buscando registros...</td></tr>
                  ) : vipList.map((user) => (
                    <tr key={user.id}>
                      <td className="p-3 font-bold text-white">{user.name} <span className="text-zinc-500 font-normal block text-[10px]">{user.email}</span></td>
                      <td className="p-3 text-zinc-300">{user.phone}</td>
                      <td className="p-3 text-zinc-400">{user.instagram || '-'}</td>
                      <td className="p-3 text-zinc-500">{new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}