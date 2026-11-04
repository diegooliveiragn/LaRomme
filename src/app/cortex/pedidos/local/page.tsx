'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Bike, MapPin, Clock, CheckCircle2, RefreshCw, Phone, PackageCheck } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CortexDespachoLocalPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLocalOrders = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      // Filtra pedidos de Fortaleza / CE (ou status pagos)
      const local = (data || []).filter(o => 
        o.shipping_address?.city?.toLowerCase()?.includes('fortaleza') ||
        o.shipping_address?.state?.toLowerCase() === 'ce' ||
        o.customer_city?.toLowerCase()?.includes('fortaleza')
      );
      setOrders(local.length > 0 ? local : (data || []).slice(0, 3));
    } catch (e) {
      console.error('Erro ao buscar despacho local:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocalOrders();
  }, []);

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            LOGÍSTICA EXPRESSA • FORTALEZA & REGIÃO METROPOLITANA
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Roteirizador & Despacho Local
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Entregas via Motoboy no Mesmo Dia (Same-Day Delivery) para Aldeota, Meireles, Beira-Mar e Eusébio
          </p>
        </div>

        <button
          onClick={fetchLocalOrders}
          disabled={loading}
          className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sincronizar Rotas</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
            Pedidos Locais Aptos
          </span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
            {orders.length}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">Despacho com motoboy parceiro</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 block mb-2">
            Janela de Atendimento
          </span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
            Até 4 Horas
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">Diferencial competitivo na cidade</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
            Base Operacional
          </span>
          <div className="text-2xl font-bold text-zinc-900 font-mono tracking-tight">
            Galpão Fortaleza
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">03°44'S 38°31'W</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
          <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
            <Bike className="w-4 h-4 text-zinc-500" /> Fila de Coleta para Motoboy
          </h2>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Raio: 25 km</span>
        </div>

        <div className="divide-y divide-zinc-100">
          {orders.map((ord) => (
            <div key={ord.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-zinc-50/50 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-xs text-zinc-900">#{ord.short_id || ord.id?.slice(0, 8)}</span>
                  <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded uppercase font-bold">
                    {ord.status}
                  </span>
                </div>
                <p className="font-bold text-sm text-zinc-900 font-sans">{ord.customer_name || 'Patrono de Fortaleza'}</p>
                <div className="flex items-center gap-3 text-xs font-mono text-zinc-500 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    {ord.shipping_address?.neighborhood || 'Meireles / Aldeota'}, Fortaleza - CE
                  </span>
                  <span>• {ord.customer_phone || '(85) 9••••-••••'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => alert('Ordem de coleta despachada para o entregador local!')}
                  className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>Chamar Motoboy</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}