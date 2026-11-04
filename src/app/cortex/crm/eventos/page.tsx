'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Calendar, MapPin, Users, DollarSign, Target, Plus, 
  Trash2, Edit2, X, RefreshCw, Trophy, ArrowUpRight, CheckCircle2, BarChart2 
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface EventActivation {
  id: string;
  name: string;
  sport: string;
  location: string;
  startDate: string;
  endDate: string;
  budgetCost: number; // Custo de quadra, kits grátis, estrutura e mídia
  kitsCount: number;
  expectedAthletes: number;
  status: 'PLANEJADO' | 'EM_ANDAMENTO' | 'CONCLUIDO';
  notes?: string;
}

const INITIAL_EVENTS: EventActivation[] = [
  {
    id: 'EVT-01',
    name: 'LaRomme na Praia • Vôlei & Futevôlei',
    sport: 'Vôlei de Praia / Futevôlei',
    location: 'Praia de Iracema / Beira-Mar (Fortaleza)',
    startDate: '2026-08-10',
    endDate: '2026-08-13',
    budgetCost: 3000.00,
    kitsCount: 30,
    expectedAthletes: 40,
    status: 'PLANEJADO',
    notes: 'Kits com Camiseta Tenax + Sacochila. QR Code na quadra direcionando para o Senado VIP.'
  }
];

export default function CortexEventosPage() {
  const [events, setEvents] = useState<EventActivation[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [vipLeads, setVipLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [sport, setSport] = useState('Vôlei de Praia / Futevôlei');
  const [location, setLocation] = useState('Praia de Iracema (Fortaleza)');
  const [startDate, setStartDate] = useState('2026-08-10');
  const [endDate, setEndDate] = useState('2026-08-13');
  const [budgetCost, setBudgetCost] = useState('3000.00');
  const [kitsCount, setKitsCount] = useState('30');
  const [expectedAthletes, setExpectedAthletes] = useState('40');
  const [status, setStatus] = useState<'PLANEJADO' | 'EM_ANDAMENTO' | 'CONCLUIDO'>('PLANEJADO');
  const [notes, setNotes] = useState('');

  const fetchEventData = async () => {
    setLoading(true);
    try {
      // 1. Carrega eventos salvos no cache/localStorage
      const saved = localStorage.getItem('laromme_eventos_v1');
      if (saved) {
        setEvents(JSON.parse(saved));
      } else {
        setEvents(INITIAL_EVENTS);
      }

      // 2. Consulta pedidos do Supabase
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*');
      setOrders(ordersData || []);

      // 3. Consulta leads do Senado VIP
      const { data: vipData } = await supabase
        .from('senado_vip')
        .select('*');
      setVipLeads(vipData || []);
    } catch (e) {
      console.error('Erro ao buscar dados de eventos:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, []);

  const saveEvents = (updated: EventActivation[]) => {
    setEvents(updated);
    localStorage.setItem('laromme_eventos_v1', JSON.stringify(updated));
  };

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setSport('Vôlei de Praia / Futevôlei');
    setLocation('Praia de Iracema (Fortaleza)');
    setStartDate('2026-08-10');
    setEndDate('2026-08-13');
    setBudgetCost('3000.00');
    setKitsCount('30');
    setExpectedAthletes('40');
    setStatus('PLANEJADO');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (evt: EventActivation) => {
    setEditingId(evt.id);
    setName(evt.name);
    setSport(evt.sport);
    setLocation(evt.location);
    setStartDate(evt.startDate);
    setEndDate(evt.endDate);
    setBudgetCost(evt.budgetCost.toString());
    setKitsCount(evt.kitsCount.toString());
    setExpectedAthletes(evt.expectedAthletes.toString());
    setStatus(evt.status);
    setNotes(evt.notes || '');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir esta ativação/evento?')) {
      const updated = events.filter(e => e.id !== id);
      saveEvents(updated);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBudget = Number(budgetCost.replace(',', '.')) || 0;
    const cleanKits = parseInt(kitsCount) || 0;
    const cleanAthletes = parseInt(expectedAthletes) || 0;

    if (editingId) {
      const updated = events.map(evt =>
        evt.id === editingId
          ? { ...evt, name, sport, location, startDate, endDate, budgetCost: cleanBudget, kitsCount: cleanKits, expectedAthletes: cleanAthletes, status, notes }
          : evt
      );
      saveEvents(updated);
    } else {
      const newEvt: EventActivation = {
        id: `EVT-${String(events.length + 1).padStart(2, '0')}`,
        name,
        sport,
        location,
        startDate,
        endDate,
        budgetCost: cleanBudget,
        kitsCount: cleanKits,
        expectedAthletes: cleanAthletes,
        status,
        notes
      };
      saveEvents([...events, newEvt]);
    }

    setIsModalOpen(false);
  };

  // Cálculos de Retorno por Janela Temporal do Evento
  const calculateEventMetrics = (evt: EventActivation) => {
    const start = new Date(evt.startDate).getTime();
    const end = new Date(evt.endDate).getTime() + (24 * 3600 * 1000); // Até o fim do dia final

    // Vendas dentro da janela do evento
    const eventOrders = orders.filter((o) => {
      const orderDate = new Date(o.created_at).getTime();
      return orderDate >= start && orderDate <= end && (o.status === 'paid' || o.status === 'delivered');
    });
    const revenueGenerated = eventOrders.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);

    // Leads do Senado VIP captados no período do evento
    const leadsGenerated = vipLeads.filter((l) => {
      const leadDate = new Date(l.created_at).getTime();
      return leadDate >= start && leadDate <= end;
    }).length;

    const roi = evt.budgetCost > 0 ? ((revenueGenerated - evt.budgetCost) / evt.budgetCost) * 100 : 0;
    const costPerAthlete = evt.expectedAthletes > 0 ? evt.budgetCost / evt.expectedAthletes : 0;

    return {
      revenueGenerated,
      ordersCount: eventOrders.length,
      leadsGenerated,
      roi,
      costPerAthlete
    };
  };

  const totalInvested = events.reduce((acc, curr) => acc + curr.budgetCost, 0);

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            MARKETING EM QUADRA • ATIVAÇÕES & EVENT MARKETING
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Ativações, Torneios & Eventos de Praia
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Planejamento de Kits, Orçamentos de Quadra e Retorno de Tráfego / Vendas Pós-Ação
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Planejar Ativação</span>
          </button>
          <button
            onClick={fetchEventData}
            disabled={loading}
            className="px-3 py-2 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPIS GERAIS DE EVENTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
            Investimento Alocado em Ações
          </span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
            {formatBRL(totalInvested)}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            {events.length} ativações registradas na esteira
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 block mb-2">
            Estratégia de Aquisição
          </span>
          <div className="text-2xl font-bold text-zinc-900 font-mono tracking-tight">
            Quadra ➔ Senado VIP
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            Conversão física com QR Code e kits proprietários
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
            DNA do Território
          </span>
          <div className="text-2xl font-bold text-zinc-900 font-mono tracking-tight">
            Fortaleza / Litoral
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            Foco em Beach Tennis, Vôlei e Corrida
          </p>
        </div>

      </div>

      {/* CARDS DETALHADOS DE EVENTOS CADASTRADOS */}
      <div className="space-y-4">
        {events.map((evt) => {
          const metrics = calculateEventMetrics(evt);

          return (
            <div key={evt.id} className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-zinc-50/50">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold bg-zinc-900 text-white px-2 py-0.5 rounded uppercase">
                      {evt.id}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                      evt.status === 'CONCLUIDO' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : evt.status === 'EM_ANDAMENTO' 
                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {evt.status}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      Modalidade: {evt.sport}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold font-serif text-zinc-900 uppercase tracking-wide">
                    {evt.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      {new Date(evt.startDate).toLocaleDateString('pt-BR')} até {new Date(evt.endDate).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      {evt.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end lg:self-center">
                  <button
                    onClick={() => openEditModal(evt)}
                    className="p-2 text-zinc-500 hover:text-zinc-900 border border-zinc-200 rounded bg-white hover:bg-zinc-50 transition-colors shadow-xs"
                    title="Editar Ativação"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(evt.id)}
                    className="p-2 text-zinc-400 hover:text-rose-600 border border-zinc-200 rounded bg-white hover:bg-rose-50 transition-colors shadow-xs"
                    title="Excluir Ativação"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* AUDITORIA DE RETORNO DA ATIVAÇÃO */}
              <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs border-b border-zinc-100">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Orçamento Alocado</span>
                  <p className="text-base font-bold text-zinc-900">{formatBRL(evt.budgetCost)}</p>
                  <span className="text-[10px] text-zinc-500">{evt.kitsCount} kits distribuídos</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Custo por Atleta Presente</span>
                  <p className="text-base font-bold text-zinc-900">{formatBRL(metrics.costPerAthlete)}</p>
                  <span className="text-[10px] text-zinc-500">{evt.expectedAthletes} atletas estimados</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Vendas no Período</span>
                  <p className="text-base font-bold text-emerald-600">{formatBRL(metrics.revenueGenerated)}</p>
                  <span className="text-[10px] text-zinc-500">{metrics.ordersCount} pedidos liquidados</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Leads Conquistados (VIP)</span>
                  <p className="text-base font-bold text-zinc-900">{metrics.leadsGenerated} novos cadastros</p>
                  <span className="text-[10px] text-emerald-600 font-semibold">Senado VIP local</span>
                </div>
              </div>

              {evt.notes && (
                <div className="px-6 py-3 bg-zinc-50/60 text-xs font-mono text-zinc-600 flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>{evt.notes}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL CRUD ATIVAÇÃO / EVENTO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-zinc-200 p-6 max-w-lg w-full shadow-xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h3 className="font-serif text-base font-bold uppercase text-zinc-900">
                {editingId ? 'Editar Ativação' : 'Planejar Nova Ativação de Praia'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-zinc-600 mb-1 uppercase font-bold">Nome do Evento / Ação:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: LaRomme na Praia • Vôlei & Futevôlei"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded font-sans text-xs focus:outline-none focus:border-zinc-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Modalidade Esportiva:</label>
                  <input
                    type="text"
                    required
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    placeholder="Ex: Beach Tennis, Vôlei de Praia"
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Local / Praia:</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Beira-Mar, Fortaleza"
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Data Inicial:</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Data Final:</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Orçamento (R$):</label>
                  <input
                    type="text"
                    required
                    value={budgetCost}
                    onChange={(e) => setBudgetCost(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Kits Oferecidos:</label>
                  <input
                    type="number"
                    value={kitsCount}
                    onChange={(e) => setKitsCount(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Atletas Alvo:</label>
                  <input
                    type="number"
                    value={expectedAthletes}
                    onChange={(e) => setExpectedAthletes(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-600 mb-1 uppercase font-bold">Status:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                >
                  <option value="PLANEJADO">PLANEJADO</option>
                  <option value="EM_ANDAMENTO">EM ANDAMENTO</option>
                  <option value="CONCLUIDO">CONCLUÍDO</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-600 mb-1 uppercase font-bold">Observações / Mecânica do Kit:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: QR Code no banner da quadra para cadastro no Senado VIP..."
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded font-sans text-xs focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 text-zinc-600 rounded text-xs font-bold uppercase tracking-wider hover:bg-zinc-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  Salvar Ativação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}