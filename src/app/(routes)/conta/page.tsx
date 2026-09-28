'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { playHapticSound } from '@/lib/sound';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function ContaPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [serials, setSerials] = useState<any[]>([]);

  useEffect(() => {
    async function loadUserData() {
      setLoading(true);
      const email = localStorage.getItem('lr_user_email');
      
      if (!email) {
        router.push('/acesso');
        return;
      }
      setUserEmail(email);

      try {
        const { data: customer } = await supabase.from('customers').select('*').eq('email', email).single();
        if (customer) {
          setCustomerData(customer);
          const { data: dbOrders } = await supabase.from('orders').select('*').eq('customer_id', customer.id);
          if (dbOrders) setOrders(dbOrders);
          const { data: dbSerials } = await supabase.from('serialized_items').select('*').eq('customer_id', customer.id);
          if (dbSerials) setSerials(dbSerials);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, [router]);

  const handleLogout = () => {
    playHapticSound();
    localStorage.removeItem('lr_user_email');
    localStorage.removeItem('lr_ceo_mode');
    router.push('/acesso');
  };

  if (loading) {
    return (
      <main className="min-h-[100dvh] bg-black text-white flex items-center justify-center font-sans text-xs uppercase tracking-widest text-zinc-500">
        Acessando Arquivos...
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-black text-white font-sans flex flex-col items-center">
      
      <header className="w-full px-6 pt-14 pb-6 flex justify-between items-center max-w-4xl mx-auto border-b border-zinc-900">
        <Link href="/" onClick={playHapticSound} className="font-serif text-xl tracking-widest text-white hover:text-zinc-300 transition-colors">
          LaRomme.
        </Link>
        <button onClick={handleLogout} className="text-[10px] font-sans uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
          Encerrar Sessão
        </button>
      </header>

      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 space-y-16">
        
        <div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-sans">
            Membro Registrado
          </span>
          <h1 className="text-3xl font-serif uppercase tracking-widest text-white mt-2">
            {customerData?.full_name || 'Senador VIP'}
          </h1>
          <p className="text-xs text-zinc-500 font-sans mt-1 tracking-widest">{userEmail}</p>
        </div>

        <div className="space-y-6">
          <h2 className="text-xs font-sans uppercase tracking-widest text-zinc-300 border-b border-zinc-900 pb-3">
            Artefatos em Posse ({serials.length})
          </h2>

          {serials.length === 0 ? (
            <div className="bg-[#050505] border border-zinc-900 p-8 text-center space-y-2">
              <span className="text-xs text-zinc-500 block uppercase tracking-widest">Nenhum artefato registrado</span>
              <p className="text-[10px] text-zinc-600 font-sans tracking-widest uppercase">
                As aquisições vinculam automaticamente os seriais a esta credencial.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serials.map((s) => (
                <div key={s.id} className="bg-[#050505] border border-zinc-800/80 p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Coleção Origo</span>
                    <span className="text-[9px] font-bold text-white bg-zinc-900 border border-zinc-700 px-2 py-1 tracking-widest uppercase">
                      {s.serial_code}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-serif text-white uppercase tracking-widest">Camiseta Boxy Heavyweight</p>
                    <span className="text-[10px] text-zinc-400 block mt-1 tracking-widest uppercase">Tamanho: {s.size || 'M'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xs font-sans uppercase tracking-widest text-zinc-300 border-b border-zinc-900 pb-3">
            Histórico de Aquisições
          </h2>

          {orders.length === 0 ? (
            <div className="bg-[#050505] border border-zinc-900 p-8 text-center text-[10px] uppercase tracking-widest text-zinc-500">
              Nenhuma transação localizada no arquivo.
            </div>
          ) : (
            <div className="space-y-2">
              {orders.map((o) => (
                <div key={o.id} className="bg-[#050505] border border-zinc-800/80 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <span className="font-serif text-white tracking-widest uppercase text-sm block">{o.order_number}</span>
                    <span className="text-zinc-500 text-[10px] uppercase tracking-widest">R$ {Number(o.total_amount).toFixed(2)} • Destino: {o.delivery_state}</span>
                  </div>
                  <div>
                    <span className={`text-[9px] uppercase tracking-widest px-3 py-1.5 border ${o.payment_status === 'PAGO' ? 'bg-zinc-900 text-white border-zinc-700' : 'bg-[#050505] text-zinc-500 border-zinc-800'}`}>
                      {o.payment_status === 'PAGO' ? 'Liquidação Confirmada' : 'Aguardando Pix'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}