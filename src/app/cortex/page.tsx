'use client';

import React, { useState, useEffect } from 'react';
import FadeIn from '@/components/FadeIn';

export default function CortexAdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateOrder = async (orderId: string, newStatus: string, trackingCode?: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus, trackingCode }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      } else {
        alert(data.error || 'Erro ao atualizar pedido.');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Falha de comunicação.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filter === 'all' || o.status === filter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      o.short_id?.toString().includes(searchLower) ||
      o.customer_name?.toLowerCase().includes(searchLower) ||
      o.customer_email?.toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'paid':
        return <span className="px-2 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase">Aprovado</span>;
      case 'shipped':
        return <span className="px-2 py-1 bg-blue-950 text-blue-400 border border-blue-800 text-[10px] font-bold uppercase">Enviado</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold uppercase">Pendente</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-bold uppercase">Cancelado</span>;
      default:
        return <span className="px-2 py-1 bg-zinc-900 text-zinc-400 border border-zinc-800 text-[10px] font-bold uppercase">{status}</span>;
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto space-y-8 font-sans">
      <FadeIn>
        <div className="border-b border-zinc-900 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block mb-1">CORTEX OS • PAINEL OPERACIONAL</span>
            <h1 className="font-serif text-2xl md:text-4xl tracking-[0.2em] text-white uppercase font-bold">GESTÃO DE PEDIDOS.</h1>
          </div>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-white hover:border-white transition-all uppercase"
          >
            🔄 ATUALIZAR DADOS
          </button>
        </div>
      </FadeIn>

      {/* FILTROS E PESQUISA */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center font-mono text-xs">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {['all', 'approved', 'pending', 'shipped', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-2 border uppercase font-bold transition-all ${
                filter === st ? 'bg-white text-black border-white' : 'border-zinc-900 text-zinc-500 hover:border-zinc-700'
              }`}
            >
              {st === 'all' ? 'TODOS' : st === 'approved' ? 'APROVADOS' : st === 'pending' ? 'PENDENTES' : st === 'shipped' ? 'ENVIADOS' : 'CANCELADOS'}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="BUSCAR POR NOME, E-MAIL OU ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-[#080808] border border-zinc-900 px-4 py-2 text-white focus:outline-none focus:border-white font-mono text-xs md:w-80"
        />
      </div>

      {/* LISTA DE PEDIDOS */}
      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-zinc-500">CARREGANDO REGISTROS FINANCEIROS...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-20 text-center bg-[#080808] border border-zinc-900 font-mono text-xs text-zinc-500">NENHUM PEDIDO ENCONTRADO.</div>
      ) : (
        <div className="space-y-4 font-mono text-xs">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-[#080808] border border-zinc-900 p-6 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-900 pb-4 gap-2">
                <div>
                  <span className="text-white font-bold font-serif text-base mr-3">PEDIDO #{order.short_id}</span>
                  {getStatusBadge(order.status)}
                </div>
                <div className="text-zinc-500 text-[10px]">
                  {new Date(order.created_at).toLocaleDateString('pt-BR')} ÀS {new Date(order.created_at).toLocaleTimeString('pt-BR')}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-zinc-400">
                {/* CLIENTE & ENDEREÇO */}
                <div className="space-y-1">
                  <p className="text-white font-bold">{order.customer_name}</p>
                  <p>{order.customer_email}</p>
                  <p>CPF: {order.customer_cpf}</p>
                  <p>TEL: {order.customer_phone}</p>
                  <p className="pt-2 text-[11px] text-zinc-500">
                    📍 {order.shipping_street}, Nº {order.shipping_number} — {order.shipping_city}/{order.shipping_state} (CEP: {order.shipping_cep})
                  </p>
                </div>

                {/* ITENS COMPRADOS */}
                <div className="space-y-2 border-y md:border-y-0 md:border-x border-zinc-900 py-3 md:py-0 md:px-6">
                  <p className="text-zinc-500 font-bold uppercase text-[10px]">ITENS DO PEDIDO:</p>
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-zinc-300">
                      <span>{item.quantity}x {item.product_name} ({item.product_size}/{item.product_color})</span>
                      <span className="font-bold">R$ {Number(item.unit_price).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-zinc-900 pt-2 flex justify-between text-white font-bold">
                    <span>TOTAL:</span>
                    <span>R$ {Number(order.subtotal).toFixed(2)}</span>
                  </div>
                </div>

                {/* AÇÕES DE STATUS E RASTREIO */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-zinc-500 text-[10px] uppercase mb-1">ALTERAR STATUS:</label>
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleUpdateOrder(order.id, e.target.value, order.tracking_code)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white p-2 text-xs focus:outline-none focus:border-white"
                    >
                      <option value="pending">PENDENTE</option>
                      <option value="approved">APROVADO (EM SEPARAÇÃO)</option>
                      <option value="shipped">ENVIADO (DESPACHADO)</option>
                      <option value="delivered">ENTREGUE</option>
                      <option value="cancelled">CANCELADO</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-500 text-[10px] uppercase mb-1">CÓDIGO DE RASTREIO:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        defaultValue={order.tracking_code || ''}
                        placeholder="EX: NL123456789BR"
                        id={`tracking-${order.id}`}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-1.5 text-xs focus:outline-none focus:border-white"
                      />
                      <button
                        onClick={() => {
                          const val = (document.getElementById(`tracking-${order.id}`) as HTMLInputElement)?.value;
                          handleUpdateOrder(order.id, order.status, val);
                        }}
                        disabled={updatingId === order.id}
                        className="bg-white text-black px-3 py-1.5 font-bold uppercase hover:bg-zinc-200 transition-all text-[10px]"
                      >
                        SALVAR
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}