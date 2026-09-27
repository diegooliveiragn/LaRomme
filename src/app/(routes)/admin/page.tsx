'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface VipUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  instagram?: string;
  created_at: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'vip' | 'kanban' | 'financas'>('vip');
  const [vipList, setVipList] = useState<VipUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Módulos Financeiros (Simulação Integrada ao Lote Zero)
  const financialMetrics = {
    grossRevenue: 320.00,
    approvedTransactions: 1,
    pendingPix: 0,
    averageTicket: 320.00,
    conversionRate: '100%',
  };

  const transactions = [
    { id: 'LR-82001', method: 'PIX', amount: 'R$ 320,00', payer: 'Dinha Damasceno', status: 'APROVADO', date: '2026-09-27' }
  ];

  useEffect(() => {
    fetchVipUsers();
  }, []);

  const fetchVipUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vip_access')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setVipList(data);
      }
    } catch (e) {
      console.error("Erro ao carregar banco:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 px-6 pb-20 font-mono">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER DO SISTEMA */}
        <div className="border-b border-zinc-900 pb-6 flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h1 className="font-serif text-3xl uppercase tracking-widest text-white">Córtex OS</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Sistema de Gestão Integrada LaRomme</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] text-emerald-400 uppercase tracking-widest">Banco Supabase Operacional</span>
          </div>
        </div>

        {/* NAVEGAÇÃO DE ABAS */}
        <div className="flex gap-4 border-b border-zinc-900 pb-4">
          <button 
            onClick={() => setActiveTab('vip')} 
            className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${activeTab === 'vip' ? 'border-white bg-white text-black font-bold' : 'border-zinc-800 text-zinc-400 hover:text-white'}`}>
            [ SENADO VIP ]
          </button>
          <button 
            onClick={() => setActiveTab('kanban')} 
            className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${activeTab === 'kanban' ? 'border-white bg-white text-black font-bold' : 'border-zinc-800 text-zinc-400 hover:text-white'}`}>
            [ KANBAN ARELLA ]
          </button>
          <button 
            onClick={() => setActiveTab('financas')} 
            className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${activeTab === 'financas' ? 'border-white bg-white text-black font-bold' : 'border-zinc-800 text-zinc-400 hover:text-white'}`}>
            [ FINANÇAS ]
          </button>
        </div>

        {/* CONTEÚDO: SENADO VIP */}
        {activeTab === 'vip' && (
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">Base de Operações VIP ({vipList.length})</h2>
              <button onClick={fetchVipUsers} className="border border-zinc-800 px-3 py-1 text-[10px] uppercase tracking-widest hover:bg-zinc-900 transition-colors">[ ATUALIZAR ]</button>
            </div>

            <div className="border border-zinc-900 bg-zinc-950 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 text-zinc-400 uppercase tracking-widest text-[9px] border-b border-zinc-800">
                  <tr>
                    <th className="p-4">Identificação</th>
                    <th className="p-4">Contato</th>
                    <th className="p-4">Instagram</th>
                    <th className="p-4">Ingresso</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {loading ? (
                    <tr><td colSpan={5} className="p-8 text-center text-zinc-500 uppercase tracking-widest">Carregando registros...</td></tr>
                  ) : vipList.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-zinc-500 uppercase tracking-widest">Nenhum registro no Senado VIP.</td></tr>
                  ) : (
                    vipList.map((user) => (
                      <tr key={user.id} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-white uppercase">{user.name}</div>
                          <div className="text-[10px] text-zinc-500">{user.email}</div>
                        </td>
                        <td className="p-4 text-zinc-300">{user.phone}</td>
                        <td className="p-4 text-zinc-400">{user.instagram || '-'}</td>
                        <td className="p-4 text-zinc-400">{new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 text-[9px] border border-emerald-900 bg-emerald-950 text-emerald-400 uppercase">PENDING</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* CONTEÚDO: KANBAN ARELLA */}
        {activeTab === 'kanban' && (
          <section className="bg-zinc-950 border border-zinc-900 p-12 text-center space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Módulo Kanban Arella</h3>
            <p className="text-xs text-zinc-600 max-w-md mx-auto uppercase">Aguardando alocação dos lotes físicos de corte e costura para controle da esteira de produção.</p>
          </section>
        )}

        {/* CONTEÚDO: FINANÇAS */}
        {activeTab === 'financas' && (
          <section className="space-y-8">
            {/* CARDS DE MÉTRICAS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-2">
                <span className="block text-[9px] text-zinc-500 uppercase tracking-widest">Faturamento Bruto</span>
                <span className="text-2xl font-bold text-white font-mono">R$ {financialMetrics.grossRevenue.toFixed(2)}</span>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-2">
                <span className="block text-[9px] text-zinc-500 uppercase tracking-widest">Vendas Homologadas</span>
                <span className="text-2xl font-bold text-emerald-400 font-mono">{financialMetrics.approvedTransactions}</span>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-2">
                <span className="block text-[9px] text-zinc-500 uppercase tracking-widest">Ticket Médio</span>
                <span className="text-2xl font-bold text-white font-mono">R$ {financialMetrics.averageTicket.toFixed(2)}</span>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-2">
                <span className="block text-[9px] text-zinc-500 uppercase tracking-widest">Taxa de Conversão Pix</span>
                <span className="text-2xl font-bold text-white font-mono">{financialMetrics.conversionRate}</span>
              </div>
            </div>

            {/* TABELA DE LIQUIDAÇÕES */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">Livro Razão de Transações (Lote Zero)</h2>
              <div className="border border-zinc-900 bg-zinc-950 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900 text-zinc-400 uppercase tracking-widest text-[9px] border-b border-zinc-800">
                    <tr>
                      <th className="p-4">ID Transação</th>
                      <th className="p-4">Método</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Valor</th>
                      <th className="p-4">Data</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="p-4 font-bold text-white uppercase">{tx.id}</td>
                        <td className="p-4 text-zinc-400 uppercase">{tx.method}</td>
                        <td className="p-4 text-zinc-300">{tx.payer}</td>
                        <td className="p-4 font-bold text-white">{tx.amount}</td>
                        <td className="p-4 text-zinc-400">{tx.date}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 text-[9px] border border-emerald-900 bg-emerald-950 text-emerald-400 uppercase font-bold">{tx.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

      </div>
    </main>
  );
}