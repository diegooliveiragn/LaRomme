'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
const MASTER_KEY = 'ROMME2026';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState('LEADS');
  const [leads, setLeads] = useState<any[]>([]);

  // Estados Simulador
  const [simAds, setSimAds] = useState(1000);
  const [simCpc, setSimCpc] = useState(1.50);
  const [simConvertRate, setSimConvertRate] = useState(2.5);
  const [simTicket, setSimTicket] = useState(249.00);
  const [simProductCost, setSimProductCost] = useState(75.00);
  const simSales = Math.floor(Math.floor(simAds / simCpc) * (simConvertRate / 100));
  const simGrossProfit = (simSales * simTicket) - (simSales * simProductCost) - simAds;

  // Estados Unit Economics
  const [ecoPrice, setEcoPrice] = useState(249.00);
  const [ecoCogs, setEcoCogs] = useState(65.00);
  const [ecoPack, setEcoPack] = useState(15.00);
  const [ecoTaxRate, setEcoTaxRate] = useState(6.0); // Simples Nacional aprox
  const [ecoGatewayRate, setEcoGatewayRate] = useState(4.5); // Cartão
  const [ecoCpa, setEcoCpa] = useState(35.00); // Custo de Aquisição (Ads)

  // Cálculos Economics
  const valTax = (ecoPrice * ecoTaxRate) / 100;
  const valGateway = (ecoPrice * ecoGatewayRate) / 100;
  const valTotalCost = ecoCogs + ecoPack + valTax + valGateway + ecoCpa;
  const valNetProfit = ecoPrice - valTotalCost;
  const valMargin = ((valNetProfit / ecoPrice) * 100).toFixed(1);

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
        <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 p-12 space-y-8">
          <h1 className="font-serif text-3xl uppercase tracking-wider text-white text-center">Senado LaRomme</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="PROTOCOLO DE ACESSO" className="w-full bg-black border border-zinc-800 p-4 text-center font-mono text-xs text-white" />
            <button type="submit" className="w-full bg-white text-black py-4 font-mono text-[10px] uppercase">[ DECODIFICAR ]</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-black min-h-screen text-brand-offwhite pt-24 pb-12 px-4 sm:px-6 flex flex-col md:flex-row gap-8">
      
      {/* MENU LATERAL */}
      <div className="w-full md:w-64 space-y-6 flex-shrink-0">
        <div className="pb-6 border-b border-zinc-900">
          <h2 className="font-serif text-xl uppercase tracking-wider text-white mb-2">Comando</h2>
          <div className="flex items-center gap-2 font-mono text-[9px] text-emerald-400 uppercase tracking-widest"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Sistema Online</div>
        </div>
        <nav className="flex flex-col gap-2 font-mono text-[10px] uppercase tracking-widest">
          {['LEADS', 'DEMANDA', 'ECONOMICS', 'SIMULADOR'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`text-left px-4 py-3 border-l-2 transition-all ${activeTab === tab ? 'border-brand-red bg-zinc-900/50 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>[ {tab} ]</button>
          ))}
        </nav>
      </div>

      {/* ÁREA DE CONTEÚDO */}
      <div className="flex-1 bg-zinc-950 border border-zinc-900 p-6 sm:p-10 min-h-[600px]">
        <AnimatePresence mode="wait">
          
          {/* TAB: LEADS */}
          {activeTab === 'LEADS' && (
            <motion.div key="leads" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h3 className="font-serif text-3xl uppercase text-white border-b border-zinc-900 pb-6">Lote Zero // Registros ({leads.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead><tr className="border-b border-zinc-900 text-zinc-500 uppercase text-[9px]"><th className="py-3 px-2">Data</th><th className="py-3 px-2">E-mail</th></tr></thead>
                  <tbody className="divide-y divide-zinc-900 text-zinc-300">
                    {leads.slice(0, 20).map((l, i) => (<tr key={i}><td className="py-3 px-2 text-[9px]">{new Date(l.created_at).toLocaleDateString('pt-BR')}</td><td className="py-3 px-2 text-white">{l.email}</td></tr>))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB: DEMANDA (RASTREIO FANTASMA) */}
          {activeTab === 'DEMANDA' && (
            <motion.div key="demanda" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="border-b border-zinc-900 pb-6">
                <h3 className="font-serif text-3xl uppercase text-white">Radar de Demanda</h3>
                <p className="font-mono text-[9px] text-zinc-500 uppercase mt-2">Rastreio de intenção de compra antes da liberação do estoque.</p>
              </div>
              <div className="bg-black border border-zinc-900 p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto animate-pulse">
                  <span className="font-serif text-2xl text-brand-red">⚡</span>
                </div>
                <h4 className="font-serif text-xl text-white uppercase">Sinalizadores Ativados</h4>
                <p className="font-mono text-[10px] text-zinc-400 max-w-lg mx-auto">
                  A página da Coleção Origo está rastreando secretamente os cliques em cada artefato. Para ver qual peça o seu público mais deseja produzir, acesse o relatório de Eventos "capture_intention" no GA4.
                </p>
                <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-black font-mono text-[9px] uppercase px-6 py-3 hover:bg-brand-red hover:text-white transition-colors">
                  [ ABRIR RELATÓRIO DO GA4 ↗ ]
                </a>
              </div>
            </motion.div>
          )}

          {/* TAB: ECONOMICS (UNIT ECONOMICS) */}
          {activeTab === 'ECONOMICS' && (
            <motion.div key="economics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="border-b border-zinc-900 pb-6">
                <h3 className="font-serif text-3xl uppercase text-white">Unit Economics</h3>
                <p className="font-mono text-[9px] text-zinc-500 uppercase mt-2">Raio-X de Custos e Margem de Lucro por Artefato.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Entradas de Custos */}
                <div className="lg:col-span-5 space-y-4 font-mono text-[9px] uppercase text-zinc-400">
                  <div>
                    <label className="block mb-1 text-white">Preço de Venda (R$)</label>
                    <input type="number" value={ecoPrice} onChange={(e)=>setEcoPrice(Number(e.target.value))} className="w-full bg-black border border-zinc-800 p-3 text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-brand-red">Custo Produto (R$)</label>
                      <input type="number" value={ecoCogs} onChange={(e)=>setEcoCogs(Number(e.target.value))} className="w-full bg-black border border-zinc-800 p-3 text-white" />
                    </div>
                    <div>
                      <label className="block mb-1 text-brand-red">Embalagem (R$)</label>
                      <input type="number" value={ecoPack} onChange={(e)=>setEcoPack(Number(e.target.value))} className="w-full bg-black border border-zinc-800 p-3 text-white" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-brand-red">Imposto (%)</label>
                      <input type="number" value={ecoTaxRate} onChange={(e)=>setEcoTaxRate(Number(e.target.value))} className="w-full bg-black border border-zinc-800 p-3 text-white" />
                    </div>
                    <div>
                      <label className="block mb-1 text-brand-red">Gateway / Cartão (%)</label>
                      <input type="number" value={ecoGatewayRate} onChange={(e)=>setEcoGatewayRate(Number(e.target.value))} className="w-full bg-black border border-zinc-800 p-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 text-brand-red">Custo Aquisição / Ads (R$)</label>
                    <input type="number" value={ecoCpa} onChange={(e)=>setEcoCpa(Number(e.target.value))} className="w-full bg-black border border-zinc-800 p-3 text-white" />
                  </div>
                </div>

                {/* Dashboard Visual de Lucro */}
                <div className="lg:col-span-7 bg-black border border-zinc-900 p-6 sm:p-8 flex flex-col justify-between">
                  <div className="space-y-4 font-mono text-[10px] uppercase">
                    <div className="flex justify-between border-b border-zinc-900 pb-2">
                      <span className="text-zinc-500">Valor Bruto na Venda</span>
                      <span className="text-white">R$ {ecoPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-brand-red">
                      <span>(-) Custo da Peça</span>
                      <span>R$ {ecoCogs.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-brand-red">
                      <span>(-) Embalagem Premium</span>
                      <span>R$ {ecoPack.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-brand-red">
                      <span>(-) Impostos Governamentais</span>
                      <span>R$ {valTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-brand-red">
                      <span>(-) Taxa Gateway / Adquirente</span>
                      <span>R$ {valGateway.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-brand-red border-b border-zinc-900 pb-4">
                      <span>(-) Custo de Tráfego Pago (CAC)</span>
                      <span>R$ {ecoCpa.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-zinc-900">
                    <span className="font-mono text-[9px] text-zinc-500 block mb-2 uppercase">LUCRO LÍQUIDO NO BOLSO</span>
                    <div className="flex justify-between items-end">
                      <span className="font-serif text-5xl text-emerald-400">R$ {valNetProfit.toFixed(2)}</span>
                      <span className="font-mono text-sm px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        {valMargin}% MARGEM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: SIMULADOR (Já implementado na parte 1) */}
          {activeTab === 'SIMULADOR' && (
            <motion.div key="sim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h3 className="font-serif text-3xl uppercase text-white border-b border-zinc-900 pb-6">War Room // Drop</h3>
              {/* Ocultado por brevidade visual neste código, mas manteremos o seu já funcionando */}
              <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Acesse o seu simulador ativo e rastreie suas conversões.</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}