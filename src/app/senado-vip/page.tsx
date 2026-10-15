'use client';

import { useState } from 'react';
import FadeIn from '@/components/FadeIn';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SenadoVipPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [patronoId, setPatronoId] = useState('');

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [esporte, setEsporte] = useState('BEACH TENNIS');
  const [tamanho, setTamanho] = useState('M');
  const [estado, setEstado] = useState('CE');
  const [emailError, setEmailError] = useState<string | null>(null);

  // Máscara automática de WhatsApp: (XX) X XXXX-XXXX ou (XX) XXXX-XXXX
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
    let formatted = raw;

    if (raw.length > 0) {
      formatted = `(${raw.slice(0, 2)}`;
      if (raw.length > 2) {
        if (raw.length > 6) {
          if (raw.length > 10) {
            formatted += `) ${raw.slice(2, 3)} ${raw.slice(3, 7)}-${raw.slice(7)}`;
          } else {
            formatted += `) ${raw.slice(2, 6)}-${raw.slice(6)}`;
          }
        } else {
          formatted += `) ${raw.slice(2)}`;
        }
      }
    }
    setWhatsapp(formatted);
  };

  // Detector de erros de digitação e formato
  const validateEmailInput = (val: string): string | null => {
    const trimmed = val.trim().toLowerCase();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(trimmed)) {
      return 'Formato de e-mail inválido. Ex: nome@dominio.com';
    }
    if (trimmed.endsWith('.con') || trimmed.endsWith('.cpm')) {
      return 'Verifique a extensão do e-mail (parece ser .com).';
    }
    if (trimmed.includes('@gmai.') || trimmed.includes('@gamil.')) {
      return 'Verifique o provedor (digitação comum: @gmail.com).';
    }
    if (trimmed.includes('@hotmial.')) {
      return 'Verifique o provedor (digitação comum: @hotmail.com).';
    }
    return null;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (emailError) {
      setEmailError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const err = validateEmailInput(email);
    if (err) {
      setEmailError(err);
      return;
    }

    if (!email || !nome) return;
    setLoading(true);

    const generatedId = Math.floor(100 + Math.random() * 900).toString();

    try {
      await supabase.from('senado_vip').insert([
        {
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          whatsapp: whatsapp.trim(),
          esporte,
          tamanho,
          estado: estado.toUpperCase().trim(),
          origin: 'portal_alistamento',
          status: 'active',
        },
      ]);
    } catch (dbErr) {
      console.warn('Registro no Supabase processado com avisos:', dbErr);
    }

    try {
      await fetch('/api/senado-vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          whatsapp: whatsapp.trim(),
          esporte,
          tamanho,
          estado: estado.toUpperCase().trim(),
          patronoId: generatedId,
        }),
      });
    } catch (apiErr) {
      console.warn('Disparo do e-mail com avisos:', apiErr);
    } finally {
      setPatronoId(generatedId);
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="pt-36 pb-28 px-6 md:px-12 max-w-3xl mx-auto space-y-16 font-sans">
      <FadeIn>
        <div className="text-center space-y-4">
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">PORTAL DO MEMBRO</span>
          <h1 className="font-serif text-3xl md:text-5xl tracking-[0.25em] text-white uppercase font-bold">SENADO VIP.</h1>
          <p className="text-xs font-mono tracking-[0.3em] text-zinc-400">ACESSO ANTECIPADO AO DROP 01.</p>
        </div>
      </FadeIn>

      {!submitted ? (
        <FadeIn delay={150}>
          <form onSubmit={handleSubmit} className="bg-[#080808] border border-zinc-900 p-8 md:p-12 space-y-8">
            <div className="space-y-2 border-b border-zinc-800 pb-4">
              <h2 className="font-serif text-lg text-white font-bold uppercase tracking-wider">CADASTRO DE PREFERÊNCIAS</h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Preencha seus dados para homologar seu acesso prioritário e receber o link de compra com 24 horas de antecedência ao lançamento oficial.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="md:col-span-2">
                <label className="block text-zinc-400 mb-2 uppercase tracking-widest">NOME COMPLETO:</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-white focus:outline-none focus:border-white transition-all"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-2 uppercase tracking-widest">E-MAIL:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="seuemail@exemplo.com.br"
                  className={`w-full bg-zinc-950 border px-4 py-3.5 text-white focus:outline-none transition-all ${
                    emailError ? 'border-rose-500 focus:border-rose-400' : 'border-zinc-800 focus:border-white'
                  }`}
                />
                {emailError && (
                  <span className="text-[10px] text-rose-400 mt-1.5 block tracking-tight">
                    {emailError}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-zinc-400 mb-2 uppercase tracking-widest">WHATSAPP (OPCIONAL):</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={handlePhoneChange}
                  placeholder="(85) 9 0000-0000"
                  className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-white focus:outline-none focus:border-white transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-2 uppercase tracking-widest">MODALIDADE PRINCIPAL:</label>
                <select
                  value={esporte}
                  onChange={(e) => setEsporte(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-white focus:outline-none focus:border-white transition-all appearance-none cursor-pointer"
                >
                  <option value="BEACH TENNIS">BEACH TENNIS</option>
                  <option value="VÔLEI DE PRAIA">VÔLEI DE PRAIA</option>
                  <option value="FUTEVÔLEI">FUTEVÔLEI</option>
                  <option value="CORRIDA DE RUA">CORRIDA DE RUA</option>
                  <option value="TREINO FUNCIONAL / MUSCULAÇÃO">TREINO FUNCIONAL / MUSCULAÇÃO</option>
                  <option value="LIFESTYLE / COTIDIANO">LIFESTYLE / COTIDIANO</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-2 uppercase tracking-widest">TAMANHO:</label>
                  <select
                    value={tamanho}
                    onChange={(e) => setTamanho(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-white focus:outline-none focus:border-white transition-all appearance-none cursor-pointer text-center"
                  >
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="GG">GG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-2 uppercase tracking-widest">ESTADO:</label>
                  <input
                    type="text"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value.toUpperCase())}
                    maxLength={2}
                    placeholder="CE"
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-white focus:outline-none focus:border-white transition-all text-center uppercase font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold text-xs tracking-[0.3em] uppercase py-4 mt-4 hover:bg-zinc-200 transition-all font-sans shadow-xl disabled:opacity-50"
            >
              {loading ? 'HOMOLOGANDO CADASTRO...' : 'CONFIRMAR ACESSO ANTECIPADO.'}
            </button>
          </form>
        </FadeIn>
      ) : (
        <FadeIn>
          <div className="bg-[#080808] border border-zinc-800 p-8 md:p-12 space-y-8 font-mono">
            <div className="text-center space-y-2">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">REGISTRO CONFIRMADO</span>
              <h2 className="font-serif text-2xl text-white font-bold tracking-wider uppercase">BEM-VINDO AO SENADO.</h2>
            </div>

            <div className="border border-white/20 bg-zinc-950 p-6 md:p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 bg-white text-black px-3 py-1 text-[9px] font-bold tracking-widest">
                PRIORIDADE ATIVA
              </div>
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-end border-b border-zinc-800 pb-3">
                  <span className="text-[10px] text-zinc-500 tracking-widest">MEMBRO</span>
                  <span className="text-white font-bold uppercase truncate max-w-[200px]">{nome}</span>
                </div>
                <div className="flex justify-between items-end border-b border-zinc-800 pb-3">
                  <span className="text-[10px] text-zinc-500 tracking-widest">IDENTIFICAÇÃO</span>
                  <span className="text-white font-bold tracking-widest">MEMBRO #{patronoId} • DROP 01</span>
                </div>
                <div className="flex justify-between items-end border-b border-zinc-800 pb-3">
                  <span className="text-[10px] text-zinc-500 tracking-widest">PREFERÊNCIA</span>
                  <span className="text-white text-xs uppercase">{tamanho} • {esporte}</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="text-[9px] text-zinc-600 tracking-widest">ORIGEM</span>
                  <span className="text-[9px] text-zinc-500 tracking-widest">FORTALEZA, CEARÁ</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans font-light text-center">
              Enviamos sua credencial oficial para <strong className="text-white">{email}</strong>. O link exclusivo de compra chegará com 24 horas de antecedência ao público geral.
            </p>
          </div>
        </FadeIn>
      )}

      <FadeIn delay={250}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-2">
            <span className="text-white font-bold uppercase block tracking-widest">01 // JANELA DE 24 HORAS</span>
            <p className="text-zinc-500 text-[11px]">Garantia de escolha da numeração ideal no Drop 01 antes do público geral.</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-2">
            <span className="text-white font-bold uppercase block tracking-widest">02 // CANAL DIRETO</span>
            <p className="text-zinc-500 text-[11px]">Comunicação técnica e transparente sobre matérias-primas, lotes e entregas.</p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
