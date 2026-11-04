'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import FadeIn from '@/components/FadeIn';
import { ShieldCheck, CreditCard, QrCode, ArrowRight, Loader2 } from 'lucide-react';
import Script from 'next/script';

declare global {
  interface Window {
    MercadoPago?: any;
  }
}

export default function CheckoutPage() {
  const { items, clearCart, setActiveOrderData } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'wallet'>('pix');
  const [brickLoading, setBrickLoading] = useState(false);
  const brickControllerRef = useRef<any>(null);

  const [payer, setPayer] = useState({ fullName: '', email: '', cpf: '', phone: '' });
  const [address, setAddress] = useState({ cep: '', street: '', number: '', neighborhood: '', city: '', state: '' });

  const maskCPF = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const maskPhone = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 10) {
      return digits.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
    }
    return digits.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
  };

  const maskCEP = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 8);
    return digits.replace(/^(\d{5})(\d)/, '$1-$2');
  };

  const handleCepChange = async (cepVal: string) => {
    const masked = maskCEP(cepVal);
    setAddress(prev => ({ ...prev, cep: masked }));
    const clean = masked.replace(/\D/g, '');
    if (clean.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        if (res.ok) {
          const data = await res.json();
          if (!data.erro) {
            setAddress(prev => ({
              ...prev,
              street: data.logradouro || prev.street,
              neighborhood: data.bairro || prev.neighborhood,
              city: data.localidade || prev.city,
              state: data.uf || prev.state,
            }));
          }
        }
      } catch (e) {
        console.warn('Erro ao consultar CEP:', e);
      }
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.priceNumeric * item.quantity, 0);

  // Inicializa o Brick de Pagamento do Mercado Pago quando selecionado
  useEffect(() => {
    if (paymentMethod !== 'wallet') return;

    let isMounted = true;
    setBrickLoading(true);

    const initBrick = async () => {
      // Aguarda até o script global do Mercado Pago estar pronto
      let attempts = 0;
      while (!window.MercadoPago && attempts < 25) {
        await new Promise(r => setTimeout(r, 200));
        attempts++;
      }

      if (!window.MercadoPago) {
        if (isMounted) {
          setBrickLoading(false);
          setErrorMsg('Não foi possível conectar ao Mercado Pago. Tente o Pix.');
        }
        return;
      }

      const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || 'APP_USR-242a4078-dc31-4339-b6b9-abfa97bbcaa6';
      const mp = new window.MercadoPago(publicKey, { locale: 'pt-BR' });
      const bricksBuilder = mp.bricks();

      const container = document.getElementById('walletPaymentBrick_container');
      if (!container || !isMounted) return;

      // Desmonta container antigo para evitar instâncias duplicadas
      if (brickControllerRef.current) {
        try {
          await brickControllerRef.current.unmount();
        } catch (e) {}
      }
      container.innerHTML = '';

      try {
        const controller = await bricksBuilder.create('payment', 'walletPaymentBrick_container', {
          initialization: {
            amount: subtotal > 0 ? subtotal : 1,
            payer: {
              email: payer.email || 'patrono@laromme.com.br',
            },
          },
          customization: {
            paymentMethods: {
              ticket: 'all',
              creditCard: 'all',
              debitCard: 'all',
              mercadoPago: 'all',
            },
            visual: {
              style: {
                theme: 'dark',
                customVariables: {
                  baseColor: '#ffffff',
                }
              }
            }
          },
          callbacks: {
            onReady: () => {
              if (isMounted) setBrickLoading(false);
            },
            onSubmit: async ({ formData }: any) => {
              setLoading(true);
              setErrorMsg('');
              try {
                const res = await fetch('/api/checkout', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    items,
                    payer,
                    address,
                    shippingCost: 0,
                    paymentMethod: 'wallet',
                    walletToken: formData.token,
                    walletPaymentMethodId: formData.payment_method_id,
                    installments: formData.installments || 1,
                  }),
                });

                const data = await res.json();
                if (data.success && data.orderUuid) {
                  setActiveOrderData({ id: data.orderUuid, shortId: data.orderShortId });
                  clearCart();
                  router.push(`/pedido/${data.orderUuid}`);
                } else {
                  setErrorMsg(data.error || 'Erro ao processar carteira digital.');
                }
              } catch (err) {
                setErrorMsg('Falha na comunicação com o servidor.');
              } finally {
                setLoading(false);
              }
            },
            onError: (error: any) => {
              console.error('Erro no Brick Mercado Pago:', error);
              if (isMounted) setBrickLoading(false);
            },
          },
        });

        brickControllerRef.current = controller;
      } catch (err) {
        console.error('Erro ao instanciar Brick:', err);
        if (isMounted) setBrickLoading(false);
      }
    };

    initBrick();

    return () => {
      isMounted = false;
    };
  }, [paymentMethod, subtotal]);

  // Submissão do fluxo Pix tradicional
  const handlePixSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!payer.fullName || !payer.email || !payer.cpf || !payer.phone) {
      setErrorMsg('Por favor, preencha todos os dados de identificação.');
      return;
    }

    if (!address.cep || !address.street || !address.number || !address.city || !address.state) {
      setErrorMsg('Por favor, preencha o endereço de entrega completo.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          payer,
          address,
          paymentMethod: 'pix',
          shippingCost: 0,
        }),
      });

      const data = await res.json();

      if (data.success && data.orderUuid) {
        try {
          localStorage.setItem(`pix_${data.orderUuid}`, JSON.stringify({
            qrCode: data.qrCode,
            qrCodeBase64: data.qrCodeBase64,
            ticketUrl: data.ticketUrl,
            totalAmount: data.totalAmount,
            shortId: data.orderShortId,
          }));
        } catch (e) {}

        setActiveOrderData({ id: data.orderUuid, shortId: data.orderShortId });
        clearCart();
        router.push(`/pedido/${data.orderUuid}`);
      } else {
        setErrorMsg(data.error || 'Falha ao processar reserva.');
      }
    } catch (err) {
      setErrorMsg('Erro de conexão com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-36 pb-24 px-6 max-w-xl mx-auto text-center font-mono text-xs text-zinc-500 uppercase tracking-widest space-y-4">
        <p>Sua sacola está vazia.</p>
        <button onClick={() => router.push('/#origo')} className="text-white border-b border-white pb-0.5">
          Voltar ao Acervo
        </button>
      </div>
    );
  }

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  return (
    <>
      <Script
        src="https://sdk.mercadopago.com/js/v2"
        strategy="beforeInteractive"
      />

      <div className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto font-mono text-xs text-white space-y-8">
        <FadeIn>
          <div className="border-b border-zinc-900 pb-4 mb-8">
            <span className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] block mb-1">PROTOCOLO DE AQUISIÇÃO</span>
            <h1 className="font-serif text-2xl uppercase tracking-[0.2em] font-bold text-white">CHECKOUT OFICIAL.</h1>
          </div>

          {errorMsg && (
            <div className="p-4 border border-rose-900/50 bg-rose-950/20 text-rose-400 text-xs uppercase tracking-wider mb-6">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* FORMULÁRIO DE DADOS */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. DADOS PESSOAIS */}
              <div className="bg-[#080808] border border-zinc-900 p-6 space-y-4">
                <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block border-b border-zinc-900 pb-2">
                  01 // Identificação do Patrono
                </span>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Nome Completo:</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Diego Oliveira"
                      value={payer.fullName}
                      onChange={(e) => setPayer({ ...payer, fullName: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white focus:outline-none focus:border-zinc-500 font-sans text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">E-mail de Confirmação:</label>
                      <input
                        type="email"
                        required
                        placeholder="patrono@laromme.com.br"
                        value={payer.email}
                        onChange={(e) => setPayer({ ...payer, email: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white focus:outline-none focus:border-zinc-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">CPF (Nota Fiscal):</label>
                      <input
                        type="text"
                        required
                        placeholder="000.000.000-00"
                        value={payer.cpf}
                        onChange={(e) => setPayer({ ...payer, cpf: maskCPF(e.target.value) })}
                        className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white focus:outline-none focus:border-zinc-500 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">WhatsApp / Contato:</label>
                    <input
                      type="tel"
                      required
                      placeholder="(85) 9••••-••••"
                      value={payer.phone}
                      onChange={(e) => setPayer({ ...payer, phone: maskPhone(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white focus:outline-none focus:border-zinc-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 2. ENDEREÇO DE ENTREGA */}
              <div className="bg-[#080808] border border-zinc-900 p-6 space-y-4">
                <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block border-b border-zinc-900 pb-2">
                  02 // Destino de Despacho
                </span>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">CEP:</label>
                      <input
                        type="text"
                        required
                        placeholder="60000-000"
                        value={address.cep}
                        onChange={(e) => handleCepChange(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white focus:outline-none focus:border-zinc-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Número:</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: 104"
                        value={address.number}
                        onChange={(e) => setAddress({ ...address, number: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white focus:outline-none focus:border-zinc-500 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Logradouro / Rua:</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Av. Beira Mar"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white focus:outline-none focus:border-zinc-500 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Bairro:</label>
                      <input
                        type="text"
                        required
                        placeholder="Meireles"
                        value={address.neighborhood}
                        onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white focus:outline-none focus:border-zinc-500 text-xs"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Cidade:</label>
                      <input
                        type="text"
                        required
                        placeholder="Fortaleza"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white focus:outline-none focus:border-zinc-500 text-xs"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">UF:</label>
                      <input
                        type="text"
                        required
                        placeholder="CE"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white focus:outline-none focus:border-zinc-500 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. SELEÇÃO DO MÉTODO DE PAGAMENTO */}
              <div className="bg-[#080808] border border-zinc-900 p-6 space-y-4">
                <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block border-b border-zinc-900 pb-2">
                  03 // Forma de Liquidação
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-4 border rounded text-left transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-white bg-zinc-900 text-white shadow-md'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <QrCode className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-xs">PIX IMEDIATO</span>
                    </div>
                    <p className="text-[10px] text-zinc-500">Aprovação instantânea e prioridade no galpão</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-4 border rounded text-left transition-all ${
                      paymentMethod === 'wallet'
                        ? 'border-white bg-zinc-900 text-white shadow-md'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-zinc-300" />
                      <span className="font-bold text-xs">CARTEIRAS & CARTÃO</span>
                    </div>
                    <p className="text-[10px] text-zinc-500">Apple Pay, Google Pay ou Cartão</p>
                  </button>
                </div>

                {paymentMethod === 'pix' ? (
                  <button
                    type="button"
                    onClick={handlePixSubmit}
                    disabled={loading}
                    className="w-full bg-white text-black font-bold text-xs tracking-[0.25em] uppercase py-4 hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg mt-4 font-sans"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>GERANDO QR CODE PIX...</span>
                      </>
                    ) : (
                      <>
                        <span>GERAR PIX & CONCLUIR RESERVA</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <div className="mt-4 pt-2">
                    {brickLoading && (
                      <div className="flex items-center justify-center gap-2 py-6 text-zinc-400 font-mono text-xs">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Carregando Carteiras Digitais (Apple Pay / Google Pay)...</span>
                      </div>
                    )}
                    <div id="walletPaymentBrick_container" className="min-h-[160px]" />
                  </div>
                )}
              </div>

            </div>

            {/* RESUMO DA SACOLA */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#080808] border border-zinc-900 p-6 space-y-4 sticky top-28">
                <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block border-b border-zinc-900 pb-2">
                  Resumo do Acervo ({items.length})
                </span>

                <div className="divide-y divide-zinc-900 max-h-72 overflow-y-auto space-y-2">
                  {items.map((it) => (
                    <div key={`${it.id}-${it.size}`} className="pt-2 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-white font-sans">{it.name}</p>
                        <span className="text-[10px] text-zinc-500">Tamanho: {it.size} • Qtd: {it.quantity}</span>
                      </div>
                      <span className="font-mono text-zinc-300 font-bold">
                        {formatBRL(it.priceNumeric * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-900 pt-3 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal:</span>
                    <span className="text-white">{formatBRL(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Frete:</span>
                    <span className="text-emerald-400 font-bold">GRÁTIS (Lote Zero)</span>
                  </div>
                  <div className="flex justify-between text-sm text-white font-bold pt-2 border-t border-zinc-800">
                    <span>Total Líquido:</span>
                    <span>{formatBRL(subtotal)}</span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-zinc-600 flex items-center gap-1.5 justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Transação Criptografada • Galpão Fortaleza</span>
                </div>
              </div>
            </div>

          </div>
        </FadeIn>
      </div>
    </>
  );
}