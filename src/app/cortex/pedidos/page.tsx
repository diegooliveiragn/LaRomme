'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

      const fullOrders: Order[] = (ordersData || []).map((ord: any) => ({
        ...ord,
        items: itemsMap[ord.id] || [],
      }));

      setOrders(fullOrders);

      // Preenche tracking inputs existentes
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

  const handleDispatchOrder = async (order: Order) => {
    const trackingCode = (trackingInputs[order.id] || '').trim();
    if (!trackingCode) {
      alert('Informe o código de rastreamento antes de confirmar o despacho.');
      return;
    }

    setProcessingId(order.id);
    setActionStatus(`Processando despacho do pedido ${order.short_id || order.id}...`);

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
        setActionStatus(`✓ Despacho registrado e e-mail enviado com sucesso para ${order.customer_email}.`);
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

  const handleRecoverOrder = async (order: Order) => {
    setProcessingId(order.id);
    setActionStatus(`Enviando recuperação para ${order.customer_email}...`);

    try {
      const res = await fetch('/api/crm/recuperacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      });

      const data = await res.json();
      if (data.success) {
        setActionStatus(`✓ Recuperação de reserva enviada para ${order.customer_email}.`);
      } else {
        setActionStatus(`Erro: ${data.error || 'Falha ao recuperar pedido.'}`);
      }
    } catch (err: any) {
      setActionStatus(`Erro de rede: ${err.message}`);
    } finally {
      setProcessingId(null);
      setTimeout(() => setActionStatus(null), 5000);
    }
  };

  // Separação em colunas
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const paidOrders = orders.filter((o) => o.status === 'paid');
  const dispatchedOrders = orders.filter((o) => o.status === 'shipped' || o.status === 'delivered');

  // KPIs
  const totalCount = orders.length;
  const totalRevenue = orders
    .filter((o) => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered')
    .reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 font-semibold block mb-1">
            Módulo Administrativo • Fulfillment
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white uppercase">
            Esteira de Separação & Despacho
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
          >
            Sincronizar Pedidos
          </button>
        </div>
      </div>

      {/* FEEDBACK STATUS BAR */}
      {actionStatus && (
        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-slate-100 flex items-center justify-between">
          <span>{actionStatus}</span>
          <button onClick={() => setActionStatus(null)} className="text-slate-400 hover:text-white ml-4">✕</button>
        </div>
      )}

      {/* KPIS DE ALTO IMPACTO VISUAL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800 shadow-sm">
          <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold block">
            Total de Pedidos
          </span>
          <span className="text-3xl font-black text-white tabular-nums tracking-tight mt-2 block">
            {totalCount}
          </span>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block">
            Registros na base
          </span>
        </div>

        <div className="p-5 rounded-xl border bg-amber-500/10 border-amber-500/30 shadow-sm">
          <span className="text-xs uppercase font-mono tracking-wider text-amber-300 font-bold block">
            PIX Pendente / Reserva
          </span>
          <span className="text-3xl font-black text-amber-400 tabular-nums tracking-tight mt-2 block">
            {pendingOrders.length}
          </span>
          <span className="text-[11px] font-bold text-amber-300/80 mt-1 block tabular-nums">
            {totalCount > 0 ? ((pendingOrders.length / totalCount) * 100).toFixed(1).replace('.', ',') : '0,0'}% em aberto
          </span>
        </div>

        <div className="p-5 rounded-xl border bg-emerald-500/10 border-emerald-500/30 shadow-sm">
          <span className="text-xs uppercase font-mono tracking-wider text-emerald-300 font-bold block">
            Prontos p/ Separação
          </span>
          <span className="text-3xl font-black text-emerald-400 tabular-nums tracking-tight mt-2 block">
            {paidOrders.length}
          </span>
          <span className="text-[11px] font-bold text-emerald-300/80 mt-1 block">
            Aguardando expedição
          </span>
        </div>

        <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800 shadow-sm">
          <span className="text-xs uppercase font-mono tracking-wider text-slate-300 font-bold block">
            Receita Liquidada
          </span>
          <span className="text-3xl font-black text-emerald-400 tabular-nums tracking-tight mt-2 block font-mono">
            R$ {totalRevenue.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block tabular-nums">
            {dispatchedOrders.length} pedidos despachados
          </span>
        </div>
      </div>

      {/* KANBAN BOARD */}
      {loading ? (
        <div className="p-16 text-center text-xs font-mono font-bold text-slate-400 border border-slate-800 rounded-xl bg-slate-950/40">
          Carregando esteira de fulfillment e integridade de estoque...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* COLUNA 1: PIX PENDENTE */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
            <div className="px-4 py-3.5 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-300 tracking-wider uppercase">1. Reservas Pendentes</h2>
              <span className="bg-amber-500/20 text-amber-300 text-xs font-black px-2.5 py-0.5 rounded tabular-nums border border-amber-500/30">
                {pendingOrders.length}
              </span>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-24rem)]">
              {pendingOrders.length === 0 ? (
                <p className="text-center text-xs font-mono text-slate-500 py-8">Nenhuma reserva pendente.</p>
              ) : (
                pendingOrders.map((ord) => (
                  <div key={ord.id} className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono font-bold text-amber-300">
                        #{ord.short_id || ord.id.slice(0, 8)}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
                        Aguardando Pix
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white">{ord.customer_name || 'Patrono'}</p>
                      <p className="text-xs font-mono text-slate-400">{ord.customer_email}</p>
                    </div>

                    <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80 text-xs font-mono text-slate-300 space-y-1">
                      {ord.items && ord.items.length > 0 ? (
                        ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between font-bold">
                            <span>{it.quantity}x {it.product_name || it.name || 'Peça'}</span>
                            <span className="text-slate-400">({it.size || 'U'})</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-500">Itens em processamento</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-800 pt-2.5">
                      <span className="text-sm font-black font-mono text-white tabular-nums">
                        R$ {Number(ord.total_amount || 0).toFixed(2).replace('.', ',')}
                      </span>
                      <button
                        onClick={() => handleRecoverOrder(ord)}
                        disabled={processingId === ord.id}
                        className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[11px] font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                      >
                        Recuperar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* COLUNA 2: PRONTO PARA SEPARAÇÃO (AÇÃO) */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
            <div className="px-4 py-3.5 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
              <h2 className="text-xs font-bold text-white tracking-wider uppercase">2. Em Separação (Ação)</h2>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-black px-2.5 py-0.5 rounded tabular-nums border border-emerald-500/30">
                {paidOrders.length}
              </span>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-24rem)]">
              {paidOrders.length === 0 ? (
                <p className="text-center text-xs font-mono text-slate-500 py-8">Nenhum pedido aguardando despacho.</p>
              ) : (
                paidOrders.map((ord) => (
                  <div key={ord.id} className="bg-slate-900/90 border border-emerald-500/30 rounded-lg p-4 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>

                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono font-bold text-emerald-300 block">
                          #{ord.short_id || ord.id.slice(0, 8)}
                        </span>
                        <p className="text-sm font-bold text-white mt-0.5">{ord.customer_name || 'Patrono'}</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                        Pago
                      </span>
                    </div>

                    <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80 text-xs font-mono text-slate-300 space-y-1">
                      <p className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800 pb-1 mb-1">
                        Conteúdo do Pacote:
                      </p>
                      {ord.items && ord.items.length > 0 ? (
                        ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between font-bold">
                            <span>{it.quantity}x {it.product_name || it.name || 'Peça'}</span>
                            <span className="text-slate-400">({it.size || 'U'})</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-500">Itens em consolidação</span>
                      )}
                    </div>

                    {ord.shipping_street && (
                      <div className="text-[11px] text-slate-400 space-y-0.5 border-t border-slate-800 pt-2">
                        <p className="font-bold text-slate-300 uppercase text-[10px]">Destino:</p>
                        <p className="truncate">{ord.shipping_street}, {ord.shipping_number || 'S/N'}</p>
                        <p className="truncate">{ord.shipping_city} - {ord.shipping_state} ({ord.shipping_cep})</p>
                      </div>
                    )}

                    <div className="space-y-2 border-t border-slate-800 pt-3">
                      <input
                        type="text"
                        placeholder="Código de Rastreio (ex: NL123456789BR)"
                        value={trackingInputs[ord.id] || ''}
                        onChange={(e) => setTrackingInputs({ ...trackingInputs, [ord.id]: e.target.value.toUpperCase() })}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 uppercase"
                      />

                      <button
                        onClick={() => handleDispatchOrder(ord)}
                        disabled={processingId === ord.id}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 shadow-sm"
                      >
                        {processingId === ord.id ? 'Despachando...' : 'Despachar & Notificar'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* COLUNA 3: DESPACHADOS (HISTÓRICO) */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
            <div className="px-4 py-3.5 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase">3. Concluídos / Em Trânsito</h2>
              <span className="bg-slate-800 text-slate-300 text-xs font-black px-2.5 py-0.5 rounded tabular-nums border border-slate-700">
                {dispatchedOrders.length}
              </span>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-24rem)]">
              {dispatchedOrders.length === 0 ? (
                <p className="text-center text-xs font-mono text-slate-500 py-8">Nenhum envio registrado.</p>
              ) : (
                dispatchedOrders.map((ord) => (
                  <div key={ord.id} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-600"></div>

                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono font-bold text-slate-300">
                        #{ord.short_id || ord.id.slice(0, 8)}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {ord.status === 'delivered' ? 'Entregue' : 'Em Trânsito'}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-200">{ord.customer_name || 'Patrono'}</p>
                      <p className="text-xs font-mono text-slate-400">{ord.customer_email}</p>
                    </div>

                    {ord.tracking_code && (
                      <div className="bg-slate-950 p-2 rounded border border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-white tracking-wider">
                          {ord.tracking_code}
                        </span>
                        <a
                          href={`https://rastreamento.correios.com.br/app/index.php?codigo=${ord.tracking_code}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 underline"
                        >
                          Rastrear
                        </a>
                      </div>
                    )}

                    <div className="flex justify-between items-center border-t border-slate-800 pt-2 text-xs font-mono font-bold text-slate-400 tabular-nums">
                      <span>R$ {Number(ord.total_amount || 0).toFixed(2).replace('.', ',')}</span>
                      <span className="text-[10px] text-slate-500">
                        {ord.created_at ? new Date(ord.created_at).toLocaleDateString('pt-BR') : '—'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}