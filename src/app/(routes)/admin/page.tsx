'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

// Tipagem dos dados que vêm do Supabase
interface VIPLead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  instagram: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('crm');
  const [leads, setLeads] = useState<VIPLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar dados reais do Supabase
  const fetchLeads = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('senado_vip')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar leads:', error);
    } else if (data) {
      setLeads(data);
    }
    setIsLoading(false);
  };

  // Executar a busca assim que o painel abrir
  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <main className="min-h-screen bg-brand-black text-white font-mono pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho do Admin */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-zinc-800 pb-6 mb-8 gap-4">
          <div>
            <h1 className="font-serif text-3xl uppercase tracking-widest text-white">Córtex OS</h1>
            <p className="text-xs text-zinc-500 tracking-[0.2em] mt-2">SISTEMA DE GESTÃO INTEGRADA LAROMME</p>
          </div>
          <div className="text-right">
            <span className="block text-[10px] text-zinc-400 uppercase tracking-widest">Status da Rede</span>
            <span className="inline-flex items-center gap-2 text-xs text-green-500 uppercase tracking-widest mt-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Conexão Segura (Supabase)
            </span>
          </div>
        </div>

        {/* Navegação de Módulos */}
        <div className="flex overflow-x-auto gap-2 border-b border-zinc-900 pb-4 mb-8 no-scrollbar select-none">
          {['sitrep', 'crm', 'supply', 'tesouraria'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-[10px] uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-white text-black border border-white' 
                  : 'bg-zinc-950 text-zinc-500 border border-zinc-900 hover:text-white hover:border-zinc-700'
              }`}
            >
              [ {tab === 'sitrep' ? 'Visão Geral' : tab === 'crm' ? 'Senado VIP' : tab === 'supply' ? 'Kanban Arella' : 'Finanças'} ]
            </button>
          ))}
        </div>

        {/* ÁREA DE CONTEÚDO */}
        <div className="bg-zinc-950/50 border border-zinc-900 p-6 min-h-[500px]">
          
          {/* MÓDULO: CRM (Senado VIP) */}
          {activeTab === 'crm' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center mb-6 border-b border-zinc-900 pb-4">
                <h2 className="text-sm uppercase tracking-[0.2em] text-zinc-300">Base de Operações VIP</h2>
                <button 
                  onClick={fetchLeads} 
                  className="text-[9px] uppercase tracking-widest text-zinc-400 hover:text-white flex items-center gap-2 border border-zinc-800 px-3 py-1.5 hover:bg-zinc-900 transition-colors"
                >
                  [ ATUALIZAR DADOS ]
                </button>
              </div>

              {isLoading ? (
                <div className="text-center py-20 text-[10px] text-zinc-600 uppercase tracking-widest animate-pulse">
                  Sincronizando com satélites de dados...
                </div>
              ) : leads.length === 0 ? (
                <div className="text-center py-20 text-[10px] text-zinc-600 uppercase tracking-widest border border-dashed border-zinc-800">
                  Nenhum registro encontrado no cofre.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b border-zinc-800 text-[9px] uppercase text-zinc-500 tracking-[0.2em]">
                        <th className="py-4 px-4 font-normal">Identificação</th>
                        <th className="py-4 px-4 font-normal">Contato</th>
                        <th className="py-4 px-4 font-normal">Rede Social</th>
                        <th className="py-4 px-4 font-normal">Ingresso</th>
                        <th className="py-4 px-4 font-normal">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => (
                        <tr key={lead.id} className="border-b border-zinc-900/80 hover:bg-zinc-900/30 transition-colors text-xs text-zinc-300">
                          <td className="py-4 px-4">
                            <span className="block font-medium text-white">{lead.nome || 'N/A'}</span>
                            <span className="block text-[9px] text-zinc-500 mt-1">{lead.email}</span>
                          </td>
                          <td className="py-4 px-4 tracking-widest">{lead.telefone || 'N/A'}</td>
                          <td className="py-4 px-4 text-zinc-400">{lead.instagram || '---'}</td>
                          <td className="py-4 px-4 text-[10px]">
                            {new Date(lead.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
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

          {/* OUTRAS ABAS (MOCK PARA CONSTRUÇÃO FUTURA) */}
          {activeTab !== 'crm' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-zinc-800">
              <div className="w-8 h-8 border border-zinc-700 rounded-full flex items-center justify-center mb-4">
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
              </div>
              <h3 className="text-sm uppercase tracking-widest text-zinc-400 mb-2">Módulo Restrito</h3>
              <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] max-w-sm">
                A engenharia de software desta seção está em desenvolvimento. Integração pendente.
              </p>
            </motion.div>
          )}

        </div>
      </div>
    </main>
  );
}