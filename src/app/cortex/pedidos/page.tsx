'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package, Truck, Clock, CheckCircle2, AlertCircle, RefreshCw,
  Search, ArrowRight, Box, Send, ShieldCheck, MapPin, Tag, Filter,
  Printer
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
  const [printOrder, setPrintOrder] = useState<Order | null>(null);

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

  const handlePrintThermal = (order: Order) => {
    setPrintOrder(order);
    setTimeout(() => {
      window.print();
    }, 150);
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
        setActionStatus(`Pedido #${order.short_id || order.id.slice(0, 8)} despachado com sucesso.`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const isLocalFortaleza = (order: Order) => {
    const city = (order.shipping_city || '').toLowerCase();
    const state = (order.shipping_state || '').toUpperCase();
    const cep = (order.shipping_cep || '').replace(/\D/g, '');
    return city.includes('fortaleza') || state === 'CE' || (cep.startsWith('60') || cep.startsWith('61'));
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

  return (
    <>
      {/* TELA PRINCIPAL DO CORTEX (OCULTA NA IMPRESSÃO TÉRMICA) */}
      <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans selection:bg-zinc-800 print:hidden">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Cabeçalho */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-800 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  CORTEX OS // FULFILLMENT & EXPEDIÇÃO
                </span>
                <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">
                  ESTEIRA LOGÍSTICA
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight uppercase font-mono">
                Bancada de Separação & Despacho
              </h1>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                Controle de montagem de caixas, geração de etiquetas térmicas e acionamento logístico.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchOrders}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white px-3 py-2 border border-zinc-800 rounded transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Sincronizar
              </button>
              <Link
                href="/cortex/estoque"
                className="text-xs font-mono text-zinc-400 hover:text-white px-3 py-2 border border-zinc-800 rounded transition-colors"
              >
                ← WMS & Demanda
              </Link>
            </div>
          </div>

          {actionStatus && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded text-emerald-400 text-xs font-mono">
              ✓ {actionStatus}
            </div>
          )}

          {/* Filtros e Busca */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-mono text-xs">
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar por #ID, cliente ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {['TODOS', 'PAGAMENTO_APROVADO', 'EM_SEPARACAO', 'EMBALANDO', 'DESPACHADO'].map((stg) => (
                <button
                  key={stg}
                  onClick={() => setStageFilter(stg)}
                  className={`px-2.5 py-1 rounded border text-[11px] transition-colors ${
                    stageFilter === stg
                      ? 'border-white bg-white text-black font-bold'
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {stg.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Pedidos da Bancada */}
          <div className="space-y-4 font-mono">
            {filteredOrders.length === 0 ? (
              <div className="p-12 bg-zinc-950 border border-zinc-800 rounded text-center text-xs text-zinc-500">
                {loading ? 'Consultando esteira de expedição...' : 'Nenhum pedido localizado nesta fase.'}
              </div>
            ) : (
              filteredOrders.map((ord) => {
                const isLocal = isLocalFortaleza(ord);
                const sub = ord.fulfillment_substatus || 'PAGAMENTO_APROVADO';

                return (
                  <div key={ord.id} className="p-5 bg-zinc-950 border border-zinc-800 rounded-lg space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-900 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-white tracking-wider">
                          #{ord.short_id || ord.id.slice(0, 8)}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${
                          sub === 'DESPACHADO' 
                            ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20'
                            : 'border-amber-500/40 text-amber-400 bg-amber-950/20'
                        }`}>
                          {sub.replace('_', ' ')}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded border uppercase ${
                          isLocal
                            ? 'border-blue-500/30 text-blue-400 bg-blue-950/20'
                            : 'border-zinc-700 text-zinc-400 bg-zinc-900'
                        }`}>
                          {isLocal ? '⚡ MOTOBOY LOCAL' : '📦 CORREIOS / BRASIL'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* BOTÃO DA MINI IMPRESSORA TÉRMICA */}
                        <button
                          onClick={() => handlePrintThermal(ord)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold rounded transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5 text-zinc-400" />
                          Imprimir Térmica
                        </button>

                        <span className="text-sm font-bold text-emerald-400 ml-2">
                          R$ {ord.total_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Dados do Patrono e Itens */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase block">Patrono & Contato</span>
                        <span className="text-white font-bold block uppercase">{ord.customer_name || 'Patrono'}</span>
                        <span className="text-zinc-400 block">{ord.customer_email}</span>
                        <span className="text-zinc-500 block">{ord.customer_phone || 'Sem telefone'}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase block">Endereço de Custódia</span>
                        <span className="text-zinc-300 block">
                          {ord.shipping_street ? `${ord.shipping_street}, ${ord.shipping_number}` : 'Endereço registrado no pedido'}
                        </span>
                        <span className="text-zinc-400 block">
                          {ord.shipping_neighborhood ? `${ord.shipping_neighborhood} • ` : ''}{ord.shipping_city || 'Fortaleza'} - {ord.shipping_state || 'CE'}
                        </span>
                        <span className="text-zinc-500 block font-mono">{ord.shipping_cep}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase block">Artefatos para Separação</span>
                        <div className="space-y-1 mt-1">
                          {ord.order_items && ord.order_items.length > 0 ? (
                            ord.order_items.map((it, idx) => (
                              <div key={idx} className="flex justify-between items-center text-zinc-300 bg-zinc-900/60 px-2 py-1 rounded">
                                <span className="font-bold">{it.quantity}x {it.product_name || it.name || 'Artefato'}</span>
                                <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 uppercase">
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

                    {/* Esteira de Ações Operacionais */}
                    <div className="pt-3 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        {sub === 'PAGAMENTO_APROVADO' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'EM_SEPARACAO')}
                            disabled={processingId === ord.id}
                            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-bold transition-colors"
                          >
                            1. Iniciar Separação →
                          </button>
                        )}
                        {sub === 'EM_SEPARACAO' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'EMBALANDO')}
                            disabled={processingId === ord.id}
                            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-bold transition-colors"
                          >
                            2. Caixas e Insumos Ok →
                          </button>
                        )}
                        {sub === 'EMBALANDO' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'PRONTO_COLETA')}
                            disabled={processingId === ord.id}
                            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-bold transition-colors"
                          >
                            3. Pronto para Despacho →
                          </button>
                        )}
                      </div>

                      {/* Disparo de Despacho e Notificação */}
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <input
                          type="text"
                          placeholder={isLocal ? "Nome Motoboy / Rota" : "Código Rastreio Correios"}
                          value={trackingInputs[ord.id] !== undefined ? trackingInputs[ord.id] : (ord.tracking_code || '')}
                          onChange={(e) => setTrackingInputs({ ...trackingInputs, [ord.id]: e.target.value })}
                          className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono w-48"
                        />
                        <button
                          onClick={() => handleDispatch(ord)}
                          disabled={processingId === ord.id}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-black font-bold uppercase tracking-wider rounded text-[11px] transition-colors"
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

      {/* CUPOM TÉRMICO DE IMPRESSÃO (VISÍVEL APENAS NA MINI IMPRESSORA / PRINT) */}
      {printOrder && (
        <div className="hidden print:block print:w-[72mm] text-black bg-white p-2 font-mono text-[11px] leading-tight mx-auto">
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
      )}
    </>
  );
}