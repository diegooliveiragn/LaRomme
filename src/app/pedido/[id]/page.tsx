'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FadeIn from '@/components/FadeIn';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const orderId = params.id;
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pixData, setPixData] = useState<any>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  // Estados de Avaliação (NPS)
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storageKey = 'laromme_feedback_' + orderId;
      if (localStorage.getItem(storageKey)) {
        setFeedbackSubmitted(true);
      }
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await fetch('/api/pedido/' + orderId, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        if (data.pix) {
          setPixData(data.pix);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar pedido:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  const handleCopyPix = () => {
    if (pixData?.qrCode) {
      navigator.clipboard.writeText(pixData.qrCode);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3000);
    }
  };

  const handleSendFeedback = async () => {
    if (rating === 0) {
      alert('Por favor, selecione uma nota de 1 a 5 estrelas.');
      return;
    }
    setSubmittingRating(true);
    try {
      if (typeof window !== 'undefined') {
        const storageKey = 'laromme_feedback_' + orderId;
        localStorage.setItem(storageKey, JSON.stringify({ rating, comment, date: new Date().toISOString() }));
      }
      setFeedbackSubmitted(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (e) {
      console.error('Erro ao registrar avaliação:', e);
    } finally {
      setSubmittingRating(false);
    }
  };

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">
        <p className="tracking-widest uppercase animate-pulse">Consultando protocolo de custódia...</p>
      </main>
    );
  }

  const isDelivered = order?.status === 'delivered';
  const isShipped = order?.status === 'shipped';
  const isApproved = ['approved', 'paid'].includes(order?.status);
  const isPaid = Boolean(order && (isDelivered || isShipped || isApproved));

  const qrCodeBase64 = pixData?.qrCodeBase64;
  const qrCodeText = pixData?.qrCode;

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 font-mono text-xs space-y-12">
        <FadeIn>
          {/* TOPO DO PEDIDO */}
          <div className="border-b border-zinc-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] tracking-[0.25em] text-zinc-500 uppercase block mb-1">
                PROTOCOLO DE REGISTRO • LAROMME
              </span>
              <h1 className="font-serif text-3xl md:text-4xl uppercase tracking-wider text-white font-bold">
                PEDIDO #{order?.short_id || order?.id?.slice(0, 8)}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest border ${
                  isDelivered
                    ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                    : isShipped
                    ? 'border-blue-500/40 bg-blue-950/30 text-blue-300'
                    : isPaid
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400'
                    : 'border-amber-500/40 bg-amber-950/20 text-amber-400'
                }`}
              >
                {isDelivered
                  ? '● Ordem Entregue'
                  : isShipped
                  ? '● Encomenda Despachada'
                  : isPaid
                  ? '● Liquidação Confirmada'
                  : '○ Aguardando Pagamento Pix'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mt-8">
            {/* COLUNA ESQUERDA: STATUS / FEEDBACK / PAGAMENTO */}
            <div className="lg:col-span-7 space-y-6">
              {!isPaid ? (
                /* ESTADO 1: PAGAMENTO PIX PENDENTE */
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
                    <div className="flex justify-center p-4 bg-white rounded max-w-[260px] mx-auto shadow-sm">
                      <img
                        src={`data:image/png;base64,${qrCodeBase64}`}
                        alt="QR Code Pix"
                        className="w-full h-auto aspect-square"
                      />
                    </div>
                  ) : qrCodeText ? (
                    <div className="flex justify-center p-4 bg-white rounded max-w-[260px] mx-auto shadow-sm">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCodeText)}`}
                        alt="QR Code Pix"
                        className="w-full h-auto aspect-square"
                      />
                    </div>
                  ) : (
                    <div className="p-8 text-center border border-zinc-800 text-zinc-500 text-xs font-mono">
                      Gerando chave Pix instantânea...
                    </div>
                  )}

                  {qrCodeText && (
                    <div className="space-y-2">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                        Chave Pix Copia e Cola
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={qrCodeText}
                          className="bg-black border border-zinc-800 px-3 py-2 text-zinc-400 text-[11px] flex-1 font-mono select-all focus:outline-none"
                        />
                        <button
                          onClick={handleCopyPix}
                          className="px-4 py-2 bg-white text-black font-bold uppercase text-[11px] tracking-wider hover:bg-zinc-200 transition-colors"
                        >
                          {copiedPix ? 'Copiado!' : 'Copiar'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : isDelivered ? (
                /* ESTADO 2: PEDIDO ENTREGUE & LOOPING DE AVALIAÇÃO */
                <div className="bg-zinc-950 border border-zinc-800 p-6 md:p-8 space-y-6 text-center">
                  <div className="w-12 h-12 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-400 text-xl font-bold">
                    ✓
                  </div>
                  <div>
                    <h2 className="text-base font-serif uppercase tracking-widest text-emerald-400 font-bold">
                      Artefato Entregue
                    </h2>
                    <p className="text-zinc-400 text-xs leading-relaxed max-w-md mx-auto mt-2">
                      Sua encomenda foi entregue com sucesso. Agradecemos pela confiança na manufatura LaRomme.
                    </p>
                  </div>

                  {/* FORMULÁRIO DE FEEDBACK / ENCERRAMENTO */}
                  <div className="border-t border-zinc-900 pt-6 space-y-4 text-left">
                    {feedbackSubmitted ? (
                      <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded text-center space-y-1">
                        <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block">
                          ✓ Avaliação Concluída
                        </span>
                        <p className="text-[11px] text-zinc-400">
                          Agradecemos pelo seu retorno. Redirecionando para o acervo...
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2 text-center">
                          <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                            Como foi sua experiência com o artefato e entrega?
                          </label>
                          <div className="flex justify-center gap-2 pt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`w-9 h-9 rounded border text-sm font-mono font-bold transition-all ${
                                  rating >= star
                                    ? 'bg-white text-black border-white'
                                    : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-600'
                                }`}
                              >
                                {star}★
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1 pt-2">
                          <textarea
                            placeholder="Comentário sobre caimento, tecido ou acabamento (opcional)..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                            className="w-full bg-black border border-zinc-800 rounded p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-sans"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleSendFeedback}
                          disabled={submittingRating}
                          className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest border border-zinc-700 transition-colors disabled:opacity-50"
                        >
                          {submittingRating ? 'Enviando...' : 'Concluir Avaliação'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : isShipped ? (
                /* ESTADO 3: ENCOMENDA EM TRÂNSITO */
                <div className="bg-zinc-950 border border-blue-900/40 p-6 md:p-8 space-y-6 text-center">
                  <div className="w-12 h-12 rounded-full border border-blue-500/30 bg-blue-500/10 flex items-center justify-center mx-auto text-blue-400 text-xl font-bold">
                    ➔
                  </div>
                  <div>
                    <h2 className="text-base font-serif uppercase tracking-widest text-blue-400 font-bold">
                      Artefato em Trânsito
                    </h2>
                    <p className="text-zinc-400 text-xs leading-relaxed max-w-md mx-auto mt-2">
                      Sua encomenda já foi despachada pelo galpão operacional e encontra-se a caminho do endereço registrado.
                    </p>
                  </div>

                  {order?.tracking_code && (
                    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded text-center space-y-2">
                      <span className="text-[10px] uppercase tracking-widest text-zinc-500 block">
                        Código de Rastreamento Postal
                      </span>
                      <span className="text-sm font-bold font-mono text-white tracking-widest block">
                        {order.tracking_code}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* ESTADO 4: APROVADO / EM PRODUÇÃO */
                <div className="bg-zinc-950 border border-zinc-800 p-6 md:p-8 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-400 text-xl font-bold">
                    ✓
                  </div>
                  <h2 className="text-base font-serif uppercase tracking-widest text-emerald-400 font-bold">
                    Artefato Homologado
                  </h2>
                  <p className="text-zinc-400 text-xs leading-relaxed max-w-md mx-auto">
                    Seu pagamento foi confirmado instantaneamente. A ordem de produção e separação física no galpão foi iniciada.
                  </p>
                </div>
              )}

              {/* DADOS DE DESTINO */}
              <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-4">
                <h3 className="text-xs font-serif uppercase tracking-widest text-zinc-300 font-bold border-b border-zinc-900 pb-2">
                  Destino de Entrega
                </h3>
                <div className="space-y-1 text-zinc-400 text-xs">
                  <p className="font-bold text-white capitalize">{order?.customer_name || 'Patrono LaRomme'}</p>
                  <p>{order?.shipping_street ? `${order.shipping_street}, Nº ${order.shipping_number || 'S/N'}` : 'Endereço registrado'}</p>
                  <p>{order?.shipping_neighborhood || ''} • {order?.shipping_city || ''} / {order?.shipping_state || ''}</p>
                  <p>CEP: {order?.shipping_cep || ''}</p>
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA: RESUMO DA ENCOMENDA */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-4">
                <h2 className="text-xs font-serif uppercase tracking-widest text-zinc-300 font-bold border-b border-zinc-900 pb-2">
                  Resumo da Encomenda
                </h2>

                <div className="space-y-3 py-2">
                  <div className="flex justify-between items-start text-xs border-b border-zinc-900 pb-3">
                    <div>
                      <p className="font-bold text-zinc-200">Artefato LaRomme</p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Qtd: 1</p>
                    </div>
                    <span className="font-mono text-zinc-300">
                      {formatBRL(Number(order?.subtotal || order?.total_amount || 1))}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs border-t border-zinc-900 pt-3">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="font-mono text-zinc-300">{formatBRL(Number(order?.subtotal || order?.total_amount || 1))}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Frete Expresso</span>
                    <span className="font-mono text-emerald-400 font-bold">GRÁTIS</span>
                  </div>
                  <div className="flex justify-between text-white font-bold pt-2 border-t border-zinc-800 text-sm">
                    <span>Total</span>
                    <span className="font-mono">{formatBRL(Number(order?.total_amount || 1))}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/"
                    className="block w-full text-center py-3 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white uppercase text-[11px] font-bold tracking-widest transition-colors"
                  >
                    Voltar ao Acervo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}