'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
const MASTER_KEY = 'ROMME2026';

export default function AdminBusinessOS() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState<'SITREP' | 'CRM' | 'SUPPLY' | 'TESOURARIA' | 'WARROOM'>('SITREP');
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Estados Financeiros & Operacionais
  const [fixedCosts, setFixedCosts] = useState(3800); // Custos Fixos Mensais (SaaS, Contador, Servidores)
  const [ecoPrice, setEcoPrice] = useState(249);
  const [ecoCogs, setEcoCogs] = useState(68);
  const valTax = ecoPrice * 0.06;
  const valGateway = ecoPrice * 0.045;
  const unitMargin = ecoPrice - ecoCogs - valTax - valGateway;
  const breakEvenUnits = Math.ceil(fixedCosts / unitMargin);

  // Estado do Kanban de Produção (Arella)
  const [kanban, setKanban] = useState([
    { id: '1', artifact: 'Boxy Origo (Off-White)', qty: 150, stage: 'Costura', provider: 'Arella' },
    { id: '2', artifact: 'Camiseta Forza (Preta)', qty: 100, stage: 'Corte', provider: 'Arella' },
    { id: '3', artifact: 'Forza Tank (Bordô/Branca)', qty: 80, stage: 'Matéria-Prima', provider: 'Arella' },
    { id: '4', artifact: 'Boné Nox (Preto)', qty: 50, stage: 'Cofre Pronto', provider: 'Matriz' },
  ]);

  // Dados Mockados de Alta Frequência
  const cashFlowTrend = [
    { dia: '01', entradas: 12000, saídas: 8500, saldo: 3500 },
    { dia: '05', entradas: 18500, saídas: 4200, saldo: 17800 },
    { dia: '10', entradas: 9400, saídas: 15000, saldo: 12200 },
    { dia: '15', entradas: 24000, saídas: 6100, saldo: 30100 },
    { dia: '20', entradas: 31000, saídas: 9800, saldo: 51300 },
  ];

  const sizeCurveData = [
    { tamanho: 'P', demanda: 12 },
    { tamanho: 'M', demanda: 28 },
    { tamanho: 'G', demanda: 42 },
    { tamanho: 'GG', demanda: 18 },
  ];

  const rfmDistribution = [
    { name: 'Cônsules (VIP Top 5%)', value: 15, color: '#10b981' },
    { name: 'Engajados (Ativos)', value: 45, color: '#3b82f6' },
    { name: 'Hibernando', value: 30, color: '#f59e0b' },
    { name: 'Frio / Sem Conversão', value: 10, color: '#ef4444' },
  ];

  useEffect(() => {
    if (sessionStorage.getItem('laromme_admin_auth') === 'true') {
      setIsAuthenticated(true);
      fetchLeads();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === MASTER_KEY) {
      setIsAuthenticated(true);
      sessionStorage.setItem('laromme_admin_auth', 'true');
      fetchLeads();
    }
  };

  const fetchLeads = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (data) setLeads(data);
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-brand-black min-h-screen text-brand-offwhite flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 p-10 space-y-8 shadow-2xl">
          <div className="text-center space-y-2">
            <span className="font-mono text-[9px] text-brand-red uppercase tracking-[0.3em] block">SISTEMA RESTRITO // LEVEL 5</span>
            <h1 className="font-serif text-3xl uppercase tracking-wider text-white">LaRomme OS</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              value={passcode} 
              onChange={(e) => setPasscode(e.target.value)} 
              placeholder="DECODIFICAR CHAVE MESTRA" 
              className="w-full bg-black border border-zinc-800 p-4 text-center font-mono text-xs text-white focus:border-brand-red outline-none transition-colors" 
            />
            <button 
              type="submit" 
              className="w-full bg-white text-black py-4 font-mono text-[10px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all"
            >
              [ AUTENTICAR SESSÃO ]
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-black min-h-screen text-brand-offwhite pt-24 pb-16 px-4 sm:px-8 font-sans selection:bg-brand-red selection:text-white">
      
      {/* HEADER DE COMANDO // BARRA DE INTEGRIDADE */}
      <header className="max-w-7xl mx-auto mb-8 bg-zinc-950 border border-zinc-900 p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl uppercase tracking-wider text-white">Córtex LaRomme</h1>
            <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5">RLS ATIVO</span>
            <span className="font-mono text-[9px] bg-zinc-900 text-zinc-400 px-2 py-0.5">v2.6 BUS-OS</span>
          </div>
          <p className="font-mono text-[10px] text-zinc-500 uppercase">SITREP: Lote Zero // Operação Normal // Margem Global: {((unitMargin / ecoPrice) * 100).toFixed(1)}%</p>
        </div>

        {/* STATUS QUICK CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto font-mono text-[9px]">
          <div className="bg-black border border-zinc-900 p-3">
            <span className="text-zinc-500 block">LEADS VIP</span>
            <span className="text-white text-sm font-bold">{leads.length > 0 ? leads.length : 210}</span>
          </div>
          <div className="bg-black border border-zinc-900 p-3">
            <span className="text-zinc-500 block">RUNWAY (DIAS)</span>
            <span className="text-emerald-400 text-sm font-bold">142 DIAS</span>
          </div>
          <div className="bg-black border border-zinc-900 p-3">
            <span className="text-zinc-500 block">BREAK-EVEN</span>
            <span className="text-brand-red text-sm font-bold">{breakEvenUnits} UNIDADES</span>
          </div>
          <div className="bg-black border border-zinc-900 p-3">
            <span className="text-zinc-500 block">ARELLA SUPPLY</span>
            <span className="text-blue-400 text-sm font-bold">380 PEÇAS</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* NAVEGAÇÃO LATERAL TIPO TERMINAL */}
        <nav className="w-full lg:w-60 flex-shrink-0 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 font-mono text-[10px] uppercase">
          {[
            { id: 'SITREP', label: '1. SITREP & SAÚDE' },
            { id: 'CRM', label: '2. CRM & SENADO' },
            { id: 'SUPPLY', label: '3. SUPPLY & KANBAN' },
            { id: 'TESOURARIA', label: '4. TESOURARIA & CAIXA' },
            { id: 'WARROOM', label: '5. WAR ROOM' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-left px-4 py-3.5 border-l-2 whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'border-brand-red bg-zinc-950 text-white font-bold' 
                  : 'border-zinc-900 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <div className="mt-auto pt-8 hidden lg:block border-t border-zinc-900/60 font-mono text-[9px] text-zinc-600 space-y-2">
            <div>SISTEMA: OK</div>
            <div>BANCO: POSTGRES DB</div>
            <div>SEGURANÇA: ENCRYPTED</div>
          </div>
        </nav>

        {/* ÁREA CENTRAL MÓDULO A MÓDULO */}
        <main className="flex-1 min-h-[600px]">
          <AnimatePresence mode="wait">
            
            {/* ================= MÓDULO 1: SITREP & SAÚDE GLOBAL ================= */}
            {activeTab === 'SITREP' && (
              <motion.div key="sitrep" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                
                {/* DAILY BRIEFING AUTOMÁTICO (SITREP) */}
                <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                    <span className="font-mono text-[9px] text-brand-red uppercase tracking-widest">[ DAILY BRIEFING EXECUTIVO ]</span>
                    <span className="font-mono text-[9px] text-zinc-500">{new Date().toLocaleDateString('pt-BR')}</span>
                  </div>
                  <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                    Operação estável. A taxa de captação de leads no Senado cresceu +14% nas últimas 48h. Custo fixo mensal coberto com margem projetada de 52%. O gargalo atual de produção está na fase de Costura da Arella (150 unidades do Artefato Boxy Origo).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gráfico de Caixa / Entradas vs Saídas */}
                  <div className="bg-zinc-950 border border-zinc-900 p-6 h-[320px] flex flex-col">
                    <h3 className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-4">Fluxo de Caixa Acumulado (Projeção)</h3>
                    <div className="flex-1 w-full h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={cashFlowTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                          <XAxis dataKey="dia" stroke="#71717a" fontSize={10} />
                          <YAxis stroke="#71717a" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', fontSize: '12px' }} />
                          <Area type="monotone" dataKey="entradas" stroke="#10b981" fill="#10b981" fillOpacity={0.1} name="Entradas (R$)" />
                          <Area type="monotone" dataKey="saídas" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} name="Saídas (R$)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Curva de Tamanhos (Sizing) */}
                  <div className="bg-zinc-950 border border-zinc-900 p-6 h-[320px] flex flex-col">
                    <h3 className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-4">Demanda por Tamanho (Curva Real LaRomme)</h3>
                    <div className="flex-1 w-full h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sizeCurveData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                          <XAxis dataKey="tamanho" stroke="#71717a" fontSize={10} />
                          <YAxis stroke="#71717a" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a' }} />
                          <Bar dataKey="demanda" fill="#ffffff" radius={[2, 2, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================= MÓDULO 2: CRM & MATRIZ RFM DO SENADO ================= */}
            {activeTab === 'CRM' && (
              <motion.div key="crm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Distribuição RFM */}
                  <div className="bg-zinc-950 border border-zinc-900 p-6 h-[320px] flex flex-col col-span-1">
                    <h3 className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-4">Matriz RFM do Senado</h3>
                    <div className="flex-1 w-full h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={rfmDistribution} innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                            {rfmDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', fontSize: '11px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Lista de Membros VIP / Dossiê */}
                  <div className="bg-zinc-950 border border-zinc-900 p-6 col-span-2 space-y-4">
                    <h3 className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest border-b border-zinc-900 pb-3">Dossiê do Cidadão (Clienteling VIP)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-mono text-[10px] border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-900 text-zinc-500 uppercase">
                            <th className="py-2">E-mail</th>
                            <th className="py-2">Cadastro</th>
                            <th className="py-2">Tier RFM</th>
                            <th className="py-2 text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                          {leads.slice(0, 8).map((l, i) => (
                            <tr key={i} className="hover:bg-zinc-900/40 cursor-pointer" onClick={() => setSelectedCustomer(l)}>
                              <td className="py-3 text-white">{l.email}</td>
                              <td className="py-3 text-zinc-400">{new Date(l.created_at).toLocaleDateString('pt-BR')}</td>
                              <td className="py-3"><span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5">CÔNSUL</span></td>
                              <td className="py-3 text-right"><span className="text-zinc-500 hover:text-white">[ DOSSIÊ ]</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* ================= MÓDULO 3: SUPPLY CHAIN & KANBAN ARELLA ================= */}
            {activeTab === 'SUPPLY' && (
              <motion.div key="supply" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-6">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                    <div>
                      <h3 className="font-serif text-2xl uppercase text-white">Supply Chain // Arella</h3>
                      <p className="font-mono text-[9px] text-zinc-500 uppercase mt-1">Status de Fabricação & Lotes em Andamento</p>
                    </div>
                    <span className="font-mono text-[10px] text-brand-red">[ 380 PEÇAS EM PRODUÇÃO ]</span>
                  </div>

                  {/* KANBAN BOARD */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {['Matéria-Prima', 'Corte', 'Costura', 'Cofre Pronto'].map((stage) => (
                      <div key={stage} className="bg-black border border-zinc-900 p-4 space-y-3">
                        <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block border-b border-zinc-900 pb-2">{stage}</span>
                        <div className="space-y-2">
                          {kanban.filter(k => k.stage === stage).map(item => (
                            <div key={item.id} className="bg-zinc-950 border border-zinc-800 p-3 text-xs font-mono space-y-1">
                              <span className="text-white block font-bold">{item.artifact}</span>
                              <div className="flex justify-between text-[9px] text-zinc-400">
                                <span>{item.qty} un</span>
                                <span className="text-brand-red">{item.provider}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================= MÓDULO 4: TESOURARIA & CAIXA ================= */}
            {activeTab === 'TESOURARIA' && (
              <motion.div key="tesouraria" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-zinc-950 border border-zinc-900 p-8 space-y-8">
                  <h3 className="font-serif text-2xl uppercase text-white border-b border-zinc-900 pb-4">Tesouraria & Demonstração de Resultado (DRE)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[10px]">
                    <div className="bg-black border border-zinc-800 p-6 space-y-2">
                      <span className="text-zinc-500 block">RECEITA BRUTA PROJETADA</span>
                      <span className="text-white text-3xl font-serif">R$ {(210 * ecoPrice).toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="bg-black border border-zinc-800 p-6 space-y-2">
                      <span className="text-zinc-500 block">IMPOSTOS + GATEWAY (10.5%)</span>
                      <span className="text-amber-400 text-3xl font-serif">R$ {(210 * (valTax + valGateway)).toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="bg-black border border-zinc-800 p-6 space-y-2">
                      <span className="text-zinc-500 block">LUCRO LÍQUIDO RETIDO</span>
                      <span className="text-emerald-400 text-3xl font-serif">R$ {(210 * unitMargin).toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================= MÓDULO 5: WAR ROOM (SIMULAÇÃO DE CENÁRIOS) ================= */}
            {activeTab === 'WARROOM' && (
              <motion.div key="warroom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-zinc-950 border border-zinc-900 p-8 space-y-8">
                  <h3 className="font-serif text-2xl uppercase text-white border-b border-zinc-900 pb-4">War Room // Stress Test Multi-Cenário</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[10px]">
                    <div className="bg-black border border-zinc-800 p-6 space-y-4">
                      <span className="text-zinc-400 font-bold block border-b border-zinc-800 pb-2">1. CENÁRIO CRÍTICO</span>
                      <p className="text-zinc-500">Conversão em 1%, CPC R$ 2,50.</p>
                      <div className="text-xl text-brand-red font-serif">LUCRO: R$ 4.200</div>
                    </div>
                    <div className="bg-black border border-zinc-800 p-6 space-y-4">
                      <span className="text-white font-bold block border-b border-zinc-800 pb-2">2. CENÁRIO BASE (REALISTA)</span>
                      <p className="text-zinc-500">Conversão em 2.5%, CPC R$ 1,20.</p>
                      <div className="text-xl text-white font-serif">LUCRO: R$ 18.500</div>
                    </div>
                    <div className="bg-black border border-emerald-500/30 p-6 space-y-4">
                      <span className="text-emerald-400 font-bold block border-b border-zinc-800 pb-2">3. CENÁRIO AGRESSIVO</span>
                      <p className="text-zinc-500">Conversão em 5%, CPC R$ 0,80.</p>
                      <div className="text-xl text-emerald-400 font-serif">LUCRO: R$ 42.100</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

      </div>
    </div>
  );
}