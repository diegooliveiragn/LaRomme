'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ShoppingCart, MessageCircle, AlertCircle, RefreshCw, Send, Clock, ShieldAlert } from 'lucide-react';

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
}

interface AbandonedOrder {
  id: string;
  short_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  total_amount: number;
  created_at: string;
  status: string;
  items?: OrderItem[];
}

export default function AbandonosPage() {
  const [abandonedOrders, setAbandonedOrders] = useState<AbandonedOrder[]>([]);
  const [totalOrdersCount, setTotalOrdersCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const fetchAbandonedData = async () => {
    setLoading(true);
    try {
      const { data: allOrders, error: ordersErr } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersErr) throw ordersErr;

      const total = (allOrders || []).length;
      setTotalOrdersCount(total);

      const pending = (allOrders || []).filter((o: any) => o.status === 'pending');

      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*');

      const itemsMap: Record<string, OrderItem[]> = {};
      (itemsData || []).forEach((item: any) => {
        if (!itemsMap[item.order_id]) itemsMap[item.order_id] = [];
        itemsMap[item.order_id].push(item);
      });

      const fullPending: AbandonedOrder[] = pending.map((ord: any) => ({
        ...ord,
        items: itemsMap[ord.id] || [],
      }));

      setAbandonedOrders(fullPending);
    } catch (err: any) {
      console.error('Erro ao buscar abandonos:', err.message);
      setActionStatus(`Erro ao carregar dados: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbandonedData();
  }, []);

  const getTimeElapsed = (dateStr: string) => {
    const now = new Date();
    const past = new Date(dateStr);
    const diffMs = now.getTime() - past.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 60) return `Há ${diffMin} min`;
    if (diffHours < 24) return `Há ${diffHours} h`;
    return `Há ${diffDays} d`;
  };

  const handleRecoverSingle = async (ord: AbandonedOrder) => {
    setProcessingId(ord.id);
    setActionStatus(`Enviando recuperação para ${ord.customer_email}...`);

    try {
      const res = await fetch('/api/crm/recuperacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: ord.id }),
      });

      const data = await res.json();
      if (data.success) {
        setActionStatus(`✓ Recuperação de reserva enviada para ${ord.customer_email}.`);
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

  const handleRecoverBatch = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setActionStatus('Processando recuperação em lote de reservas pendentes...');

    try {
      const res = await fetch('/api/crm/recuperacao', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionStatus(`✓ Concluído: ${data.processed ?? data.sent ?? 0} comunicações processadas.`);
      } else {
        setActionStatus(`Erro: ${data.error}`);
      }
    } catch (err: any) {
      setActionStatus(`Erro de rede: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setActionStatus(null), 5000);
    }
  };

  const handleOpenWhatsApp = (ord: AbandonedOrder) => {
    if (!ord.customer_phone) {
      alert('Nenhum telefone registrado para esta reserva.');
      return;
    }

    const cleanPhone = ord.customer_phone.replace(/\D/g, '');
    const primeName = (ord.customer_name || 'Patrono').split(' ')[0];
    const shortId = ord.short_id || ord.id.slice(0, 8);
    const text = `Olá, ${primeName}. Aqui é do Concierge LaRomme. Notamos que sua reserva #${shortId} referente ao nosso acervo está temporariamente retida. Deseja suporte prioritário para a conclusão do seu pedido?`;

    const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const receitaNaMesa = abandonedOrders.reduce((sum, ord) => sum + Number(ord.total_amount || 0), 0);
  const totalAbandonos = abandonedOrders.length;
  const taxaAtrito = totalOrdersCount > 0 ? Math.round((totalAbandonos / totalOrdersCount) * 100) : 0;
  const ticketMedioEmRisco = totalAbandonos > 0 ? receitaNaMesa / totalAbandonos : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 font-semibold block mb-1">
            Qualidade Operacional & Retenção
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white uppercase">
            Gargalos & Reservas Retidas
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1 font-bold">
            Monitoramento de Atrito no Checkout e Recuperação Ativa de Receita
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRecoverBatch}
            disabled={isProcessing || abandonedOrders.length === 0}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
          >
            Recuperar Lote (45m+)
          </button>
          <button
            onClick={fetchAbandonedData}
            disabled={loading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar Fila</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK STATUS BAR */}
      {actionStatus && (
        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white flex items-center justify-between">
          <span>{actionStatus}</span>
          <button onClick={() => setActionStatus(null)} className="text-slate-400 hover:text-white ml-4">✕</button>
        </div>
      )}

      {/* KPIS DE IMPACTO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-xl border bg-rose-500/10 border-rose-500/30 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-300">
              Receita na Mesa
            </span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-3xl font-black text-rose-400 tabular-nums tracking-tight block font-mono">
            {formatBRL(receitaNaMesa)}
          </span>
          <span className="text-[11px] font-bold text-rose-300/80 mt-2 block tabular-nums">
            Risco de perda em {totalAbandonos} reservas
          </span>
        </div>

        <div className="p-5 rounded-xl border bg-amber-500/10 border-amber-500/30 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
              Reservas Retidas
            </span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-3xl font-black text-amber-400 tabular-nums tracking-tight block">
            {totalAbandonos}
          </span>
          <span className="text-[11px] font-bold text-amber-300/80 mt-2 block tabular-nums">
            Aguardando liquidação Pix
          </span>
        </div>

        <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Ticket Médio Retido
            </span>
            <ShoppingCart className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-black text-white tabular-nums tracking-tight block font-mono">
            {formatBRL(ticketMedioEmRisco)}
          </span>
          <span className="text-[11px] font-bold text-slate-500 mt-2 block">
            Valor médio por carrinho retido
          </span>
        </div>

        <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Taxa de Fuga Pix
            </span>
            <ShieldAlert className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-black text-white tabular-nums tracking-tight block">
            {taxaAtrito}%
          </span>
          <span className="text-[11px] font-bold text-slate-500 mt-2 block tabular-nums">
            Proporção sobre o total gerado
          </span>
        </div>

      </div>

      {/* FILA DE ABORDAGEM */}
      <div className="bg-slate-950/60 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
          <h2 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-slate-400" /> Fila de Abordagem do Concierge
          </h2>
          <span className="text-[11px] font-mono font-bold text-slate-400 tabular-nums">
            {totalAbandonos} reservas pendentes
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-mono font-bold text-slate-400">
            Mapeando atritos no checkout e reservas expiradas...
          </div>
        ) : abandonedOrders.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono font-bold text-slate-500">
            Nenhuma reserva retida no momento. Operação em dia.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {abandonedOrders.map((ord) => (
              <div key={ord.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-900/40 transition-colors">
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">{ord.customer_name || 'Patrono'}</span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      #{ord.short_id || ord.id.slice(0, 8)}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded">
                      {getTimeElapsed(ord.created_at)}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-slate-400">{ord.customer_email}</p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono text-slate-300">
                    <span className="font-bold text-slate-200">
                      {ord.items && ord.items.length > 0
                        ? ord.items.map((i) => `${i.quantity}x ${i.product_name || i.name || 'Peça'} (${i.size || 'U'})`).join(', ')
                        : 'Itens em consolidação'}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-amber-400 font-bold">Aguardando Pagamento Pix</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
                  <span className="text-xl font-black font-mono text-rose-400 tabular-nums">
                    {formatBRL(Number(ord.total_amount || 0))}
                  </span>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleRecoverSingle(ord)}
                      disabled={processingId === ord.id}
                      className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                    >
                      {processingId === ord.id ? 'Enviando...' : 'E-mail Reserva'}
                    </button>

                    <button
                      onClick={() => handleOpenWhatsApp(ord)}
                      className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}