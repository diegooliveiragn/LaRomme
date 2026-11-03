'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package, Truck, Clock, CheckCircle2, AlertCircle, RefreshCw,
  Search, ArrowRight, Box, Send, ShieldCheck, MapPin, Tag, Filter,
  Printer, Layers
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
  
  // Controle de Impressão (individual ou lote)
  const [printOrdersList, setPrintOrdersList] = useState<Order[]>([]);

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
        return {
          ...ord,
          fulfillment_substatus: substatus,
          total_amount: Number(ord.total_amount || ord.total || 0),
          order_items: ord.order_items || ord.items || []
        };
      });

      setOrders(fullOrders);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const isLocalFortaleza = (order: Order) => {
    const city = (order.shipping_city || '').toLowerCase();
    const state = (order.shipping_state || '').toUpperCase();
    const cep = (order.shipping_cep || '').replace(/\D/g, '');
    return city.includes('fortaleza') || state === 'CE' || (cep.startsWith('60') || cep.startsWith('61'));
  };

  // Impressão individual
  const handlePrintSingle = (order: Order) => {
    setPrintOrdersList([order]);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Impressão em lote: apenas pedidos aprovados ou em separação
  const handlePrintBatch = () => {
    const pendingOrders = orders.filter(o => 
      o.fulfillment_substatus === 'PAGAMENTO_APROVADO' || 
      o.fulfillment_substatus === 'EM_SEPARACAO' ||
      o.status === 'approved' ||
      o.status === 'paid'
    );

    if (pendingOrders.length === 0) {
      alert('Não há pedidos pendentes de empacotamento no momento.');
      return;
    }

    setPrintOrdersList(pendingOrders);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleUpdateStatus = async (orderId: string, nextStatus: MicroStatus) => {
    setProcessingId(orderId);
    setActionStatus(null);
    try {
      const res = await fetch(`/api/admin/orders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          fulfillment_substatus: nextStatus
        })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, fulfillment_substatus: nextStatus } : o));
        setActionStatus(`Status atualizado para: ${nextStatus}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDispatch = async (order: Order) => {
    const tracking = trackingInputs[order.id] || order.tracking_code || '';
    if (!tracking) {
      alert('Informe o código de rastreamento ou identificação do motoboy.');
      return;
    }
    setProcessingId(order.id);
    try {
      const res = await fetch('/api/crm/despacho', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: order.id,
          tracking_code: tracking,
          customer_email: order.customer_email,
          customer_name: order.customer_name
        })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === order.id ? { 
          ...o, 
          fulfillment_substatus: 'DESPACHADO', 
          tracking_code: tracking,
          status: 'shipped' 
        } : o));
        setActionStatus(`Pedido #${order.short_id || order.id.slice(0, 8)} despachado.`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredOrders = orders.filter(o => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (o.short_id && o.short_id.toString().includes(term)) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(term)) ||
      (o.customer_email && o.customer_email.toLowerCase().includes(term));
    const matchesStage = stageFilter === 'TODOS' || o.fulfillment_substatus === stageFilter;
    return matchesSearch && matchesStage;
  });

  const pendingBatchCount = orders.filter(o => 
    o.fulfillment_substatus === 'PAGAMENTO_APROVADO' || 
    o.fulfillment_substatus === 'EM_SEPARACAO' ||
    o.status === 'approved' ||
    o.status === 'paid'
  ).length;

  return (
    <>
      {/* TELA EXECUTIVA DO CORTEX (PADRÃO LIGHT MODE OFICIAL) */}
      <div className="min-h-screen bg-[#fafafa] text-zinc-900 p-6 md:p-10 font-sans selection:bg-zinc-200 print:hidden">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-200 pb-5 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
                  TERMINAL / PEDIDOS
                </span>
                <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded font-mono font-bold">
                  ● Banco Integrado
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight uppercase font-sans text-zinc-950">
                Bancada de Separação & Despacho
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Controle de montagem de caixas, geração de etiquetas térmicas e esteira de expedição.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* BOTÃO DE IMPRESSÃO EM LOTE */}
              <button
                onClick={handlePrintBatch}
                className="inline-flex items-center gap-2 text-xs font-mono bg-zinc-900 hover:bg-black text-white px-4 py-2.5 rounded font-bold transition-all shadow-sm"
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                Imprimir Lote Pendente ({pendingBatchCount})
              </button>

              <button
                onClick={fetchOrders}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-700 hover:text-black bg-white hover:bg-zinc-50 px-3 py-2 border border-zinc-300 rounded font-semibold transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Sincronizar
              </button>
            </div>
          </div>

          {actionStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs font-mono font-medium">
              ✓ {actionStatus}
            </div>
          )}

          {/* Filtros e Busca */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-mono">
            <div className="relative w-full md:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar por #ID, cliente ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded pl-8 pr-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 shadow-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {['TODOS', 'PAGAMENTO_APROVADO', 'EM_SEPARACAO', 'EMBALANDO', 'DESPACHADO'].map((stg) => (
                <button
                  key={stg}
                  onClick={() => setStageFilter(stg)}
                  className={`px-3 py-1 rounded border text-[11px] font-bold transition-colors ${
                    stageFilter === stg
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  {stg.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Cards de Pedidos */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="p-12 bg-white border border-zinc-200 rounded-lg text-center text-xs text-zinc-500 font-mono">
                {loading ? 'Consultando esteira de expedição...' : 'Nenhum pedido localizado nesta fase.'}
              </div>
            ) : (
              filteredOrders.map((ord) => {
                const isLocal = isLocalFortaleza(ord);
                const sub = ord.fulfillment_substatus || 'PAGAMENTO_APROVADO';

                return (
                  <div key={ord.id} className="p-5 bg-white border border-zinc-200 rounded-lg shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-zinc-950 font-mono">
                          #{ord.short_id || ord.id.slice(0, 8)}
                        </span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-bold uppercase ${
                          sub === 'DESPACHADO' 
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {sub.replace('_', ' ')}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                          isLocal
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}>
                          {isLocal ? '⚡ MOTOBOY LOCAL' : '📦 CORREIOS / BRASIL'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePrintSingle(ord)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-mono font-bold rounded border border-zinc-300 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5 text-zinc-600" />
                          Imprimir Térmica
                        </button>

                        <span className="text-sm font-bold text-emerald-600 font-mono ml-2">
                          R$ {ord.total_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Dados do Destinatário & Artefatos */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Patrono & Contato</span>
                        <span className="text-zinc-950 font-bold block uppercase">{ord.customer_name || 'Patrono'}</span>
                        <span className="text-zinc-600 block">{ord.customer_email}</span>
                        <span className="text-zinc-500 block">{ord.customer_phone || 'Sem telefone'}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Endereço de Custódia</span>
                        <span className="text-zinc-800 block">
                          {ord.shipping_street ? `${ord.shipping_street}, ${ord.shipping_number}` : 'Endereço registrado no pedido'}
                        </span>
                        <span className="text-zinc-600 block">
                          {ord.shipping_neighborhood ? `${ord.shipping_neighborhood} • ` : ''}{ord.shipping_city || 'Fortaleza'} - {ord.shipping_state || 'CE'}
                        </span>
                        <span className="text-zinc-500 block">{ord.shipping_cep}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">Artefatos para Separação</span>
                        <div className="space-y-1 mt-1">
                          {ord.order_items && ord.order_items.length > 0 ? (
                            ord.order_items.map((it, idx) => (
                              <div key={idx} className="flex justify-between items-center text-zinc-800 bg-zinc-50 px-2 py-1 rounded border border-zinc-200">
                                <span className="font-bold">{it.quantity}x {it.product_name || it.name || 'Artefato'}</span>
                                <span className="text-[10px] bg-zinc-200 px-1.5 py-0.5 rounded font-bold text-zinc-700 uppercase">
                                  Grade: {it.size || 'M'}
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-zinc-500">1x Artefato Drop 01</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ações da Esteira */}
                    <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        {sub === 'PAGAMENTO_APROVADO' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'EM_SEPARACAO')}
                            disabled={processingId === ord.id}
                            className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white rounded font-bold transition-colors"
                          >
                            1. Iniciar Separação →
                          </button>
                        )}
                        {sub === 'EM_SEPARACAO' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'EMBALANDO')}
                            disabled={processingId === ord.id}
                            className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white rounded font-bold transition-colors"
                          >
                            2. Caixas e Insumos Ok →
                          </button>
                        )}
                        {sub === 'EMBALANDO' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'PRONTO_COLETA')}
                            disabled={processingId === ord.id}
                            className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white rounded font-bold transition-colors"
                          >
                            3. Pronto para Despacho →
                          </button>
                        )}
                      </div>

                      {/* Despacho */}
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <input
                          type="text"
                          placeholder={isLocal ? "Nome Motoboy / Rota" : "Código Rastreio Correios"}
                          value={trackingInputs[ord.id] !== undefined ? trackingInputs[ord.id] : (ord.tracking_code || '')}
                          onChange={(e) => setTrackingInputs({ ...trackingInputs, [ord.id]: e.target.value })}
                          className="bg-white border border-zinc-300 rounded px-2.5 py-1 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 w-48 shadow-sm"
                        />
                        <button
                          onClick={() => handleDispatch(ord)}
                          disabled={processingId === ord.id}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider rounded text-[11px] transition-colors"
                        >
                          {ord.fulfillment_substatus === 'DESPACHADO' ? 'Reenviar Rastreio' : 'Despachar'}
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>

      {/* CUPOM TÉRMICO (RENDERIZADO APENAS NA IMPRESSORA COM SUPORTE A LOTE) */}
      {printOrdersList.length > 0 && (
        <div className="hidden print:block print:w-[72mm] text-black bg-white font-mono text-[11px] leading-tight mx-auto">
          {printOrdersList.map((printOrder, pIdx) => (
            <div 
              key={printOrder.id} 
              className={`p-2 ${pIdx < printOrdersList.length - 1 ? 'print:break-after-page mb-6' : ''}`}
            >
              <div className="text-center pb-2 border-b-2 border-dashed border-black">
                <h1 className="text-base font-black tracking-widest uppercase">LAROMME</h1>
                <p className="text-[9px] uppercase tracking-wider">Arquitetura de Vestuário • Fortaleza</p>
                <p className="text-[8px] text-zinc-700">03°43'16"S 38°32'41"W</p>
              </div>

              <div className="py-2 border-b border-black flex justify-between items-center text-[10px]">
                <div>
                  <span className="font-bold">PEDIDO:</span> #{printOrder.short_id || printOrder.id.slice(0, 8)}
                </div>
                <div>
                  {new Date(printOrder.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>

              {/* Rota Logística */}
              <div className="py-2 border-b border-black text-center">
                <span className="font-black text-xs uppercase px-2 py-0.5 border border-black inline-block">
                  {isLocalFortaleza(printOrder) ? '⚡ MOTOBOY EXPRESS LOCAL' : '📦 CORREIOS / MELHOR ENVIO'}
                </span>
              </div>

              {/* Dados do Destinatário */}
              <div className="py-2 border-b border-black space-y-1">
                <span className="font-bold text-[9px] uppercase block">DESTINATÁRIO (PATRONO):</span>
                <p className="font-black text-xs uppercase">{printOrder.customer_name || 'PATRONO'}</p>
                <p>{printOrder.shipping_street ? `${printOrder.shipping_street}, ${printOrder.shipping_number}` : 'Endereço cadastrado'}</p>
                <p>{printOrder.shipping_neighborhood} • {printOrder.shipping_city || 'Fortaleza'} - {printOrder.shipping_state || 'CE'}</p>
                <p className="font-black">CEP: {printOrder.shipping_cep}</p>
                <p>TEL: {printOrder.customer_phone || 'Não informado'}</p>
              </div>

              {/* Itens para Conferência de Bancada */}
              <div className="py-2 border-b-2 border-dashed border-black space-y-1.5">
                <span className="font-bold text-[9px] uppercase block">CONFERÊNCIA DE BANCADA (PACKING):</span>
                {printOrder.order_items && printOrder.order_items.length > 0 ? (
                  printOrder.order_items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-start text-[10px]">
                      <span>[ ] {it.quantity}x {it.product_name || it.name || 'Artefato'}</span>
                      <span className="font-black uppercase">TAM: {it.size || 'M'}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between items-start text-[10px]">
                    <span>[ ] 1x Artefato Drop 01</span>
                    <span className="font-black uppercase">TAM: M</span>
                  </div>
                )}
                <div className="text-[9px] pt-1 text-zinc-700">
                  <span>[ ] Certificado de Custódia incluso</span>
                </div>
              </div>

              {/* Rodapé do Cupom */}
              <div className="pt-3 text-center space-y-1 text-[8px] uppercase">
                <p className="font-bold">TOTAL: R$ {printOrder.total_amount.toFixed(2)} • LIQUIDADO</p>
                <p>LaRomme Origo Collection</p>
                <p>*** FIM DO COMPROVANTE ***</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}