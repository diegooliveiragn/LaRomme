'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FadeIn from '@/components/FadeIn';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const orderId = params.id;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pixData, setPixData] = useState<any>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  // Carrega dados do Pix salvos em cache local
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cachedPix = localStorage.getItem(`laromme_pix_${orderId}`);
      if (cachedPix) {
        try {
          setPixData(JSON.parse(cachedPix));
        } catch (e) {
          console.error('Erro ao ler cache do Pix:', e);
        }
      }
    }
  }, [orderId]);

  // Função para buscar status atualizado do pedido no Supabase
  const fetchOrderStatus = async () => {
    try {
      const res = await fetch(`/api/pedido/${orderId}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error('Erro ao consultar status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Carregamento inicial e Polling (Verificação a cada 4s se estiver pendente)
  useEffect(() => {
    fetchOrderStatus();

    const interval = setInterval(() => {
      fetchOrderStatus();
    }, 4000);

    return () => clearInterval(interval);
  }, [orderId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  if (loading && !order) {
    return (
      <div className="pt-36 pb-24 text-center min-h-[70vh] flex items-center justify-center font-mono text-xs text-zinc-500">
        CARREGANDO REGISTRO DE ENCOMENDA...
      </div>
    );
  }

  if (!order && !loading) {
    return (
      <div className="pt-36 pb-24 px-6 max-w-2xl mx-auto text-center space-y-6 font-sans">
        <h1 className="font-serif text-2xl text-white font-bold tracking-wider uppercase">ENCOMENDA NÃO ENCONTRADA.</h1>
        <p className="text-xs text-zinc-400 font-mono">Verifique o código acessado ou entre em contato com o suporte LaRomme.</p>
        <Link href="/" className="inline-block bg-white text-black font-bold text-xs tracking-widest px-8 py-4 uppercase">
          RETORNAR AO INÍCIO
        </Link>
      </div>
    );
  }

  const isApproved = order?.status === 'approved' || order?.status === 'paid';
  const isPending = order?.status === 'pending';

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto space-y-12 font-sans">
      <FadeIn>
        <div className="border-b border-zinc-900 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block mb-1">STATUS DE ENCOMENDA</span>
            <h1 className="font-serif text-2xl md:text-3xl tracking-[0.2em] text-white uppercase font-bold">
              PEDIDO #{order?.short_id || '---'}
            </h1>
          </div>
          <div className="font-mono text-xs uppercase px-4 py-2 border tracking-wider font-bold">
            {isApproved && <span className="border-emerald-500/30 bg-emerald-950/30 text-emerald-400">✓ APROVADO • EM SEPARAÇÃO</span>}
            {isPending && <span className="border-amber-500/30 bg-amber-950/30 text-amber-400">⏳ AGUARDANDO PAGAMENTO</span>}
            {!isApproved && !isPending && <span className="border-zinc-800 bg-zinc-900 text-zinc-400">{order?.status}</span>}
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ÁREA PRINCIPAL: PIX OU CONFIRMAÇÃO */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* PAINEL PIX SE PENDENTE */}
          {isPending && order?.payment_method === 'pix' && pixData && (
            <div className="bg-[#080808] border border-amber-900/50 p-6 md:p-8 space-y-6 text-center">
              <span className="text-[10px] font-mono tracking-[0.3em] text-amber-400 uppercase block">PAGAMENTO VIA PIX</span>
              <p className="text-xs text-zinc-300 font-mono">
                Escaneie o QR Code abaixo no app do seu banco para concluir o pedido.
              </p>

              {pixData.qrCodeBase64 && (
                <div className="flex justify-center py-2">
                  <img
                    src={`data:image/jpeg;base64,${pixData.qrCodeBase64}`}
                    alt="QR Code Pix"
                    className="w-52 h-52 border-4 border-white rounded-lg shadow-2xl"
                  />
                </div>
              )}

              {pixData.qrCode && (
                <div className="space-y-3 font-mono text-xs">
                  <button
                    onClick={() => copyToClipboard(pixData.qrCode)}
                    className="w-full bg-white text-black font-bold py-4 tracking-widest uppercase hover:bg-zinc-200 transition-all"
                  >
                    {copiedPix ? '✓ CÓDIGO PIX COPIADO!' : 'COPIAR CÓDIGO PIX'}
                  </button>
                </div>
              )}

              <p className="text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-900">
                Esta tela atualiza automaticamente assim que a transferência for confirmada.
              </p>
            </div>
          )}

          {/* PAINEL SE APROVADO */}
          {isApproved && (
            <div className="bg-[#080808] border border-emerald-900/50 p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <span className="text-xl">✓</span>
                <h2 className="font-serif text-lg font-bold tracking-wider uppercase">PAGAMENTO APROVADO.</h2>
              </div>
              <p className="text-xs text-zinc-300 font-mono leading-relaxed">
                A sua encomenda foi registrada com sucesso. Nossos artesãos já iniciaram a separação e embalagem dos seus itens.
              </p>
              <p className="text-[10px] text-zinc-500 font-mono">
                Você receberá o código de rastreamento do envio diretamente no seu e-mail ({order?.customer_email}).
              </p>
            </div>
          )}

          {/* ENDEREÇO DE ENTREGA */}
          <div className="bg-[#080808] border border-zinc-900 p-6 space-y-3 font-mono text-xs">
            <h3 className="font-serif text-sm text-white font-bold uppercase border-b border-zinc-800 pb-2">
              DESTINO DE ENTREGA.
            </h3>
            <div className="text-zinc-400 space-y-1">
              <p className="text-white font-bold">{order?.customer_name}</p>
              <p>{order?.shipping_street}, Nº {order?.shipping_number}</p>
              <p>{order?.shipping_neighborhood} • {order?.shipping_city} / {order?.shipping_state}</p>
              <p>CEP: {order?.shipping_cep}</p>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: RESUMO DO PEDIDO */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#080808] border border-zinc-900 p-6 space-y-6">
            <h2 className="font-serif text-base text-white font-bold tracking-wider uppercase border-b border-zinc-800 pb-3">
              ITENS DA ENCOMENDA.
            </h2>
            <div className="space-y-4">
              {order?.order_items?.map((item: any) => (
                <div key={item.id} className="flex gap-4 items-center border-b border-zinc-900 pb-3">
                  <div className="relative w-12 h-14 bg-zinc-950 border border-zinc-900 flex-shrink-0">
                    {item.product_image && <Image src={item.product_image} alt={item.product_name} fill className="object-cover" />}
                  </div>
                  <div className="flex-1 font-mono text-xs space-y-1">
                    <h4 className="text-white font-bold font-serif">{item.product_name}</h4>
                    <p className="text-zinc-500 text-[10px]">TAM: {item.product_size} • COR: {item.product_color}</p>
                    <p className="text-zinc-300 font-bold">R$ {Number(item.unit_price).toFixed(2)} x {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 pt-4 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>SUBTOTAL:</span>
                <span className="text-white font-bold">R$ {Number(order?.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>FRETE:</span>
                <span className="text-zinc-400">GRÁTIS</span>
              </div>
              <div className="flex justify-between text-sm text-white font-bold pt-2 border-t border-zinc-900">
                <span>TOTAL:</span>
                <span>R$ {Number(order?.subtotal || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="text-center font-mono text-[10px] text-zinc-500">
            Dúvidas sobre o pedido? Entre em contato via suporte@laromme.com.br
          </div>
        </div>
      </div>
    </div>
  );
}