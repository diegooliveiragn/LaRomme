'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import FadeIn from '@/components/FadeIn';

import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

export default function CheckoutPage() {
  const { items, subtotal, totalItems, clearCart, isLoaded } = useCart();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');

  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);

  // FRETE REAL (MELHOR ENVIO)
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<any>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'apple_pay'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mpInitialized, setMpInitialized] = useState(false);

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
    if (publicKey && !mpInitialized) {
      initMercadoPago(publicKey, { locale: 'pt-BR' });
      setMpInitialized(true);
    }
  }, [mpInitialized]);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length <= 11) {
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      v = v.replace(/^(\d{2})(\d)/, '$1.$2');
      v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
      v = v.replace(/(\d{4})(\d)/, '$1-$2');
    }
    setCpf(v.substring(0, 18));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length <= 10) {
      v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
      v = v.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
      v = v.replace(/(\d{5})(\d)/, '$1-$2');
    }
    setPhone(v.substring(0, 15));
  };

  // CONSULTA CEP E CALCULA FRETE AUTOMATICAMENTE
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let cleanValue = e.target.value.replace(/\D/g, '');
    let formattedCep = cleanValue;
    
    if (cleanValue.length > 5) {
      formattedCep = cleanValue.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    setCep(formattedCep.substring(0, 9));

    if (cleanValue.length === 8) {
      setLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanValue}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setStreet(data.logradouro || '');
          setNeighborhood(data.bairro || '');
          setCity(data.localidade || '');
          setState(data.uf || '');

          // Dispara a consulta ao Melhor Envio
          fetchShippingOptions(cleanValue);
        }
      } catch (err) {
        console.error('Erro ao consultar CEP:', err);
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const fetchShippingOptions = async (destinationCep: string) => {
    setLoadingShipping(true);
    setShippingOptions([]);
    setSelectedShipping(null);

    try {
      const response = await fetch('/api/frete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinationCep, items }),
      });
      const data = await response.json();

      if (data.success && data.options.length > 0) {
        setShippingOptions(data.options);
        // Seleciona automaticamente a primeira opção (mais vantajosa)
        setSelectedShipping(data.options[0]);
      }
    } catch (err) {
      console.error('Erro ao buscar frete:', err);
    } finally {
      setLoadingShipping(false);
    }
  };

  const shippingCost = selectedShipping ? selectedShipping.price : 0;
  const finalTotal = subtotal + shippingCost;

  const formattedSubtotal = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formattedShipping = selectedShipping 
    ? shippingCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'A CALCULAR';
  const formattedFinalTotal = finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleProcessPayment = async (formData: any = null) => {
    if (shippingOptions.length > 0 && !selectedShipping) {
      alert('Por favor, selecione uma opção de frete para continuar.');
      return;
    }

    setIsProcessing(true);

    try {
      let payload: any = {
        items,
        payer: { email, fullName, cpf, phone },
        address: { cep, street, number, neighborhood, city, state },
        paymentMethod,
        subtotal,
        shippingCost,
        shippingService: selectedShipping ? `${selectedShipping.company} - ${selectedShipping.name}` : 'Frete Padrão',
      };

      if (paymentMethod === 'card' && formData) {
        payload.cardData = formData;
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      if (result.success) {
        clearCart();
        
        if (result.paymentMethod === 'pix' && result.pixDetails) {
            localStorage.setItem(`laromme_pix_${result.orderUuid}`, JSON.stringify({
                qrCode: result.pixDetails.qrCode,
                qrCodeBase64: result.pixDetails.qrCodeBase64,
                orderShortId: result.orderShortId
            }));
        }

        router.push(`/pedido/${result.orderUuid}`);
      } else {
        alert(result.error || 'Ocorreu um erro ao processar o pagamento.');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Erro ao processar pagamento:', err);
      alert('Falha na comunicação. Verifique a sua internet e tente novamente.');
      setIsProcessing(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'pix') {
      handleProcessPayment();
    }
  };

  const initializationCard = {
    amount: finalTotal,
    payer: { email: email || 'cliente@laromme.com.br' }
  };

  const customizationCard: any = {
    visual: {
      style: {
        theme: 'dark',
        customVariables: {
          textPrimaryColor: '#ffffff',
          baseColor: '#000000',
        },
      },
    },
    paymentMethods: {
      maxInstallments: 3,
      types: {
        creditCard: 'all',
      },
    },
  };

  if (!isLoaded) return <div className="pt-36 pb-24 text-center min-h-[70vh] flex items-center justify-center font-mono text-xs text-zinc-500">CARREGANDO CHECKOUT...</div>;

  if (items.length === 0 && !isProcessing) {
    return (
      <div className="pt-36 pb-24 px-6 max-w-2xl mx-auto text-center space-y-6 font-sans">
        <h1 className="font-serif text-2xl text-white font-bold tracking-wider uppercase">NENHUM ARTEFATO SELECIONADO.</h1>
        <p className="text-xs text-zinc-400 font-mono">Sua sacola está vazia. Adicione produtos antes de prosseguir para o checkout.</p>
        <Link href="/#origo" className="inline-block bg-white text-black font-bold text-xs tracking-widest px-8 py-4 uppercase">
          EXPLORAR COLEÇÃO
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12 font-sans">
      <FadeIn>
        <div className="border-b border-zinc-900 pb-6 flex justify-between items-end">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block mb-1">FINALIZAÇÃO DE PEDIDO</span>
            <h1 className="font-serif text-2xl md:text-4xl tracking-[0.2em] text-white uppercase font-bold">CHECKOUT TRANSPARENTE.</h1>
          </div>
          <div className="hidden md:flex text-zinc-500 font-mono text-[10px] items-center gap-2">
            <span>🔒 CONEXÃO BLINDADA</span>
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          <form id="checkout-form" onSubmit={handleFormSubmit} className="space-y-8">
            
            {/* 01. IDENTIFICAÇÃO */}
            <div className="bg-[#080808] border border-zinc-900 p-6 space-y-4">
              <h2 className="font-serif text-base text-white font-bold tracking-wider uppercase border-b border-zinc-800 pb-3">01. IDENTIFICAÇÃO.</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div><label className="block text-zinc-400 mb-1">NOME COMPLETO:</label><input required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isProcessing} className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white disabled:opacity-50" placeholder="Seu nome" /></div>
                <div><label className="block text-zinc-400 mb-1">E-MAIL:</label><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isProcessing} className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white disabled:opacity-50" placeholder="email@dominio.com" /></div>
                <div><label className="block text-zinc-400 mb-1">CPF / CNPJ:</label><input required type="text" value={cpf} onChange={handleCpfChange} disabled={isProcessing} className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white disabled:opacity-50" placeholder="000.000.000-00" /></div>
                <div><label className="block text-zinc-400 mb-1">TELEFONE / WHATSAPP:</label><input required type="tel" value={phone} onChange={handlePhoneChange} disabled={isProcessing} className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white disabled:opacity-50" placeholder="(00) 00000-0000" /></div>
              </div>
            </div>

            {/* 02. ENDEREÇO & FRETE */}
            <div className="bg-[#080808] border border-zinc-900 p-6 space-y-4">
              <h2 className="font-serif text-base text-white font-bold tracking-wider uppercase border-b border-zinc-800 pb-3">02. ENDEREÇO DE ENTREGA.</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div><label className="block text-zinc-400 mb-1">CEP {loadingCep && '(BUSCANDO...)'}:</label><input required type="text" value={cep} onChange={handleCepChange} disabled={isProcessing} className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white disabled:opacity-50" placeholder="00000-000" /></div>
                <div className="md:col-span-2"><label className="block text-zinc-400 mb-1">LOGRADOURO / RUA:</label><input required type="text" value={street} onChange={(e) => setStreet(e.target.value)} disabled={isProcessing} className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white disabled:opacity-50" placeholder="Rua / Avenida" /></div>
                <div><label className="block text-zinc-400 mb-1">NÚMERO:</label><input required type="text" value={number} onChange={(e) => setNumber(e.target.value)} disabled={isProcessing} className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white disabled:opacity-50" placeholder="123" /></div>
                <div><label className="block text-zinc-400 mb-1">BAIRRO:</label><input required type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} disabled={isProcessing} className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white disabled:opacity-50" placeholder="Bairro" /></div>
                <div><label className="block text-zinc-400 mb-1">CIDADE / UF:</label><input required type="text" value={`${city}${state ? ` / ${state}` : ''}`} onChange={(e) => setCity(e.target.value)} disabled={isProcessing} className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white disabled:opacity-50" placeholder="Fortaleza / CE" /></div>
              </div>

              {/* SELETOR DE FRETE MELHOR ENVIO */}
              {loadingShipping && (
                <div className="p-4 bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-500 text-center animate-pulse">
                  CALCULANDO OPÇÕES DE FRETE JUNTO ÀS TRANSPORTADORAS...
                </div>
              )}

              {shippingOptions.length > 0 && !loadingShipping && (
                <div className="pt-4 border-t border-zinc-800 space-y-3 font-mono text-xs">
                  <label className="block text-white font-bold uppercase tracking-wider">OPÇÕES DE ENVIO DISPONÍVEIS:</label>
                  <div className="space-y-2">
                    {shippingOptions.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center justify-between p-3 border cursor-pointer transition-all ${
                          selectedShipping?.id === opt.id ? 'bg-zinc-900 border-white text-white' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shippingOption"
                            checked={selectedShipping?.id === opt.id}
                            onChange={() => setSelectedShipping(opt)}
                            className="accent-white"
                          />
                          <div>
                            <span className="font-bold text-white block">{opt.company} — {opt.name}</span>
                            <span className="text-[10px] text-zinc-500">Prazo estimado: {opt.deliveryTime} dias úteis</span>
                          </div>
                        </div>
                        <div className="font-bold text-white">
                          {opt.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 03. PAGAMENTO */}
            <div className="bg-[#080808] border border-zinc-900 p-6 space-y-4 relative">
              <h2 className="font-serif text-base text-white font-bold tracking-wider uppercase border-b border-zinc-800 pb-3">03. PAGAMENTO.</h2>

              {!isProcessing && (
                <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-6">
                  <button type="button" onClick={() => setPaymentMethod('pix')} className={`py-3 px-2 border text-center font-bold uppercase transition-all ${paymentMethod === 'pix' ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-400'}`}>PIX</button>
                  <button type="button" onClick={() => setPaymentMethod('card')} className={`py-3 px-2 border text-center font-bold uppercase transition-all ${paymentMethod === 'card' ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-400'}`}>CARTÃO</button>
                </div>
              )}

              {paymentMethod === 'pix' && (
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-400 space-y-2">
                    <p className="text-white font-bold">✓ APROVAÇÃO IMEDIATA</p>
                    <p>O código Pix Copia e Cola será gerado na próxima tela, atrelado ao seu número de pedido oficial.</p>
                  </div>
                  <button type="submit" disabled={isProcessing} className={`w-full font-bold text-xs tracking-[0.25em] uppercase py-4 transition-all shadow-xl font-sans ${isProcessing ? 'bg-zinc-800 text-zinc-500 cursor-wait' : 'bg-white text-black hover:bg-zinc-200'}`}>
                    {isProcessing ? 'A REGISTRAR PEDIDO...' : `GERAR PEDIDO DE ${formattedFinalTotal}`}
                  </button>
                </div>
              )}

              {paymentMethod === 'card' && mpInitialized && (
                <div className="space-y-4 mt-4">
                  <div className="min-h-[300px]">
                    <Payment
                      initialization={initializationCard}
                      customization={customizationCard}
                      onSubmit={async (formData) => {
                        await handleProcessPayment(formData);
                      }}
                      onError={(error) => {
                        console.error('Erro no Brick do Mercado Pago:', error);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* COLUNA DIREITA: RESUMO */}
        <div className={`lg:col-span-5 space-y-6 transition-opacity ${isProcessing ? 'opacity-30' : 'opacity-100'}`}>
          <div className="bg-[#080808] border border-zinc-900 p-6 space-y-6">
            <h2 className="font-serif text-lg text-white font-bold tracking-wider uppercase border-b border-zinc-800 pb-3">RESUMO DA SACOLA ({totalItems}).</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.cartItemId} className="flex gap-4 items-center border-b border-zinc-900 pb-3">
                  <div className="relative w-14 h-16 bg-zinc-950 border border-zinc-900 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 font-mono text-xs space-y-1">
                    <h3 className="text-white font-bold font-serif">{item.name}</h3>
                    <p className="text-zinc-500 text-[10px]">TAM: {item.size} • COR: {item.colorName}</p>
                    <p className="text-zinc-300 font-bold">{item.priceString} x {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 pt-4 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-zinc-400"><span>SUBTOTAL:</span><span className="text-white font-bold">{formattedSubtotal}</span></div>
              <div className="flex justify-between text-zinc-400"><span>FRETE:</span><span className="text-white font-bold">{formattedShipping}</span></div>
              <div className="flex justify-between text-sm text-white font-bold pt-2 border-t border-zinc-900"><span>TOTAL:</span><span>{formattedFinalTotal}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}