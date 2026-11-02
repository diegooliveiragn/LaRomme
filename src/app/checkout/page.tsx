'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import FadeIn from '@/components/FadeIn';

export default function CheckoutPage() {
  const { items, clearCart, setActiveOrderData } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [payer, setPayer] = useState({ fullName: '', email: '', cpf: '', phone: '' });
  const [address, setAddress] = useState({ cep: '', street: '', number: '', neighborhood: '', city: '', state: '' });
  const [birthDate, setBirthDate] = useState('');
  const [selectedSport, setSelectedSport] = useState('Beach Tennis');

  const sportsOptions = [
    'Vôlei de Praia',
    'Beach Tennis',
    'Futevôlei',
    'Corrida',
    'Musculação / Treino',
    'Cotidiano / Lifestyle'
  ];

  // ESTADOS DE ERRO INLINE
  const [cpfError, setCpfError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // TITLE CASE HIGIENIZADO PARA NOMES PRÓPRIOS
  const toTitleCasePt = (name: string) => {
    if (!name) return '';
    const particles = new Set(['de', 'da', 'do', 'das', 'dos', 'e']);
    return name
      .toLowerCase()
      .split(/\s+/)
      .map((word, i) => (i > 0 && particles.has(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)))
      .join(' ');
  };

  // MÁSCARAS REATIVAS
  const maskCPFCNPJ = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 14);
    if (digits.length <= 11) {
      return digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  };

  const maskPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 10) {
      return digits.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
    }
    return digits.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
  };

  const maskCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 8)
      .replace(/(\d{5})(\d)/, '$1-$2');
  };

  const maskDate = (val: string) => {
    return val
      .replace(/\D/g, '')
      .slice(0, 8)
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2');
  };

  // VALIDAÇÕES
  const isValidCPF = (cpf: string) => {
    const clean = cpf.replace(/\D/g, '');
    if (clean.length !== 11 || !!clean.match(/(\d)\1{10}/)) return false;
    let sum = 0, rest;
    for (let i = 1; i <= 9; i++) sum += parseInt(clean.substring(i - 1, i)) * (11 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(clean.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(clean.substring(i - 1, i)) * (12 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    return rest === parseInt(clean.substring(10, 11));
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleCpfBlur = () => {
    const raw = payer.cpf.replace(/\D/g, '');
    if (!raw) {
      setCpfError('');
      return;
    }
    if (raw.length === 11) {
      if (!isValidCPF(raw)) {
        setCpfError('CPF com dígitos verificadores inválidos.');
      } else {
        setCpfError('');
      }
    } else if (raw.length < 11) {
      setCpfError('Documento incompleto.');
    } else {
      setCpfError('');
    }
  };

  const handlePhoneBlur = () => {
    const raw = payer.phone.replace(/\D/g, '');
    if (raw && raw.length < 10) {
      setPhoneError('Telefone incompleto. Inclua o DDD.');
    } else {
      setPhoneError('');
    }
  };

  const handleEmailBlur = () => {
    if (payer.email && !isValidEmail(payer.email)) {
      setEmailError('Formato de e-mail inválido.');
    } else {
      setEmailError('');
    }
  };

  const handleCepChange = async (cepValue: string) => {
    const masked = maskCEP(cepValue);
    setAddress((prev) => ({ ...prev, cep: masked }));
    const clean = masked.replace(/\D/g, '');
    if (clean.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        if (res.ok) {
          const data = await res.json();
          if (!data.erro) {
            setAddress((prev) => ({
              ...prev,
              street: data.logradouro || prev.street,
              neighborhood: data.bairro || prev.neighborhood,
              city: data.localidade || prev.city,
              state: data.uf || prev.state,
            }));
          }
        }
      } catch (e) {
        console.warn('Erro ao consultar ViaCEP:', e);
      }
    }
  };

  const getItemPrice = (item: any): number => {
    if (typeof item.priceNumeric === 'number' && !isNaN(item.priceNumeric)) {
      return item.priceNumeric;
    }
    if (typeof item.price === 'number' && !isNaN(item.price)) {
      return item.price;
    }
    if (typeof item.price === 'string') {
      const parsed = parseFloat(item.price.replace(/[^\d,.-]/g, '').replace(',', '.'));
      if (!isNaN(parsed)) return parsed;
    }
    return 0;
  };

  const subtotal = items.reduce((acc, item) => acc + getItemPrice(item) * item.quantity, 0);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setErrorMsg('');

    const cleanName = toTitleCasePt(payer.fullName.trim().replace(/\s+/g, ' '));
    const cleanEmail = payer.email.trim().toLowerCase();
    const cleanDoc = payer.cpf.replace(/\D/g, '');
    const cleanPhone = payer.phone.replace(/\D/g, '');
    const cleanCEP = address.cep.replace(/\D/g, '');

    if (!cleanName || cleanName.split(' ').length < 2) {
      setErrorMsg('Informe seu nome e sobrenome completos.');
      setLoading(false);
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      setErrorMsg('E-mail institucional ou pessoal inválido.');
      setLoading(false);
      return;
    }
    if (cleanDoc.length === 11 && !isValidCPF(cleanDoc)) {
      setErrorMsg('CPF inválido.');
      setLoading(false);
      return;
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Telefone com DDD inválido.');
      setLoading(false);
      return;
    }
    if (!cleanCEP || cleanCEP.length !== 8) {
      setErrorMsg('CEP inválido.');
      setLoading(false);
      return;
    }
    if (!address.street || !address.number || !address.city || !address.state) {
      setErrorMsg('Preencha o endereço completo de entrega.');
      setLoading(false);
      return;
    }

    try {
      const sanitizedAddress = {
        cep: cleanCEP,
        street: address.street.trim(),
        number: address.number.trim(),
        neighborhood: (address.neighborhood || '').trim(),
        city: address.city.trim(),
        state: address.state.trim().toUpperCase()
      };

      const payload = {
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          size: i.size,
          colorName: i.colorName,
          quantity: i.quantity,
          price: getItemPrice(i)
        })),
        payer: {
          name: cleanName,
          fullName: cleanName,
          email: cleanEmail,
          cpf: cleanDoc,
          phone: cleanPhone,
          birthDate: birthDate.trim(),
          sport: selectedSport
        },
        address: sanitizedAddress,
        shippingAddress: sanitizedAddress,
        shippingCost: 0
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success && data.orderUuid) {
        if (data.pix) {
          try {
            localStorage.setItem(`laromme_pix_${data.orderUuid}`, JSON.stringify(data.pix));
          } catch (e) {}
        }
        setActiveOrderData({ id: data.orderUuid, shortId: data.orderShortId });
        clearCart();
        router.push(`/pedido/${data.orderUuid}`);
      } else {
        setErrorMsg(data.error || 'Erro ao processar pedido no servidor.');
      }
    } catch (err: any) {
      setErrorMsg('Erro de conexão ao processar compra.');
    } finally {
      setLoading(false);
    }
  };

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs uppercase tracking-widest px-6">
        <div className="text-center space-y-4">
          <p className="text-zinc-500">Sua sacola está vazia.</p>
          <button
            onClick={() => router.push('/')}
            className="text-white border-b border-white pb-0.5 hover:text-zinc-400 hover:border-zinc-400 transition-colors cursor-pointer"
          >
            Retornar ao Acervo
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 font-mono text-xs space-y-10">
        <FadeIn>
          <div className="border-b border-zinc-800 pb-6">
            <span className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] block mb-2 font-mono">
              Processo de Aquisição • Protocolo Seguro
            </span>
            <h1 className="font-serif text-3xl md:text-4xl uppercase tracking-wider font-bold">
              Finalizar Pedido
            </h1>
          </div>

          {errorMsg && (
            <div className="p-4 border border-rose-900/60 bg-rose-950/20 text-rose-400 text-xs uppercase tracking-wider mb-8">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleCreateOrder} className="space-y-10">
            {/* ETAPA 1: DADOS DO PATRONO */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 md:p-8 space-y-6">
              <h2 className="text-sm font-serif tracking-widest uppercase text-white font-bold border-b border-zinc-900 pb-3">
                01. Identificação do Patrono
              </h2>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="NOME COMPLETO"
                    value={payer.fullName}
                    onChange={(e) => setPayer({ ...payer, fullName: e.target.value })}
                    onBlur={() => setPayer((prev) => ({ ...prev, fullName: toTitleCasePt(prev.fullName) }))}
                    className="w-full bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 placeholder-zinc-600 focus:border-white focus:outline-none transition-colors text-xs font-mono capitalize"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    required
                    placeholder="E-MAIL"
                    value={payer.email}
                    onChange={(e) => setPayer({ ...payer, email: e.target.value })}
                    onBlur={handleEmailBlur}
                    className={`w-full bg-zinc-950 border p-3 text-zinc-200 placeholder-zinc-600 focus:outline-none transition-colors text-xs font-mono ${
                      emailError ? 'border-rose-600 focus:border-rose-500' : 'border-zinc-800 focus:border-white'
                    }`}
                  />
                  {emailError && <p className="text-[10px] text-rose-400 mt-1 uppercase font-mono">{emailError}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="CPF / CNPJ"
                      value={payer.cpf}
                      onChange={(e) => {
                        setPayer({ ...payer, cpf: maskCPFCNPJ(e.target.value) });
                        if (cpfError) setCpfError('');
                      }}
                      onBlur={handleCpfBlur}
                      className={`w-full bg-zinc-950 border p-3 text-zinc-200 placeholder-zinc-600 focus:outline-none transition-colors text-xs font-mono ${
                        cpfError ? 'border-rose-600 focus:border-rose-500' : 'border-zinc-800 focus:border-white'
                      }`}
                    />
                    {cpfError && <p className="text-[10px] text-rose-400 mt-1 uppercase font-mono tracking-tight">{cpfError}</p>}
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="TELEFONE / WHATSAPP"
                      value={payer.phone}
                      onChange={(e) => {
                        setPayer({ ...payer, phone: maskPhone(e.target.value) });
                        if (phoneError) setPhoneError('');
                      }}
                      onBlur={handlePhoneBlur}
                      className={`w-full bg-zinc-950 border p-3 text-zinc-200 placeholder-zinc-600 focus:outline-none transition-colors text-xs font-mono ${
                        phoneError ? 'border-rose-600 focus:border-rose-500' : 'border-zinc-800 focus:border-white'
                      }`}
                    />
                    {phoneError && <p className="text-[10px] text-rose-400 mt-1 uppercase font-mono tracking-tight">{phoneError}</p>}
                  </div>
                </div>

                {/* DATA DE NASCIMENTO (OPCIONAL) */}
                <div>
                  <input
                    type="text"
                    placeholder="DATA DE NASCIMENTO (OPCIONAL - DD/MM/AAAA)"
                    value={birthDate}
                    onChange={(e) => setBirthDate(maskDate(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 placeholder-zinc-600 focus:border-white focus:outline-none transition-colors text-xs font-mono"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1 uppercase font-mono tracking-tight">
                    Para ações e atenciosidades no mês do seu aniversário.
                  </p>
                </div>

                {/* PRÁTICA ESPORTIVA PRINCIPAL */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 block font-mono">
                    Sua Prática Esportiva Principal:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sportsOptions.map((sport) => (
                      <button
                        key={sport}
                        type="button"
                        onClick={() => setSelectedSport(sport)}
                        className={`px-3 py-1.5 rounded text-[11px] font-mono tracking-wider uppercase transition-all border cursor-pointer ${
                          selectedSport === sport
                            ? 'bg-white text-black border-white font-bold shadow-sm'
                            : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200'
                        }`}
                      >
                        {sport}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ETAPA 2: ENDEREÇO DE ENTREGA */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 md:p-8 space-y-6">
              <h2 className="text-sm font-serif tracking-widest uppercase text-white font-bold border-b border-zinc-900 pb-3">
                02. Destino de Envio
              </h2>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="CEP (00000-000)"
                    value={address.cep}
                    onChange={(e) => handleCepChange(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 placeholder-zinc-600 focus:border-white focus:outline-none transition-colors text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="LOGRADOURO (RUA, AVENIDA)"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 placeholder-zinc-600 focus:border-white focus:outline-none transition-colors text-xs font-mono"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="NÚMERO"
                      value={address.number}
                      onChange={(e) => setAddress({ ...address, number: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 placeholder-zinc-600 focus:border-white focus:outline-none transition-colors text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="BAIRRO"
                      value={address.neighborhood}
                      onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 placeholder-zinc-600 focus:border-white focus:outline-none transition-colors text-xs font-mono"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="CIDADE"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 placeholder-zinc-600 focus:border-white focus:outline-none transition-colors text-xs font-mono"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="UF (ESTADO)"
                      maxLength={2}
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value.toUpperCase() })}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 placeholder-zinc-600 focus:border-white focus:outline-none transition-colors text-xs font-mono uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ETAPA 3: REVISÃO FINANCEIRA & SUBMISSÃO */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 md:p-8 space-y-6">
              <h2 className="text-sm font-serif tracking-widest uppercase text-white font-bold border-b border-zinc-900 pb-3">
                03. Resumo & Liquidação Pix (0,99%)
              </h2>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between items-center text-xs py-2 border-b border-zinc-900">
                    <div>
                      <span className="font-bold text-zinc-200">{item.name}</span>
                      <span className="text-zinc-500 text-[10px] block font-mono">
                        Tam: {item.size} • Qtd: {item.quantity}
                      </span>
                    </div>
                    <span className="font-mono text-zinc-300">
                      {formatBRL(getItemPrice(item) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-3 border-t border-zinc-900 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal dos Artefatos:</span>
                  <span className="font-mono text-zinc-200">{formatBRL(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Frete Expresso:</span>
                  <span className="font-mono text-emerald-400 font-bold">GRÁTIS</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-3 border-t border-zinc-800 text-base">
                  <span>Total do Pedido:</span>
                  <span className="font-mono">{formatBRL(subtotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg disabled:opacity-50 mt-4"
              >
                {loading ? 'Processando Ordem & Emitindo Pix...' : 'Confirmar Pedido & Gerar Pix'}
              </button>
            </div>
          </form>
        </FadeIn>
      </div>
    </main>
  );
}