'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface OrderItem {
  id?: string;
  productId?: string;
  name: string;
  size: string;
  colorName?: string;
  quantity: number;
  priceNumeric?: number;
  price?: string;
}

interface Order {
  id: string;
  short_id?: string;
  created_at: string;
  status: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: any;
  items?: OrderItem[];
  subtotal?: number;
  total_amount?: number;
  tracking_code?: string;
  net_revenue?: number;
  cogs_total?: number;
}

interface RmaRequest {
  id: string;
  order_id?: string;
  reason_type?: string;
  reason_description?: string;
  proof_images?: string[];
  status: string;
  created_at: string;
  rejection_reason?: string;
}

export default function CortexPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [rmaRequests, setRmaRequests] = useState<RmaRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PEDIDOS' | 'RMA'>('PEDIDOS');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingCodeInput, setTrackingCodeInput] = useState<string>('');
  const [updating, setUpdating] = useState<boolean>(false);

  const fetchOrdersAndRma = async () => {
    setLoading(true);
    try {
      const { data: ordersData, error: ordersErr } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!ordersErr && ordersData) {
        setOrders(ordersData as Order[]);
      }

      const { data: rmaData, error: rmaErr } = await supabase
        .from('rma_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (!rmaErr && rmaData) {
        setRmaRequests(rmaData as RmaRequest[]);
      }
    } catch (err) {
      console.error('Erro ao carregar dados do Fulfillment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndRma();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (!error) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (e) {
      alert('Falha ao atualizar status do pedido.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveTrackingCode = async (orderId: string) => {
    if (!trackingCodeInput.trim()) return;
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          tracking_code: trackingCodeInput.trim(),
          status: 'shipped',
        })
        .eq('id', orderId);

      if (!error) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, tracking_code: trackingCodeInput.trim(), status: 'shipped' }
              : o
          )
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({
            ...selectedOrder,
            tracking_code: trackingCodeInput.trim(),
            status: 'shipped',
          });
        }
        setTrackingCodeInput('');
        alert('Código de rastreio gravado e pedido marcado como DESPACHADO.');
      }
    } catch (e) {
      alert('Erro ao salvar código de rastreamento.');
    } finally {
      setUpdating(false);
    }
  };

  const handleRmaAction = async (rmaId: string, newStatus: 'APPROVED' | 'REJECTED') => {
    let rejectionReason = '';
    if (newStatus === 'REJECTED') {
      rejectionReason = prompt('Motivo do indeferimento da devolução:') || 'Fora dos critérios de devolução.';
    }

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('rma_requests')
        .update({
          status: newStatus,
          rejection_reason: rejectionReason || null,
        })
        .eq('id', rmaId);

      if (!error) {
        setRmaRequests((prev) =>
          prev.map((r) =>
            r.id === rmaId ? { ...r, status: newStatus, rejection_reason: rejectionReason } : r
          )
        );
      }
    } catch (e) {
      alert('Erro ao processar ação de RMA.');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'ALL') return true;
    return o.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="px-2.5 py-1 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Pago • Separar</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">Despachado</span>;
      case 'pending':
        return <span className="px-2.5 py-1 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Aguardando Pix</span>;
      case 'canceled':
        return <span className="px-2.5 py-1 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">Cancelado</span>;
      default:
        return <span className="px-2.5 py-1 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/40 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-wide uppercase">Fulfillment & Esteira Logística</h1>
          <p className="text-xs text-slate-400 mt-1">Gestão de Separação, Embalagem, Despacho e Triagem de RMA</p>
        </div>

        {/* NAVEGAÇÃO DE ABAS */}
        <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('PEDIDOS')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'PEDIDOS'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Esteira de Pedidos ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('RMA')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'RMA'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Guarita RMA & Devoluções ({rmaRequests.length})
          </button>
        </div>
      </div>

      {/* ABA 1: ESTEIRA DE PEDIDOS */}
      {activeTab === 'PEDIDOS' && (
        <div className="space-y-6">
          {/* FILTROS RÁPIDOS */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium">Filtrar Estado:</span>
              {['ALL', 'paid', 'pending', 'shipped', 'canceled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                    statusFilter === st
                      ? 'bg-slate-800 text-slate-100 font-bold border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  {st === 'ALL' ? 'Todos' : st === 'paid' ? 'Aprovados' : st === 'pending' ? 'Pendentes' : st === 'shipped' ? 'Enviados' : 'Cancelados'}
                </button>
              ))}
            </div>

            <button
              onClick={fetchOrdersAndRma}
              className="text-xs text-slate-400 hover:text-slate-100 underline underline-offset-4"
            >
              Atualizar Dados
            </button>
          </div>

          {/* TABELA DE PEDIDOS */}
          <div className="rounded-xl border bg-slate-900/40 border-slate-800/80 overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">Consultando banco de dados de vendas...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">Nenhum pedido encontrado nesta categoria.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 border-b border-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Código / Data</th>
                      <th className="py-3.5 px-4">Patrono (Cliente)</th>
                      <th className="py-3.5 px-4">Itens</th>
                      <th className="py-3.5 px-4">Valor Total</th>
                      <th className="py-3.5 px-4">Estado</th>
                      <th className="py-3.5 px-4">Rastreio</th>
                      <th className="py-3.5 px-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-4 font-mono font-medium text-slate-200">
                          <div>#{order.short_id || order.id.substring(0, 8)}</div>
                          <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                            {new Date(order.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-200">{order.customer_name || 'Patrono Anônimo'}</div>
                          <div className="text-[11px] text-slate-400">{order.customer_email || '-'}</div>
                        </td>
                        <td className="py-4 px-4 text-slate-300">
                          {order.items && order.items.length > 0 ? (
                            <div>
                              <span className="font-semibold">{order.items[0].name}</span>
                              {order.items.length > 1 && (
                                <span className="text-slate-500 text-[10px] ml-1">+{order.items.length - 1} item(s)</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-500">Sem itens registrados</span>
                          )}
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-100">
                          R$ {((order.total_amount || order.subtotal || 0)).toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
                        <td className="py-4 px-4 font-mono text-[11px] text-slate-400">
                          {order.tracking_code ? (
                            <span className="text-emerald-400 font-semibold">{order.tracking_code}</span>
                          ) : (
                            <span className="text-slate-600">Pendente</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setTrackingCodeInput(order.tracking_code || '');
                            }}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-semibold transition-colors"
                          >
                            Gerenciar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 2: GUARITA RMA E DEVOLUÇÕES */}
      {activeTab === 'RMA' && (
        <div className="space-y-6">
          <div className="rounded-xl border bg-slate-900/40 border-slate-800/80 overflow-hidden shadow-sm p-6">
            <h2 className="text-sm font-semibold tracking-wide mb-4">Solicitações de Logística Reversa</h2>
            {rmaRequests.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">Nenhuma solicitação de troca ou devolução pendente.</p>
            ) : (
              <div className="space-y-4">
                {rmaRequests.map((rma) => (
                  <div key={rma.id} className="p-4 rounded-lg border border-slate-800 bg-slate-950/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">{rma.reason_type || 'DEVOLUÇÃO'}</span>
                        <span className="text-[10px] text-slate-500">#{rma.id.substring(0, 8)}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{rma.reason_description || 'Sem descrição fornecida.'}</p>
                      <p className="text-[10px] text-slate-500 mt-1">Data: {new Date(rma.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {rma.status === 'PENDING_TRIAGE' ? (
                        <>
                          <button
                            disabled={updating}
                            onClick={() => handleRmaAction(rma.id, 'APPROVED')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition-colors"
                          >
                            Aprovar Postagem
                          </button>
                          <button
                            disabled={updating}
                            onClick={() => handleRmaAction(rma.id, 'REJECTED')}
                            className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-500 text-white rounded text-xs font-semibold transition-colors"
                          >
                            Indeferir / Barrar
                          </button>
                        </>
                      ) : (
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                          rma.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {rma.status === 'APPROVED' ? 'Aprovado' : 'Indeferido'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE GERENCIAMENTO DE PEDIDO */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-6 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="font-serif text-lg font-bold">
                Pedido #{selectedOrder.short_id || selectedOrder.id.substring(0, 8)}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-xs text-slate-500 hover:text-slate-200"
              >
                [ Fechar ]
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Patrono</span>
                <span className="font-semibold text-slate-200">{selectedOrder.customer_name || 'Anônimo'}</span> ({selectedOrder.customer_email || 'Sem e-mail'})
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Status Atual</span>
                <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
              </div>

              {/* ATUALIZAÇÃO RÁPIDA DE STATUS */}
              <div className="border-t border-slate-800 pt-3">
                <span className="text-slate-400 block text-[10px] uppercase font-mono mb-2">Alterar Etapa Logística</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={updating}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'paid')}
                    className="px-2.5 py-1 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded text-[11px]"
                  >
                    Marcar Pago
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'shipped')}
                    className="px-2.5 py-1 bg-blue-950 border border-blue-800 text-blue-300 rounded text-[11px]"
                  >
                    Marcar Enviado
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'canceled')}
                    className="px-2.5 py-1 bg-rose-950 border border-rose-800 text-rose-300 rounded text-[11px]"
                  >
                    Cancelar
                  </button>
                </div>
              </div>

              {/* CÓDIGO DE RASTREIO */}
              <div className="border-t border-slate-800 pt-3 space-y-2">
                <label className="text-slate-400 block text-[10px] uppercase font-mono">
                  Código de Rastreamento (Correios / Transportadora)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={trackingCodeInput}
                    onChange={(e) => setTrackingCodeInput(e.target.value)}
                    placeholder="Ex: NL123456789BR"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <button
                    disabled={updating}
                    onClick={() => handleSaveTrackingCode(selectedOrder.id)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded text-xs transition-colors"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}