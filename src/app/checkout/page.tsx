'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import FadeIn from '@/components/FadeIn';

// VALIDAÇÃO MATEMÁTICA OFICIAL DE CPF (MÓDULO 11)
function isValidCPF(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(clean)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean.charAt(i)) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean.charAt(i)) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(10))) return false;

  return true;
}

// VALIDAÇÃO MATEMÁTICA OFICIAL DE CNPJ
function isValidCNPJ(cnpj: string): boolean {
  const clean = cnpj.replace(/\D/g, '');
  if (clean.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(clean)) return false;

  let size = clean.length - 2;
  let numbers = clean.substring(0, size);
  const digits = clean.substring(size);
  let sum = 0;
  let pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  size = size + 1;
  numbers = clean.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function CheckoutPage() {
  const { items, clearCart, setActiveOrderData } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [payer, setPayer] = useState({ fullName: '', email: '', cpf: '', phone: '' });
  const [address, setAddress] = useState({ cep: '', street: '', number: '', neighborhood: '', city: '', state: '' });

  // ESTADOS DE ERRO INLINE
  const [cpfError, setCpfError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // MÁSCARA REATIVA CPF/CNPJ
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

  const handleCpfBlur = () => {
    const raw = payer.cpf.replace(/\D/g, '');
    if (!raw) {
      setCpfError('');
      return;
    }
    if (raw.length === 11) {
      if (!isValidCPF(raw)) {
        setCpfError('CPF com dígitos verificadores matematicamente inválidos.');
      } else {
        setCpfError('');
      }
    } else if (raw.length === 14) {
      if (!isValidCNPJ(raw)) {
        setCpfError('CNPJ matematicamente inválido.');
      } else {
        setCpfError('');
      }
    } else {
      setCpfError('Documento incompleto (necessário 11 dígitos para CPF).');
    }
  };

  // MÁSCARA REATIVA TELEFONE
  const maskPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 10) {
      return digits
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
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

  // MÁSCARA REATIVA CEP
  const maskCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 8)
      .replace(/(\d{5})(\d)/, '$1-$2');
  };

  const handleCEPChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = maskCEP(e.target.value);
    setAddress((prev) => ({ ...prev, cep: formatted }));

    const raw = formatted.replace(/\D/g, '');
    if (raw.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setAddress((prev) => ({
            ...prev,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || ''
          }));
        }
      } catch (err) {
        console.error('Falha ao consultar CEP:', err);
      }
    }
  };

  const getItemPrice = (item: any): number => {
    if (typeof item.priceNumeric === 'number' && item.priceNumeric > 0) {
      return item.priceNumeric;
    }
    const valStr = item.price || item.priceString || '';
    if (typeof valStr === 'string' && valStr.trim() !== '') {
      const clean = valStr.replace(/[^\d,.]/g, '').replace(',', '.');
      const parsed = parseFloat(clean);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 1.00;
  };

  const subtotal = items.reduce((acc, item) => {
    return acc + getItemPrice(item) * item.quantity;
  }, 0);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // SANITIZAÇÃO COMPLETA
    const cleanName = payer.fullName.trim().replace(/\s+/g, ' ');
    const cleanEmail = payer.email.trim().toLowerCase();
    const cleanDoc = payer.cpf.replace(/\D/g, '');
    const cleanPhone = payer.phone.replace(/\D/g, '');
    const cleanCEP = address.cep.replace(/\D/g, '');

    if (!cleanName || cleanName.split(' ').length < 2) {
      setErrorMsg('Informe seu nome e sobrenome completos.');
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      setErrorMsg('E-mail institucional ou pessoal inválido.');
      return;
    }
    if (cleanDoc.length === 11) {
      if (!isValidCPF(cleanDoc)) {
        setErrorMsg('O número de CPF informado é matematicamente inválido.');
        setCpfError('CPF com dígitos verificadores matematicamente inválidos.');
        return;
      }
    } else if (cleanDoc.length === 14) {
      if (!isValidCNPJ(cleanDoc)) {
        setErrorMsg('O número de CNPJ informado é inválido.');
        setCpfError('CNPJ matematicamente inválido.');
        return;
      }
    } else {
      setErrorMsg('Documento de identificação incompleto (CPF ou CNPJ).');
      setCpfError('Documento incompleto.');
      return;
    }

    if (cleanPhone.length < 10) {
      setErrorMsg('Telefone inválido. Inclua o DDD.');
      return;
    }
    if (cleanCEP.length !== 8) {
      setErrorMsg('CEP incompleto ou inválido.');
      return;
    }
    if (!address.street.trim() || !address.number.trim() || !address.city.trim() || !address.state.trim()) {
      setErrorMsg('Preencha os dados completos de entrega.');
      return;
    }

    setLoading(true);

    try {
      const sanitizedAddress = {
        cep: cleanCEP,
        street: address.street.trim(),
        number: address.number.trim(),
        neighborhood: address.neighborhood.trim(),
        city: address.city.trim(),
        state: address.state.trim().toUpperCase()
      };

      const payload = {
        items: items.map((i) => ({
          id: i.productId || i.id,
          name: i.name,
          size: i.size,
          quantity: i.quantity,
          price: getItemPrice(i)
        })),
        payer: {
          name: cleanName,
          fullName: cleanName,
          email: cleanEmail,
          cpf: cleanDoc,
          phone: cleanPhone
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

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao processar transação.');
      }

      if (setActiveOrderData) {
        setActiveOrderData({
          id: data.orderId,
          shortId: data.orderId.slice(0, 8)
        });
      }

      clearCart();
      router.push(`/pedido/${data.orderId}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha na comunicação com o gateway.');
    } finally {
      setLoading(false);
    }
  };

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

          <form onSubmit={handleCreateOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-7 space-y-10">
              
              <div className="space-y-4 border-b border-zinc-900 pb-8">
                <h2 className="text-sm font-serif tracking-widest uppercase text-zinc-300 font-bold">
                  01. Identificação
                </h2>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="NOME COMPLETO"
                      value={payer.fullName}
                      onChange={(e) => setPayer({ ...payer, fullName: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 placeholder-zinc-600 focus:border-white focus:outline-none transition-colors"
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
                      className={`w-full bg-zinc-950 border p-3 text-zinc-200 placeholder-zinc-600 focus:outline-none transition-colors ${
                        emailError ? 'border-rose-600 focus:border-rose-500' : 'border-zinc-800 focus:border-white'
                      }`}
                    />
                    {emailError && <p className="text-[10px] text-rose-400 mt-1 uppercase">{emailError}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        className={`w-full bg-zinc-950 border p-3 text-zinc-200 placeholder-zinc-600 focus:outline-none transition-colors ${
                          cpfError ? 'border-rose-600 focus:border-rose-500' : 'border-zinc-800 focus:border-white'
                        }`}
                      />
                      {cpfError && <p className="text-[10px] text-rose-400 mt-1 uppercase tracking-tight">{cpfError}</p>}
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
                        className={`w-full bg-zinc-950 border p-3 text-zinc-200 placeholder-zinc-600 focus:outline-none transition-colors ${
                          phoneError ? 'border-rose-600 focus:border-rose-500' : 'border-zinc-800 focus:border-white'
                        }`}
                      />
                      {phoneError && <p className="text-[10px] text-rose-400 mt-1 uppercase tracking-tight">{phoneError}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-b border-zinc-900 pb-8">
                <h2 className="text-sm font-serif tracking-widest uppercase text-zinc-300 font-bold">
                  02. Destino de Entrega
                </h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="CEP"
                      value={address.cep}
                      onChange={handleCEPChange}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 placeholder-zinc-600 focus:border-white focus:outline-none transition-colors sm:col-span-1"
                    />
                    <input
                      type="text"
                      required
                      placeholder="RUA / LOGRADOURO"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 placeholder-zinc-600 focus:border-white focus:outline-none transition-colors sm:col-span-2"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="NÚMERO"
                      value={address.number}
                      onChange={(e) => setAddress({ ...address, number: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 placeholder-zinc-600 focus:border-white focus:outline-none transition-colors sm:col-span-1"
                    />
                    <input
                      type="text"
                      required
                      placeholder="BAIRRO"
                      value={address.neighborhood}
                      onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 placeholder-zinc-600 focus:border-white focus:outline-none transition-colors sm:col-span-2"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="CIDADE"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="col-span-2 bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 placeholder-zinc-600 focus:border-white focus:outline-none transition-colors"
                    />
                    <input
                      type="text"
                      required
                      placeholder="UF"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value.toUpperCase() })}
                      maxLength={2}
                      className="col-span-1 bg-zinc-950 border border-zinc-800 p-3 text-zinc-200 placeholder-zinc-600 focus:border-white focus:outline-none transition-colors uppercase text-center"
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 p-6 space-y-6">
              <h2 className="text-sm font-serif tracking-widest uppercase text-zinc-300 font-bold border-b border-zinc-800 pb-3">
                Resumo da Sacola
              </h2>

              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {items.map((i, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs border-b border-zinc-900 pb-3">
                    <div>
                      <p className="font-bold text-zinc-200">{i.name}</p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        Tam: {i.size} | Qtd: {i.quantity}
                      </p>
                    </div>
                    <span className="font-mono text-zinc-300">
                      {formatBRL(getItemPrice(i) * i.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>{formatBRL(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Frete Expresso</span>
                  <span className="text-emerald-400">GRÁTIS</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                  <span>Total</span>
                  <span>{formatBRL(subtotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] font-bold hover:bg-zinc-200 transition-all disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Processando Gateway...' : 'Gerar Pedido Pix'}
              </button>

              <p className="text-[10px] text-zinc-500 text-center tracking-wider uppercase font-mono">
                Liquidação Instantânea via Mercado Pago
              </p>
            </div>

          </form>
        </FadeIn>
      </div>
    </main>
  );
}