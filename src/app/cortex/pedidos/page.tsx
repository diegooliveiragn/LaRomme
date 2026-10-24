'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Package, Truck, Clock, CheckCircle2, AlertCircle, RefreshCw,
  Search, ArrowRight, Box, Send, ShieldCheck, MapPin, Tag, Filter
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type MicroStatus = 
  | 'PAGAMENTO_APROVADO'
  | 'EM_SEPARACAO'
  | 'EMBALANDO'
  | 'PRONTO_COLETA'
  | 'DESPACHADO'
  | 'ENTREGUE';

interface OrderItem {
  id: string;
  order_id: string;
  product_name?: string;
  name?: string;
  size?: string;
  quantity: number;
  unit_price?: number;
}

interface Order {
  id: string;
  short_id?: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  fulfillment_substatus?: MicroStatus;
  total_amount: number;
  subtotal?: number;
  shipping_cost?: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_street?: string;
  shipping_number?: string;
  shipping_neighborhood?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_cep?: string;
  tracking_code?: string;
  created_at: string;
  items?: OrderItem[];
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<string>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data: ordersData, error: ordersErr } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersErr) throw ordersErr;

      const { data: itemsData, error: itemsErr } = await supabase
        .from('order_items')
        .select('*');

      if (itemsErr) console.warn('Aviso: itens não carregados:', itemsErr.message);

      const itemsMap: Record<string, OrderItem[]> = {};
      (itemsData || []).forEach((item: any) => {
        if (!itemsMap[item.order_id]) itemsMap[item.order_id] = [];
        itemsMap[item.order_id].push(item);
      });

      const fullOrders: Order[] = (ordersData || []).map((ord: any) => {
        // Resolve substatus padrão se não existir na coluna
        let substatus: MicroStatus = ord.fulfillment_substatus;
        if (!substatus) {
          if (ord.status === 'delivered') substatus = 'ENTREGUE';
          else if (ord.status === 'shipped') substatus = 'DESPACHADO';
          else if (ord.status === 'paid') substatus = 'PAGAMENTO_APROVADO';
          else substatus = 'PAGAMENTO_APROVADO';
        }

        return {
          ...ord,
          fulfillment_substatus: substatus,
          items: itemsMap[ord.id] || [],
        };
      });

      setOrders(fullOrders);

      const initialTracking: Record<string, string> = {};
      fullOrders.forEach((o) => {
        if (o.tracking_code) initialTracking[o.id] = o.tracking_code;
      });
      setTrackingInputs(initialTracking);
    } catch (err: any) {
      console.error('Erro ao buscar pedidos no Supabase:', err);
      setActionStatus(`Erro ao carregar pedidos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Atualização de Micro-Status com 1 Clique
  const handleUpdateSubstatus = async (orderId: string, nextSubstatus: MicroStatus) => {
    setProcessingId(orderId);
    setActionStatus(`Atualizando pedido para ${nextSubstatus.replace('_', ' ')}...`);

    try {
      // Atualiza estado local imediatamente para fluidez
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, fulfillment_substatus: nextSubstatus } : o));

      // Tenta persistir no Supabase
      const { error } = await supabase
        .from('orders')
        .update({ fulfillment_substatus: nextSubstatus })
        .eq('id', orderId);

      if (error) {
        // Se a coluna ainda não existir no schema do banco, não impede a operação
        console.warn('Aviso ao persistir fulfillment_substatus:', error.message);
      }

      setActionStatus(`✓ Etapa atualizada: ${nextSubstatus.replace('_', ' ')}`);
    } catch (err: any) {
      console.error('Erro na transição:', err);
    } finally {
      setProcessingId(null);
      setTimeout(() => setActionStatus(null), 3000);
    }
  };

  // Despacho com Rastreio Oficial e Disparo de E-mail
  const handleDispatchOrder = async (order: Order) => {
    const trackingCode = (trackingInputs[order.id] || '').trim();
    if (!trackingCode) {
      alert('Informe o código de rastreamento antes de confirmar o despacho.');
      return;
    }

    setProcessingId(order.id);
    setActionStatus(`Processando despacho e gerando aviso de rastreio para ${order.customer_email}...`);

    try {
      const res = await fetch('/api/crm/despacho', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          trackingCode: trackingCode,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionStatus(`✓ Despacho registrado e e-mail enviado para ${order.customer_email}.`);
        await handleUpdateSubstatus(order.id, 'DESPACHADO');
        await fetchOrders();
      } else {
        setActionStatus(`Erro: ${data.error || 'Falha ao processar despacho.'}`);
      }
    } catch (err: any) {
      setActionStatus(`Erro de rede: ${err.message}`);
    } finally {
      setProcessingId(null);
      setTimeout(() => setActionStatus(null), 6000);
    }
  };

  const getSubstatusBadge = (substatus?: MicroStatus) => {
    switch (substatus) {
      case 'PAGAMENTO_APROVADO':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded uppercase">1. Aprovado</span>;
      case 'EM_SEPARACAO':
        return <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-black px-2 py-0.5 rounded uppercase">2. Em Separação</span>;
      case 'EMBALANDO':
        return <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[10px] font-black px-2 py-0.5 rounded uppercase">3. Embalando</span>;
      case 'PRONTO_COLETA':
        return <span className="bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] font-black px-2 py-0.5 rounded uppercase">4. Pronto p/ Coleta</span>;
      case 'DESPACHADO':
        return <span className="bg-blue-500/10 text-blue-300 border border-blue-500/30 text-[10px] font-black px-2 py-0.5 rounded uppercase">5. Despachado</span>;
      case 'ENTREGUE':
        return <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-black px-2 py-0.5 rounded uppercase">6. Entregue</span>;
      default:
        return <span className="bg-slate-800 text-slate-400 text-[10px] font-black px-2 py-0.5 rounded uppercase">Aguardando</span>;
    }
  };

  // Separação em colunas operacionais
  const activeOrders = orders.filter((o) => o.status !== 'pending' && o.status !== 'cancelled');
  const pendingReservations = orders.filter((o) => o.status === 'pending');

  const filteredOrders = activeOrders.filter((ord) => {
    const matchesStage = stageFilter === 'TODOS' || ord.fulfillment_substatus === stageFilter;
    const matchesSearch = 
      (ord.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ord.short_id || ord.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ord.customer_email || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const totalEmOperacao = activeOrders.filter(o => o.fulfillment_substatus !== 'ENTREGUE').length;
  const totalProntosEnvio = activeOrders.filter(o => o.fulfillment_substatus === 'PRONTO_COLETA').length;
  const totalEmTransito = activeOrders.filter(o => o.fulfillment_substatus === 'DESPACHADO').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 font-semibold block mb-1">
            Logística & Fulfillment
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white uppercase flex items-center gap-3">
            Esteira Operacional de Galpão
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1 font-bold">
            Fluxo Granular: Separação Física, Embalagem e Despacho
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sincronizar Pedidos</span>
        </button>
      </div>

      {/* FEEDBACK STATUS BAR */}
      {actionStatus && (
        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white flex items-center justify-between">
          <span>{actionStatus}</span>
          <button onClick={() => setActionStatus(null)} className="text-slate-400 hover:text-white ml-4">✕</button>
        </div>
      )}

      {/* KPIS DE FULFILLMENT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Na Bancada de Galpão
            </span>
            <Box className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-3xl font-black text-white tabular-nums tracking-tight block font-mono">
            {totalEmOperacao}
          </span>
          <span className="text-[11px] font-bold text-slate-500 mt-2 block">
            Em separação e embalagem
          </span>
        </div>

        <div className="p-5 rounded-xl border bg-purple-500/10 border-purple-500/30 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
              Prontos para Coleta
            </span>
            <Package className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-3xl font-black text-purple-300 tabular-nums tracking-tight block font-mono">
            {totalProntosEnvio}
          </span>
          <span className="text-[11px] font-bold text-purple-300/80 mt-2 block">
            Aguardando veículo de coleta
          </span>
        </div>

        <div className="p-5 rounded-xl border bg-blue-500/10 border-blue-500/30 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300">
              Em Trânsito (Correios)
            </span>
            <Truck className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-3xl font-black text-blue-300 tabular-nums tracking-tight block font-mono">
            {totalEmTransito}
          </span>
          <span className="text-[11px] font-bold text-blue-300/80 mt-2 block">
            Com código de rastreamento
          </span>
        </div>

        <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Reservas em Aberto
            </span>
            <Clock className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-3xl font-black text-rose-400 tabular-nums tracking-tight block font-mono">
            {pendingReservations.length}
          </span>
          <span className="text-[11px] font-bold text-slate-500 mt-2 block">
            Aguardando liquidação Pix
          </span>
        </div>
      </div>

      {/* FILTROS E BUSCA */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { key: 'TODOS', label: 'Todos' },
            { key: 'PAGAMENTO_APROVADO', label: '1. Aprovados' },
            { key: 'EM_SEPARACAO', label: '2. Em Separação' },
            { key: 'EMBALANDO', label: '3. Embalando' },
            { key: 'PRONTO_COLETA', label: '4. Pronto p/ Coleta' },
            { key: 'DESPACHADO', label: '5. Despachados' },
            { key: 'ENTREGUE', label: '6. Entregues' },
          ].map(stage => (
            <button
              key={stage.key}
              onClick={() => setStageFilter(stage.key)}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all shrink-0 ${
                stageFilter === stage.key
                  ? 'bg-white text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar pedido ou patrono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-600 font-sans"
          />
        </div>
      </div>

      {/* LISTA / CARDS DA ESTEIRA GRANULAR */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-16 text-center text-xs font-mono font-bold text-slate-400 border border-slate-800 rounded-xl bg-slate-950/40">
            Sincronizando esteira operacional com o galpão...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono font-bold text-slate-500 border border-slate-800 rounded-xl bg-slate-950/40">
            Nenhum pedido localizado nesta etapa.
          </div>
        ) : (
          filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
            >
              {/* COLUNA ESQUERDA: IDENTIFICAÇÃO E ITENS */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-black text-white">
                    #{ord.short_id || ord.id.slice(0, 8)}
                  </span>
                  <span className="font-bold text-sm text-slate-200">{ord.customer_name || 'Patrono'}</span>
                  {getSubstatusBadge(ord.fulfillment_substatus)}
                  <span className="text-[11px] font-mono text-slate-500">
                    {new Date(ord.created_at).toLocaleDateString('pt-BR')} às {new Date(ord.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-300 flex flex-wrap items-center gap-2">
                  <span className="text-slate-400">Itens:</span>
                  <span className="font-bold text-white">
                    {ord.items && ord.items.length > 0
                      ? ord.items.map((i) => `${i.quantity}x ${i.product_name || i.name || 'Peça'} (${i.size || 'U'})`).join(', ')
                      : 'Itens em consolidação'}
                  </span>
                </div>

                {ord.shipping_city && (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {ord.shipping_street}, {ord.shipping_number} • {ord.shipping_city} - {ord.shipping_state} ({ord.shipping_cep})
                    </span>
                  </div>
                )}
              </div>

              {/* COLUNA DIREITA: VALOR & BOTÕES DE TRANSIÇÃO DE ETAPA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto border-t lg:border-t-0 border-slate-800 pt-4 lg:pt-0">
                <div className="text-left sm:text-right">
                  <span className="text-xs font-mono uppercase text-slate-500 font-bold block">Total Pago</span>
                  <span className="text-xl font-black font-mono text-white tabular-nums">
                    {formatBRL(Number(ord.total_amount || 0))}
                  </span>
                </div>

                {/* BOTÕES DE AVANÇO DA ESTEIRA */}
                <div className="flex flex-wrap items-center gap-2">
                  {ord.fulfillment_substatus === 'PAGAMENTO_APROVADO' && (
                    <button
                      onClick={() => handleUpdateSubstatus(ord.id, 'EM_SEPARACAO')}
                      disabled={processingId === ord.id}
                      className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>Iniciar Separação</span>
                    </button>
                  )}

                  {ord.fulfillment_substatus === 'EM_SEPARACAO' && (
                    <button
                      onClick={() => handleUpdateSubstatus(ord.id, 'EMBALANDO')}
                      disabled={processingId === ord.id}
                      className="px-3.5 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Mover p/ Embalagem</span>
                    </button>
                  )}

                  {ord.fulfillment_substatus === 'EMBALANDO' && (
                    <button
                      onClick={() => handleUpdateSubstatus(ord.id, 'PRONTO_COLETA')}
                      disabled={processingId === ord.id}
                      className="px-3.5 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Pronto p/ Coleta</span>
                    </button>
                  )}

                  {ord.fulfillment_substatus === 'PRONTO_COLETA' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Código de Rastreio..."
                        value={trackingInputs[ord.id] || ''}
                        onChange={(e) => setTrackingInputs({ ...trackingInputs, [ord.id]: e.target.value })}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                      />
                      <button
                        onClick={() => handleDispatchOrder(ord)}
                        disabled={processingId === ord.id}
                        className="px-3.5 py-2 bg-emerald-500 text-slate-950 hover:bg-emerald-400 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Despachar</span>
                      </button>
                    </div>
                  )}

                  {ord.fulfillment_substatus === 'DESPACHADO' && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-blue-300 bg-blue-500/10 border border-blue-500/30 px-2 py-1 rounded">
                        Rastreio: {ord.tracking_code || 'Emissão em lote'}
                      </span>
                      <button
                        onClick={() => handleUpdateSubstatus(ord.id, 'ENTREGUE')}
                        disabled={processingId === ord.id}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        Confirmar Entrega
                      </button>
                    </div>
                  )}

                  {ord.fulfillment_substatus === 'ENTREGUE' && (
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Concluído
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}