'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface VIPLead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  instagram: string;
  status: string;
  created_at: string;
}

interface ProductionItem {
  id: string;
  item: string;
  quantidade: number;
  etapa: 'fio' | 'corte' | 'costura' | 'silk' | 'quality' | 'cofre';
  lote: string;
  observacao: string;
  updated_at: string;
}

const ETAPAS = [
  { key: 'fio', label: '1. Fio / Tecelagem' },
  { key: 'corte', label: '2. Corte' },
  { key: 'costura', label: '3. Costura' },
  { key: 'silk', label: '4. Estamparia / Silk' },
  { key: 'quality', label: '5. Controle de Qualidade' },
  { key: 'cofre', label: '6. Pronto / Cofre' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('crm');
  const [leads, setLeads] = useState<VIPLead[]>([]);
  const [production, setProduction] = useState<ProductionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('senado_vip').select('*').order('created_at', { ascending: false });
    if (data) setLeads(data);
    setIsLoading(false);
  };

  const fetchProduction = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('arella_production').select('*').order('updated_at', { ascending: false });
    if (data) setProduction(data as ProductionItem[]);
    setIsLoading(false);
  };

  const updateStage = async (id: string, newEtapa: string) => {
    const { error } = await supabase
      .from('arella_production')
      .update({ etapa: newEtapa, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) {
      setProduction(prev => prev.map(p => p.id === id ? { ...p, etapa: newEtapa as any } : p));
    }
  };

  useEffect(() => {
    if (activeTab === 'crm') fetchLeads();
    if (activeTab === 'supply') fetchProduction();
  }, [activeTab]);

  return (
    <main className="min-h-screen bg-brand-black text-white font-mono pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-zinc-800 pb-6 mb-8 gap-4">
          <div>
            <h1 className="font-serif text-3xl uppercase tracking-widest text-white">Córtex OS</h1>
            <p className="text-xs text-zinc-500 tracking-[0.2em] mt-2">SISTEMA DE GESTÃO INTEGRADA LAROMME</p>
          </div>
          <div className="text-right">
            <span className="block text-[10px] text-zinc-400 uppercase tracking-widest">Status do Sistema</span>
            <span className="inline-flex items-center gap-2 text-xs text-green-500 uppercase tracking-widest mt-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Banco Supabase Operacional
            </span>
          </div>
        </div>

        {/* Navegação */}
        <div className="flex overflow-x-auto gap-2 border-b border-zinc-900 pb-4 mb-8 no-scrollbar select-none">
          {['crm', 'supply', 'tesouraria'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-[10px] uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-white text-black border border-white' 
                  : 'bg-zinc-950 text-zinc-500 border border-zinc-900 hover:text-white hover:border-zinc-700'
              }`}
            >
              [ {tab === 'crm' ? 'Senado VIP' : tab === 'supply' ? 'Kanban Arella' : 'Finanças'} ]
            </button>
          ))}
        </div>

        <div className="bg-zinc-950/50 border border-zinc-900 p-6 min-h-[500px]">
          
          {/* MÓDULO CRM */}
          {activeTab === 'crm' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center mb-6 border-b border-zinc-900 pb-4">
                <h2 className="text-sm uppercase tracking-[0.2em] text-zinc-300">Base de Operações VIP ({leads.length})</h2>
                <button onClick={fetchLeads} className="text-[9px] uppercase tracking-widest text-zinc-400 hover:text-white border border-zinc-800 px-3 py-1.5 hover:bg-zinc-900">
                  [ ATUALIZAR ]
                </button>
              </div>

              {isLoading ? (
                <div className="text-center py-20 text-[10px] text-zinc-600 uppercase tracking-widest animate-pulse">Carregando membros...</div>
              ) : leads.length === 0 ? (
                <div className="text-center py-20 text-[10px] text-zinc-600 uppercase tracking-widest border border-dashed border-zinc-800">Sem registros.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b border-zinc-800 text-[9px] uppercase text-zinc-500 tracking-[0.2em]">
                        <th className="py-4 px-4 font-normal">Identificação</th>
                        <th className="py-4 px-4 font-normal">Contato</th>
                        <th className="py-4 px-4 font-normal">Instagram</th>
                        <th className="py-4 px-4 font-normal">Ingresso</th>
                        <th className="py-4 px-4 font-normal">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => (
                        <tr key={lead.id} className="border-b border-zinc-900/80 hover:bg-zinc-900/30 text-xs text-zinc-300">
                          <td className="py-4 px-4">
                            <span className="block font-medium text-white">{lead.nome || 'N/A'}</span>
                            <span className="block text-[9px] text-zinc-500 mt-1">{lead.email}</span>
                          </td>
                          <td className="py-4 px-4 tracking-widest">{lead.telefone || 'N/A'}</td>
                          <td className="py-4 px-4 text-zinc-400">{lead.instagram || '---'}</td>
                          <td className="py-4 px-4 text-[10px]">
                            {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-block bg-brand-red/10 text-brand-red border border-brand-red/20 px-2.5 py-1 text-[8px] uppercase tracking-widest">
                              {lead.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* MÓDULO KANBAN ARELLA */}
          {activeTab === 'supply' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center mb-6 border-b border-zinc-900 pb-4">
                <h2 className="text-sm uppercase tracking-[0.2em] text-zinc-300">Esteira Fabril Arella — Lote Zero</h2>
                <button onClick={fetchProduction} className="text-[9px] uppercase tracking-widest text-zinc-400 hover:text-white border border-zinc-800 px-3 py-1.5 hover:bg-zinc-900">
                  [ ATUALIZAR KANBAN ]
                </button>
              </div>

              {isLoading ? (
                <div className="text-center py-20 text-[10px] text-zinc-600 uppercase tracking-widest animate-pulse">Conectando à fábrica...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto">
                  {ETAPAS.map((etapa) => {
                    const itemsInStage = production.filter(p => p.etapa === etapa.key);
                    return (
                      <div key={etapa.key} className="bg-zinc-950 border border-zinc-900 p-4 min-w-[200px] flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-4">
                            <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-400">{etapa.label}</span>
                            <span className="text-[9px] bg-zinc-900 px-2 py-0.5 text-zinc-500 font-mono">{itemsInStage.length}</span>
                          </div>

                          <div className="space-y-3">
                            {itemsInStage.map((item) => (
                              <div key={item.id} className="bg-zinc-900/50 border border-zinc-800/80 p-3 text-xs space-y-2">
                                <span className="block text-white font-serif tracking-wider leading-snug">{item.item}</span>
                                <div className="flex justify-between text-[8px] text-zinc-500 uppercase tracking-widest">
                                  <span>QTD: {item.quantidade} un</span>
                                  <span>{item.lote}</span>
                                </div>
                                {item.observacao && (
                                  <p className="text-[8px] text-zinc-400 italic bg-black/40 p-1.5 border border-zinc-900">{item.observacao}</p>
                                )}
                                <div className="pt-2 border-t border-zinc-800 flex justify-between gap-1">
                                  <select 
                                    value={item.etapa} 
                                    onChange={(e) => updateStage(item.id, e.target.value)}
                                    className="bg-black text-[8px] text-zinc-300 border border-zinc-800 px-1 py-1 w-full focus:outline-none focus:border-white uppercase tracking-widest"
                                  >
                                    {ETAPAS.map(e => (
                                      <option key={e.key} value={e.key}>{e.label}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* MÓDULO FINANÇAS */}
          {activeTab === 'tesouraria' && (
            <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-zinc-800">
              <h3 className="text-sm uppercase tracking-widest text-zinc-400 mb-2">Módulo de Finanças & Gateways</h3>
              <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] max-w-sm">
                Próximo passo: Integração do Checkout Mercado Pago / Stripe.
              </p>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}