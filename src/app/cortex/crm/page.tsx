'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Search, MessageCircle, UserPlus, Download, 
  AlertCircle, ShieldCheck, Trophy, ChevronRight, Loader2
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type SportType = 'BEACH_TENNIS' | 'VOLEI' | 'CORRIDA' | 'TREINO_FORCA' | 'INDEFINIDO';

interface Customer {
  id: string;
  full_name: string;
  phone: string;
  city: string;
  orders_count: number;
  ltv: number;
  sport: SportType;
  is_vip: boolean;
}

const GIFT_MAP: Record<SportType, string> = {
  BEACH_TENNIS: 'Toalha de Rosto Algodão',
  VOLEI: 'Flanela Antiembaçante',
  CORRIDA: 'Presilha/Soft Flask',
  TREINO_FORCA: 'Grip Pad / Munhequeira',
  INDEFINIDO: 'Aguardando definição',
};

export default function CrmPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'TODOS' | 'SENADO_VIP' | 'SEM_ESPORTE'>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  // Busca dados reais do Supabase
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .order('ltv', { ascending: false });

        if (error) {
          console.warn('Tabela customers não encontrada ou vazia. Usando estado inicial seguro.');
          // Fallback seguro caso a tabela não exista ainda, para não quebrar a tela
          setCustomers([]);
        } else if (data) {
          setCustomers(data as Customer[]);
        }
      } catch (err) {
        console.error('Erro de conexão com DB:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const handleUpdateSport = async (id: string, newSport: SportType) => {
    // Atualização Otimista (Muda na tela na hora)
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, sport: newSport } : c));
    
    // Atualiza no Banco
    await supabase.from('customers').update({ sport: newSport }).eq('id', id);
  };

  const openWhatsApp = (customer: Customer, type: 'SONDAGEM' | 'CONCIERGE') => {
    const safePhone = customer.phone || '';
    const safeName = (customer.full_name || 'Patrono').split(' ')[0];
    
    let text = '';
    if (type === 'SONDAGEM') {
      text = encodeURIComponent(`Olá ${safeName}, aqui é da LaRomme. Seu pedido no Sistema ORIGO está em fase de preparação!\n\nPara incluirmos um presente de cortesia adequado à sua rotina física na caixa, conta para a gente: qual é o seu esporte principal hoje?`);
    } else {
      text = encodeURIComponent(`Olá ${safeName}, tudo bem? Passando para desejar uma excelente experiência com seus artefatos LaRomme. Nosso canal de Concierge está 100% à sua disposição.`);
    }
    window.open(`https://wa.me/${safePhone}?text=${text}`, '_blank');
  };

  // FILTRO SEGURO: Previne erro Cannot read properties of null
  const filteredCustomers = customers.filter(c => {
    const safeName = c.full_name || '';
    const safeCity = c.city || '';
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = safeName.toLowerCase().includes(searchLower) || safeCity.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;
    if (activeTab === 'SENADO_VIP') return c.is_vip;
    if (activeTab === 'SEM_ESPORTE') return c.sport === 'INDEFINIDO' || !c.sport;
    return true;
  });

  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* CABEÇALHO C-LEVEL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-serif tracking-wide uppercase">Base de Patronos</h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">Gestão de LTV, Senado VIP e Mapeamento de Esportes</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-medium text-zinc-600 bg-white border border-zinc-300 rounded hover:bg-zinc-50 transition-colors flex items-center gap-1.5 shadow-sm">
            <Download className="w-3.5 h-3.5" /> Exportar Relatório
          </button>
          <button className="px-3 py-1.5 text-xs font-bold text-white bg-zinc-900 rounded hover:bg-zinc-800 transition-colors flex items-center gap-1.5 shadow-sm">
            <UserPlus className="w-3.5 h-3.5" /> Adicionar Patrono
          </button>
        </div>
      </div>

      {/* CONTROLES E FILTROS */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 bg-white p-4 rounded-lg border border-zinc-200 shadow-sm">
        
        {/* TABS DE SEGMENTAÇÃO */}
        <div className="flex bg-zinc-100 p-1 rounded-md overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('TODOS')}
            className={`px-4 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'TODOS' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Todos ({customers.length})
          </button>
          <button
            onClick={() => setActiveTab('SENADO_VIP')}
            className={`px-4 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'SENADO_VIP' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Senado VIP
          </button>
          <button
            onClick={() => setActiveTab('SEM_ESPORTE')}
            className={`px-4 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'SEM_ESPORTE' ? 'bg-amber-50 text-amber-700 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" /> Sem Esporte
          </button>
        </div>

        {/* BARRA DE BUSCA */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar patrono ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-md pl-9 pr-3 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-shadow"
          />
        </div>
      </div>

      {/* TABELA DE DADOS */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 text-zinc-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-xs font-mono uppercase tracking-widest">Sincronizando dados...</span>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-zinc-400 gap-2">
            <Trophy className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">Nenhum patrono encontrado</p>
            <p className="text-[10px] text-zinc-400">Tabela vazia ou filtro sem resultados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                  <th className="py-3 px-5 font-bold">Patrono & Origem</th>
                  <th className="py-3 px-5 font-bold">Modalidade & Presente</th>
                  <th className="py-3 px-5 font-bold text-right">LTV Real</th>
                  <th className="py-3 px-5 font-bold text-center">Concierge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {filteredCustomers.map((customer) => {
                  const isIndefinido = !customer.sport || customer.sport === 'INDEFINIDO';
                  
                  return (
                    <tr key={customer.id} className="hover:bg-zinc-50/50 transition-colors">
                      {/* NOME E CIDADE */}
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-zinc-900">{customer.full_name || 'Sem Nome'}</span>
                          {customer.is_vip && (
                            <span className="bg-zinc-900 text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                              <ShieldCheck className="w-2.5 h-2.5" /> VIP
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          {customer.city || 'Cidade Desconhecida'}
                        </div>
                      </td>

                      {/* ESPORTE E PRESENTE */}
                      <td className="py-3 px-5">
                        <div className="flex flex-col gap-1.5">
                          <select
                            value={customer.sport || 'INDEFINIDO'}
                            onChange={(e) => handleUpdateSport(customer.id, e.target.value as SportType)}
                            className={`text-[11px] font-mono font-bold px-2 py-1 rounded border focus:outline-none transition-colors w-40 ${
                              isIndefinido
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-zinc-100 text-zinc-800 border-zinc-200'
                            }`}
                          >
                            <option value="BEACH_TENNIS">Beach Tennis</option>
                            <option value="VOLEI">Vôlei de Praia</option>
                            <option value="CORRIDA">Corrida / Street</option>
                            <option value="TREINO_FORCA">Treino de Força</option>
                            <option value="INDEFINIDO">Não Definido</option>
                          </select>
                          <div className="flex items-center gap-1 text-[9px] font-mono">
                            <span className="text-zinc-400">MIMO:</span>
                            <span className={isIndefinido ? 'text-amber-600' : 'text-zinc-700'}>
                              {GIFT_MAP[customer.sport || 'INDEFINIDO']}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* LTV */}
                      <td className="py-3 px-5 text-right font-mono">
                        <span className="font-bold text-emerald-700 block text-sm">{formatBRL(customer.ltv)}</span>
                        <span className="text-[9px] text-zinc-500">{customer.orders_count || 0} pedidos</span>
                      </td>

                      {/* AÇÕES CONCIERGE */}
                      <td className="py-3 px-5 text-center">
                        <div className="flex justify-center items-center">
                          {isIndefinido ? (
                            <button
                              onClick={() => openWhatsApp(customer, 'SONDAGEM')}
                              className="bg-zinc-900 text-white text-[10px] font-bold px-3 py-1.5 rounded hover:bg-zinc-800 transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                              <MessageCircle className="w-3.5 h-3.5" /> Sondar Esporte
                            </button>
                          ) : (
                            <button
                              onClick={() => openWhatsApp(customer, 'CONCIERGE')}
                              className="bg-white text-zinc-700 border border-zinc-300 text-[10px] font-bold px-3 py-1.5 rounded hover:bg-zinc-50 hover:text-zinc-900 transition-colors flex items-center gap-1.5"
                            >
                              <MessageCircle className="w-3.5 h-3.5" /> Concierge
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}