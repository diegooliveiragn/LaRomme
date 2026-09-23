'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

// Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const MASTER_KEY = 'ROMME2026';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState('LEADS'); // LEADS, DEMANDA, ECONOMICS, SIMULADOR
  
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados do Simulador de Drop
  const [simAds, setSimAds] = useState(1000);
  const [simCpc, setSimCpc] = useState(1.50);
  const [simConvertRate, setSimConvertRate] = useState(2.5);
  const [simTicket, setSimTicket] = useState(249.00);
  const [simProductCost, setSimProductCost] = useState(75.00);
  
  // Cálculos do Simulador
  const simVisits = Math.floor(simAds / simCpc);
  const simSales = Math.floor(simVisits * (simConvertRate / 100));
  const simRevenue = simSales * simTicket;
  const simCogs = simSales * simProductCost; // Custo das Mercadorias
  const simGrossProfit = simRevenue - simCogs - simAds;
  const simRoi = simAds > 0 ? ((simGrossProfit / simAds) * 100).toFixed(1) : 0;

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('laromme_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchLeads();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === MASTER_KEY) {
      setIsAuthenticated(true);
      sessionStorage.setItem('laromme_admin_auth', 'true');
      setAuthError(false);
      fetchLeads();
    } else {
      setAuthError(true);
    }
  };

  const fetchLeads = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (!error && data) setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= TELA DE LOGIN =================
  if (!isAuthenticated) {
    return (
      <div className="bg-brand-black min-h-screen text-brand-offwhite flex flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-zinc-950 border border-zinc-900 p-12 space-y-8">
          <div className="space-y-2 border-b border-zinc-900 pb-6 text-center">
            <span className="font-mono text-[9px] text-brand-red uppercase tracking-widest block">Restricted // Area</span>
            <h1 className="font-serif text-3xl uppercase tracking-wider text-white">Senado LaRomme</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="PROTOCOLO DE ACESSO"
              className="w-full bg-black border border-zinc-800 p-4 text-center font-mono text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white transition-colors tracking-widest"
            />
            {authError && <span className="font-mono text-[9px] text-brand-red uppercase tracking-widest block text-center">[ CÓDIGO INVÁLIDO ]</span>}
            <button type="submit" className="w-full bg-white text-black py-4 font-mono text-[10px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-colors">
              [ DECODIFICAR ]
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ================= DASHBOARD PRINCIPAL =================
  return (
    <div className="bg-brand-black min-h-screen text-brand-offwhite pt-24 pb-12 px-4 sm:px-6 flex flex-col md:flex-row gap-8">
      
      {/* MENU LATERAL */}
      <div className="w-full md:w-64 space-y-6 flex-shrink-0">
        <div className="pb-6 border-b border-zinc-900">
          <h2 className="font-serif text-xl uppercase tracking-wider text-white mb-2">Comando</h2>
          <div className="flex items-center gap-2 font-mono text-[9px] text-emerald-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Sistema Online
          </div>
        </div>
        
        <nav className="flex flex-col gap-2 font-mono text-[10px] uppercase tracking-widest">
          {['LEADS', 'DEMANDA', 'ECONOMICS', 'SIMULADOR'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-4 py-3 border-l-2 transition-all ${activeTab === tab ? 'border-brand-red bg-zinc-900/50 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-950'}`}
            >
              [ {tab} ]
            </button>
          ))}
          <button 
            onClick={() => { sessionStorage.removeItem('laromme_admin_auth'); setIsAuthenticated(false); }}
            className="text-left px-4 py-3 border-l-2 border-transparent text-brand-red hover:bg-brand-red/10 transition-colors mt-8"
          >
            [ ENCERRAR SESSÃO ]
          </button>
        </nav>
      </div>

      {/* ÁREA DE CONTEÚDO */}
      <div className="flex-1 bg-zinc-950 border border-zinc-900 p-6 sm:p-10 min-h-[600px] overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: LEADS & CRM */}
          {activeTab === 'LEADS' && (
            <motion.div key="leads" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="flex justify-between items-end border-b border-zinc-900 pb-6">
                <div>
                  <h3 className="font-serif text-3xl uppercase text-white">Lote Zero // Registros</h3>
                  <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mt-2">Volume atual da fila de espera.</p>
                </div>
                <div className="text-right">
                  <div className="font-serif text-5xl text-white">{leads.length}</div>
                  <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Membros VIP</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 text-zinc-500 uppercase text-[9px] tracking-widest">
                      <th className="py-3 px-2">Data</th>
                      <th className="py-3 px-2">E-mail</th>
                      <th className="py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-zinc-300">
                    {leads.slice(0, 15).map((l, i) => (
                      <tr key={i} className="hover:bg-zinc-900/40">
                        <td className="py-3 px-2 text-[9px] text-zinc-600">{new Date(l.created_at).toLocaleDateString('pt-BR')}</td>
                        <td className="py-3 px-2 text-white">{l.email}</td>
                        <td className="py-3 px-2"><span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-1 border border-emerald-500/20">RETIDO</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 4: SIMULADOR DE DROP */}
          {activeTab === 'SIMULADOR' && (
            <motion.div key="sim" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="border-b border-zinc-900 pb-6">
                <h3 className="font-serif text-3xl uppercase text-white">War Room // Simulador</h3>
                <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mt-2">Projeção matemática de tráfego, conversão e rentabilidade.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Controles */}
                <div className="space-y-6 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-white"><span>Budget de Ads (R$)</span> <span>R$ {simAds}</span></div>
                    <input type="range" min="0" max="10000" step="100" value={simAds} onChange={(e) => setSimAds(Number(e.target.value))} className="w-full accent-brand-red" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-white"><span>Custo por Clique (CPC)</span> <span>R$ {simCpc.toFixed(2)}</span></div>
                    <input type="range" min="0.1" max="5.0" step="0.1" value={simCpc} onChange={(e) => setSimCpc(Number(e.target.value))} className="w-full accent-brand-red" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-white"><span>Taxa de Conversão (%)</span> <span>{simConvertRate}%</span></div>
                    <input type="range" min="0.1" max="10.0" step="0.1" value={simConvertRate} onChange={(e) => setSimConvertRate(Number(e.target.value))} className="w-full accent-brand-red" />
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t border-zinc-900">
                    <div className="flex justify-between text-white"><span>Ticket Médio Estimado</span> <span>R$ {simTicket}</span></div>
                    <input type="range" min="99" max="500" step="10" value={simTicket} onChange={(e) => setSimTicket(Number(e.target.value))} className="w-full accent-zinc-500" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-brand-red"><span>Custo de Produção/Envio por Peça</span> <span>R$ {simProductCost}</span></div>
                    <input type="range" min="20" max="150" step="5" value={simProductCost} onChange={(e) => setSimProductCost(Number(e.target.value))} className="w-full accent-brand-red" />
                  </div>

                </div>

                {/* Dashboard de Resultados */}
                <div className="bg-black border border-zinc-900 p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-zinc-900 bg-zinc-950">
                      <span className="font-mono text-[9px] text-zinc-500 block mb-1">VISITANTES ESTIMADOS</span>
                      <span className="font-serif text-2xl text-white">{simVisits}</span>
                    </div>
                    <div className="p-4 border border-zinc-900 bg-zinc-950">
                      <span className="font-mono text-[9px] text-zinc-500 block mb-1">PEDIDOS ESTIMADOS</span>
                      <span className="font-serif text-2xl text-white">{simSales}</span>
                    </div>
                  </div>

                  <div className="p-6 border border-zinc-800 bg-zinc-900">
                    <span className="font-mono text-[10px] text-zinc-400 block mb-2">RECEITA BRUTA (FATURAMENTO)</span>
                    <span className="font-serif text-4xl text-white">R$ {simRevenue.toLocaleString('pt-BR')}</span>
                  </div>

                  <div className="p-6 border border-brand-red/30 bg-brand-red/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-[10px] text-brand-red block">LUCRO BRUTO (APÓS ADS E CUSTOS)</span>
                      <span className="font-mono text-[10px] text-emerald-500">ROI: {simRoi}%</span>
                    </div>
                    <span className="font-serif text-4xl text-white">R$ {simGrossProfit.toLocaleString('pt-BR')}</span>
                  </div>
                  
                  <p className="font-mono text-[8px] text-zinc-600 text-center uppercase tracking-widest">
                    * Simulação baseada em tráfego frio. Leads da lista VIP tendem a converter em taxas superiores a 5%.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* AS OUTRAS TABS (DEMANDA E ECONOMICS) ESTÃO EM DESENVOLVIMENTO PARA O PRÓXIMO SCRIPT */}
          {(activeTab === 'DEMANDA' || activeTab === 'ECONOMICS') && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
              <div className="font-serif text-2xl text-zinc-600 uppercase">Módulo Criptografado</div>
              <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest max-w-sm">
                Os módulos de rastreio de clique e Unit Economics estão sendo compilados pelo sistema.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}