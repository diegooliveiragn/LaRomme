'use client';

import React, { useEffect, useState } from 'react';
import {
  Package, Truck, Clock, CheckCircle2, AlertCircle, RefreshCw,
  Search, ArrowRight, Box, Send, ShieldCheck, MapPin, Tag, Filter
} from 'lucide-react';

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
  status: 'pending' | 'paid' | 'approved' | 'shipped' | 'delivered' | 'cancelled';
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
  order_items?: OrderItem[];
}

export default function CortexPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('TODOS');
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      const json = await res.json();
      const ordersData = json.success ? json.orders : [];

      const fullOrders: Order[] = (ordersData || []).map((ord: any) => {
        let substatus: MicroStatus = ord.fulfillment_substatus;
        if (!substatus) {
          if (ord.status === 'delivered') substatus = 'ENTREGUE';
          else if (ord.status === 'shipped' || ord.tracking_code) substatus = 'DESPACHADO';
          else substatus = 'PAGAMENTO_APROVADO';
        }
        ord.fulfillment_substatus = substatus;
        return ord;
      });

      setOrders(fullOrders);

      const initialTracking: Record<string, string> = {};
      fullOrders.forEach((o) => {
        if (o.tracking_code) initialTracking[o.id] = o.tracking_code;
      });
      setTrackingInputs(initialTracking);
    } catch (err: any) {
      console.error('Erro ao buscar pedidos no admin:', err);
      setActionStatus(`Erro ao carregar pedidos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateSubstatus = async (orderId: string, nextSubstatus: MicroStatus) => {
    setProcessingId(orderId);
    setActionStatus(`Atualizando etapa para ${nextSubstatus.replace('_', ' ')}...`);

    try {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, fulfillment_substatus: nextSubstatus } : o));

      // Atualiza via PATCH seguro na rota admin
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: nextSubstatus === 'DESPACHADO' ? 'shipped' : nextSubstatus === 'ENTREGUE' ? 'delivered' : 'approved',
          fulfillment_substatus: nextSubstatus
        }),
      });

      if (!res.ok) {
        console.warn('Aviso: persistência remota reportou erro');
      }

      setActionStatus(`✓ Etapa atualizada: ${nextSubstatus.replace('_', ' ')}`);
    } catch (err: any) {
      console.error('Erro na transição:', err);
    } finally {
      setProcessingId(null);
      setTimeout(() => setActionStatus(null), 3000);
    }
  };

  const handleDispatchOrder = async (order: Order) => {
    const trackingCode = (trackingInputs[order.id] || '').trim();
    if (!trackingCode) {
      alert('Informe o código de rastreamento antes de confirmar o despacho.');
      return;
    }

    setProcessingId(order.id);
    setActionStatus(`Processando despacho e enviando aviso para ${order.customer_email}...`);

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
        setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'shipped', tracking_code: trackingCode, fulfillment_substatus: 'DESPACHADO' } : o));
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
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded uppercase">1. Aprovado</span>;
      case 'EM_SEPARACAO':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold px-2.5 py-0.5 rounded uppercase">2. Em Separação</span>;
      case 'EMBALANDO':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold px-2.5 py-0.5 rounded uppercase">3. Embalando</span>;
      case 'PRONTO_COLETA':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold px-2.5 py-0.5 rounded uppercase">4. Pronto p/ Coleta</span>;
      case 'DESPACHADO':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold px-2.5 py-0.5 rounded uppercase">5. Despachado</span>;
      case 'ENTREGUE':
        return <span className="bg-zinc-100 text-zinc-800 border border-zinc-300 text-[11px] font-bold px-2.5 py-0.5 rounded uppercase">6. Entregue</span>;
      default:
        return <span className="bg-zinc-100 text-zinc-600 border border-zinc-200 text-[11px] font-bold px-2.5 py-0.5 rounded uppercase">Pendente</span>;
    }
  };

  const activeOrders = orders.filter((o) => o.status !== 'pending' && o.status !== 'cancelled');
  const pendingReservations = orders.filter((o) => o.status === 'pending');

  const filteredOrders = activeOrders.filter((ord) => {
    const matchesStage = stageFilter === 'TODOS' || ord.fulfillment_substatus === stageFilter;
    const matchesSearch =
      (ord.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ord.customer_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(ord.short_id || '').includes(searchTerm);
    return matchesStage && matchesSearch;
  });

  const totalEmOperacao = activeOrders.filter(o => o.fulfillment_substatus !== 'ENTREGUE' && o.fulfillment_substatus !== 'DESPACHADO').length;
  const totalProntosEnvio = activeOrders.filter(o => o.fulfillment_substatus === 'PRONTO_COLETA').length;
  const totalEmTransito = activeOrders.filter(o => o.fulfillment_substatus === 'DESPACHADO').length;

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">LOGÍSTICA & FULFILLMENT</span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Esteira Operacional de Galpão
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Fluxo Granular: Separação Física, Embalagem e Despacho
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sincronizar Pedidos</span>
        </button>
      </div>

      {/* FEEDBACK STATUS BAR */}
      {actionStatus && (
        <div className="p-3.5 rounded bg-zinc-900 text-xs font-mono font-bold text-white flex items-center justify-between shadow">
          <span>{actionStatus}</span>
          <button onClick={() => setActionStatus(null)} className="text-zinc-400 hover:text-white ml-4">✕</button>
        </div>
      )}

      {/* KPIS DE FULFILLMENT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
              Na Bancada de Galpão
            </span>
            <Box className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 tracking-tight font-mono">{totalEmOperacao}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Em separação e embalagem</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
              Prontos para Coleta
            </span>
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 tracking-tight font-mono">{totalProntosEnvio}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Aguardando veículo de coleta</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
              Em Trânsito (Correios)
            </span>
            <Truck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 tracking-tight font-mono">{totalEmTransito}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Com código de rastreamento</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
              Reservas em Aberto
            </span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 tracking-tight font-mono">{pendingReservations.length}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Aguardando liquidação Pix</p>
        </div>
      </div>

      {/* FILTROS E BUSCA */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 text-xs font-medium">
          {[
            { key: 'TODOS', label: 'Todos' },
            { key: 'PAGAMENTO_APROVADO', label: '1. Aprovados' },
            { key: 'EM_SEPARACAO', label: '2. Em Separação' },
            { key: 'EMBALANDO', label: '3. Embalando' },
            { key: 'PRONTO_COLETA', label: '4. Pronto p/ Coleta' },
            { key: 'DESPACHADO', label: '5. Despachados' },
            { key: 'ENTREGUE', label: '6. Entregues' },
          ].map((stage) => (
            <button
              key={stage.key}
              onClick={() => setStageFilter(stage.key)}
              className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
                stageFilter === stage.key
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200'
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar pedido ou patrono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 shadow-sm"
          />
        </div>
      </div>

      {/* LISTAGEM DE PEDIDOS */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-xs text-zinc-400 font-mono bg-white border border-zinc-200 rounded">
            Carregando ordens de galpão...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-400 font-mono bg-white border border-zinc-200 rounded">
            Nenhum pedido localizado nesta etapa.
          </div>
        ) : (
          filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="p-5 rounded-lg border border-zinc-200 bg-white hover:border-zinc-300 transition-all shadow-sm space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-zinc-900">
                    #{ord.short_id || ord.id.slice(0, 8)}
                  </span>
                  <span className="text-zinc-700 text-xs font-medium capitalize">
                    {ord.customer_name || 'Patrono Anônimo'}
                  </span>
                  {getSubstatusBadge(ord.fulfillment_substatus)}
                  <span className="text-[11px] font-mono text-zinc-400">
                    {new Date(ord.created_at).toLocaleDateString('pt-BR')} às {new Date(ord.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">Total Pago</span>
                  <span className="text-sm font-bold font-mono text-zinc-900">
                    R$ {Number(ord.total_amount || 0).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* ENDEREÇO E ITENS */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>
                    {ord.shipping_street ? `${ord.shipping_street}, ${ord.shipping_number}` : 'Endereço registrado'} • {ord.shipping_neighborhood || ''} • {ord.shipping_city || ''} - {ord.shipping_state || ''} ({ord.shipping_cep || ''})
                  </span>
                </div>

                {/* BOTÕES DE ETAPAS */}
                <div className="flex items-center gap-2 shrink-0">
                  {ord.fulfillment_substatus === 'PAGAMENTO_APROVADO' && (
                    <button
                      onClick={() => handleUpdateSubstatus(ord.id, 'EM_SEPARACAO')}
                      disabled={processingId === ord.id}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>Iniciar Separação</span>
                    </button>
                  )}

                  {ord.fulfillment_substatus === 'EM_SEPARACAO' && (
                    <button
                      onClick={() => handleUpdateSubstatus(ord.id, 'EMBALANDO')}
                      disabled={processingId === ord.id}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Concluir Embalagem</span>
                    </button>
                  )}

                  {ord.fulfillment_substatus === 'EMBALANDO' && (
                    <button
                      onClick={() => handleUpdateSubstatus(ord.id, 'PRONTO_COLETA')}
                      disabled={processingId === ord.id}
                      className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Pronto p/ Coleta</span>
                    </button>
                  )}

                  {ord.fulfillment_substatus === 'PRONTO_COLETA' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Código de Rastreio..."
                        value={trackingInputs[ord.id] || ''}
                        onChange={(e) => setTrackingInputs(prev => ({ ...prev, [ord.id]: e.target.value }))}
                        className="bg-white border border-zinc-300 rounded px-3 py-1.5 text-xs font-mono text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-emerald-600 shadow-sm"
                      />
                      <button
                        onClick={() => handleDispatchOrder(ord)}
                        disabled={processingId === ord.id}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Despachar</span>
                      </button>
                    </div>
                  )}

                  {ord.fulfillment_substatus === 'DESPACHADO' && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded font-semibold">
                        Rastreio: {ord.tracking_code || 'MOTOBOY-01'}
                      </span>
                      <button
                        onClick={() => handleUpdateSubstatus(ord.id, 'ENTREGUE')}
                        disabled={processingId === ord.id}
                        className="px-3 py-1 bg-zinc-800 hover:bg-zinc-900 text-white rounded text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        Confirmar Entrega
                      </button>
                    </div>
                  )}

                  {ord.fulfillment_substatus === 'ENTREGUE' && (
                    <span className="text-xs font-mono text-zinc-500 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Ordem Concluída
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