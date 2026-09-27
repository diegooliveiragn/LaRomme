'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', document: '', address: '' });
  const [vipPassword, setVipPassword] = useState('');
  
  const generateMockOrderId = () => `LR-${Math.floor(10000 + Math.random() * 90000)}`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderId = generateMockOrderId();
    const serialCode = `LR-D00-BOXY-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // 1. Aciona o disparo do E-mail Transacional White Glove
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: formData.name.split(' ')[0] || 'Membro',
          clientEmail: formData.email,
          orderId: orderId,
          itemSize: 'M', // Pegar dinâmico do carrinho futuro
          serialCode: serialCode
        })
      });

      // 2. Aciona a Telemetria
      let sessionId = localStorage.getItem('lr_session');
      if (sessionId) {
        await fetch('/api/telemetry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            event_type: 'purchase_complete',
            path: '/checkout',
            details: { value: 320, orderId }
          })
        });
      }
    } catch (error) {
      console.error('Erro na integração pós-venda:', error);
    }

    setTimeout(() => {
      setLoading(false);
      setStep(3); // Vai para a tela de Sucesso + Soft Onboarding
    }, 1500);
  };

  const handleVipOnboarding = () => {
    // Soft Onboarding: Salva e-mail e ativa sessão VIP imediatamente
    localStorage.setItem('lr_user_email', formData.email);
    localStorage.setItem('lr_ceo_mode', 'false');
    router.push('/conta');
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 px-6 pb-20 font-sans selection:bg-emerald-500 selection:text-black">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* RESUMO DO PEDIDO */}
        <div className="bg-[#0d0d10] border border-zinc-800 p-8 h-fit space-y-6">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-mono">O Arsenal Selecionado</span>
          <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
            <div>
              <p className="font-bold uppercase tracking-wider">Camiseta Boxy Heavyweight</p>
              <p className="text-xs text-zinc-400 mt-1">Lote Zero • Tamanho M</p>
            </div>
            <p className="font-mono text-white">R$ 320,00</p>
          </div>
          <div className="space-y-2 text-xs font-mono text-zinc-400">
            <div className="flex justify-between"><span>Subtotal</span><span className="text-white">R$ 320,00</span></div>
            <div className="flex justify-between"><span>Frete Expresso</span><span className="text-emerald-400">Cortesia White Glove</span></div>
          </div>
          <div className="flex justify-between items-center border-t border-zinc-800 pt-4 font-mono font-bold">
            <span className="text-sm">TOTAL</span>
            <span className="text-xl">R$ 320,00</span>
          </div>
        </div>

        {/* FLUXO DE PAGAMENTO / ONBOARDING */}
        <div className="space-y-8">
          
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6 animate-in fade-in">
              <div>
                <h1 className="text-xl font-serif uppercase tracking-widest border-b border-zinc-800 pb-2 mb-6">Identificação</h1>
                <div className="space-y-4">
                  <input type="email" name="email" required placeholder="E-mail" onChange={handleInputChange} className="w-full bg-black border border-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-white transition-colors" />
                  <input type="text" name="name" required placeholder="Nome Completo" onChange={handleInputChange} className="w-full bg-black border border-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-white transition-colors" />
                  <input type="text" name="document" required placeholder="CPF" onChange={handleInputChange} className="w-full bg-black border border-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-white transition-colors" />
                </div>
              </div>
              <button type="submit" className="w-full bg-white text-black text-xs font-bold uppercase tracking-widest py-4 hover:bg-zinc-200">
                [ CONTINUAR PARA PAGAMENTO ]
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6 animate-in fade-in">
              <div>
                <h1 className="text-xl font-serif uppercase tracking-widest border-b border-zinc-800 pb-2 mb-6">Liquidação</h1>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-emerald-500 bg-emerald-950/20 cursor-pointer">
                    <input type="radio" name="payment" defaultChecked className="accent-emerald-500" />
                    <div>
                      <p className="font-bold text-sm">Pix Instantâneo</p>
                      <p className="text-xs text-emerald-400 mt-1">Aprovação imediata. Peça reservada no ato.</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-zinc-800 opacity-50 cursor-not-allowed">
                    <input type="radio" name="payment" disabled />
                    <div>
                      <p className="font-bold text-sm text-zinc-500">Cartão de Crédito</p>
                      <p className="text-xs text-zinc-600 mt-1">Indisponível no Lote Zero.</p>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="px-6 py-4 border border-zinc-800 text-zinc-400 text-xs uppercase hover:text-white transition-colors">Voltar</button>
                <button type="submit" disabled={loading} className="flex-1 bg-white text-black text-xs font-bold uppercase tracking-widest py-4 hover:bg-zinc-200 transition-colors disabled:opacity-50">
                  {loading ? '[ PROCESSANDO... ]' : '[ FINALIZAR POSSE ]'}
                </button>
              </div>
            </form>
          )}

          {/* TELA DE SUCESSO + SOFT ONBOARDING (A MÁGICA DA CONVERSÃO DE CONTAS) */}
          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="bg-emerald-950/30 border border-emerald-500/50 p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                  <h2 className="font-bold text-emerald-400 uppercase tracking-widest">POSSE FIRMADA.</h2>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Liquidação aprovada. Seu Certificado de Posse foi enviado para <strong>{formData.email}</strong>.
                </p>
              </div>

              <div className="bg-[#0d0d10] border border-zinc-800 p-8 text-center space-y-6">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-mono mb-2">[ Acesso Restrito ]</span>
                  <h3 className="text-xl font-serif uppercase tracking-widest">Senado VIP LaRomme</h3>
                  <p className="text-xs text-zinc-400 mt-3 max-w-sm mx-auto leading-relaxed">
                    Sua peça foi garantida. Defina uma senha de acesso abaixo para ativar sua conta de membro, acompanhar o rastreio da expedição em tempo real e acessar o Cofre de Drops Secretos.
                  </p>
                </div>

                <div className="max-w-xs mx-auto space-y-4 pt-4">
                  <input 
                    type="password" 
                    placeholder="Defina uma Senha" 
                    value={vipPassword}
                    onChange={(e) => setVipPassword(e.target.value)}
                    className="w-full bg-black border border-zinc-700 px-4 py-3 text-center text-sm text-white outline-none focus:border-white transition-colors"
                  />
                  <button 
                    onClick={handleVipOnboarding}
                    disabled={!vipPassword}
                    className="w-full bg-white text-black text-xs font-bold uppercase tracking-widest py-3 hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500"
                  >
                    [ ATIVAR CONTA VIP ]
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}