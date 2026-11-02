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

  const fetchOrderStatus = async () => {
    try {
      const res = await fetch(`/api/pedido/${orderId}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
        if (data.order.pix && !pixData) {
          setPixData(data.order.pix);
        }
      }
    } catch (err) {
      console.error('Erro ao consultar status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderStatus();
    const interval = setInterval(fetchOrderStatus, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  const handleCopyPix = () => {
    const code = pixData?.qrCode;
    if (code) {
      navigator.clipboard.writeText(code);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3000);
    }
  };

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  if (loading && !order) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs uppercase tracking-widest">
        <p className="text-zinc-500 animate-pulse">Sincronizando encomenda...</p>
      </main>
    );
  }

  const isPaid = Boolean(order && ['approved', 'paid', 'shipped', 'delivered'].includes(order.status));
  const qrCodeBase64 = pixData?.qrCodeBase64;
  const qrCodeText = pixData?.qrCode;

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 font-mono text-xs space-y-12">
        <FadeIn>
          {/* TOPO DO PEDIDO */}
          <div className="border-b border-zinc-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] block mb-2 font-mono">
                Protocolo de Registro • LaRomme
              </span>
              <h1 className="font-serif text-3xl md:text-4xl uppercase tracking-wider font-bold">
                Pedido #{order?.short_id || orderId.slice(0, 8)}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest border ${
                  isPaid
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400'
                    : 'border-amber-500/40 bg-amber-950/20 text-amber-400'
                }`}
              >
                {isPaid ? '● Liquidação Confirmada' : '○ Aguardando Pagamento Pix'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* COLUNA ESQUERDA: QR CODE PIX / CONFIRMAÇÃO */}
            <div className="lg:col-span-7 space-y-6">
              {!isPaid ? (
                <div className="bg-zinc-950 border border-zinc-800 p-6 md:p-8 space-y-6">
                  <div>
                    <h2 className="text-sm font-serif tracking-widest uppercase text-white font-bold">
                      Pagamento Via Pix
                    </h2>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Escaneie o QR Code abaixo com o aplicativo do seu banco ou utilize o código Copia e Cola.
                    </p>
                  </div>

                  {qrCodeBase64 ? (
                    <div className="flex justify-center p-4 bg-white rounded-none border border-zinc-700 w-fit mx-auto">
                      <img
                        src={`data:image/png;base64,${qrCodeBase64}`}
                        alt="QR Code Pix"
                        className="w-56 h-56 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="p-8 border border-dashed border-zinc-800 text-center text-zinc-500 text-[11px] uppercase tracking-wider">
                      QR Code gerado na liquidação. Utilize o botão abaixo se o código em imagem não carregar.
                    </div>
                  )}

                  {qrCodeText && (
                    <div className="space-y-3">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-mono">
                        Chave Pix Copia e Cola
                      </label>
                      <div className="relative">
                        <textarea
                          readOnly
                          value={qrCodeText}
                          rows={3}
                          className="w-full bg-black border border-zinc-800 p-3 text-[10px] text-zinc-400 font-mono resize-none focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={handleCopyPix}
                        className="w-full py-3.5 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] font-bold hover:bg-zinc-200 transition-colors cursor-pointer"
                      >
                        {copiedPix ? '✓ Código Copiado!' : 'Copiar Código Pix'}
                      </button>
                    </div>
                  )}

                  <div className="pt-2 text-[10px] text-zinc-500 uppercase tracking-wider border-t border-zinc-900 flex justify-between">
                    <span>Validade da Cobrança:</span>
                    <span>30 minutos</span>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-950 border border-emerald-900/50 p-8 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-mono">
                    ✓
                  </div>
                  <h2 className="text-base font-serif uppercase tracking-widest text-emerald-400 font-bold">
                    Artefato Homologado
                  </h2>
                  <p className="text-zinc-400 text-xs leading-relaxed max-w-md mx-auto">
                    Seu pagamento foi confirmado instantaneamente. A ordem de produção e despacho no WMS foi aberta e os detalhes foram enviados para o seu e-mail.
                  </p>
                </div>
              )}

              {/* DADOS DE ENTREGA */}
              <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-4">
                <h3 className="text-xs font-serif uppercase tracking-widest text-zinc-300 font-bold border-b border-zinc-900 pb-2">
                  Destino de Entrega
                </h3>
                <div className="text-zinc-400 space-y-1 text-xs">
                  <p className="text-white font-bold">{order?.customer_name || 'Patrono'}</p>
                  <p>
                    {order?.shipping_street}, Nº {order?.shipping_number}
                  </p>
                  <p>
                    {order?.shipping_neighborhood} • {order?.shipping_city} / {order?.shipping_state}
                  </p>
                  <p className="font-mono text-zinc-500 pt-1">CEP: {order?.shipping_cep}</p>
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA: RESUMO DA ENCOMENDA */}
            <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 p-6 space-y-6">
              <h2 className="text-sm font-serif tracking-widest uppercase text-zinc-300 font-bold border-b border-zinc-800 pb-3">
                Resumo da Encomenda
              </h2>

              <div className="space-y-4">
                {(order?.order_items && order.order_items.length > 0) ? (
                  order.order_items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-start text-xs border-b border-zinc-900 pb-3">
                      <div>
                        <p className="font-bold text-zinc-200">{item.product_name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                          Tam: {item.product_size} | Qtd: {item.quantity}
                        </p>
                      </div>
                      <span className="font-mono text-zinc-300">
                        {formatBRL(Number(item.unit_price) * item.quantity)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between items-start text-xs border-b border-zinc-900 pb-3">
                    <div>
                      <p className="font-bold text-zinc-200">Artefato LaRomme</p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Qtd: 1</p>
                    </div>
                    <span className="font-mono text-zinc-300">
                      {formatBRL(Number(order?.subtotal || order?.total_amount || 1))}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-zinc-800 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>{formatBRL(Number(order?.subtotal || order?.total_amount || 1))}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Frete Expresso</span>
                  <span className="text-emerald-400">GRÁTIS</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                  <span>Total</span>
                  <span>{formatBRL(Number(order?.total_amount || 1))}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900">
                <Link
                  href="/"
                  className="block text-center w-full py-3 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white transition-colors uppercase tracking-widest text-[10px]"
                >
                  Voltar ao Acervo
                </Link>
              </div>
            </div>

          </div>
        </FadeIn>
      </div>
    </main>
  );
}