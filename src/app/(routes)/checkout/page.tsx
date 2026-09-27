'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || '', { locale: 'pt-BR' });

export default function CheckoutPage() {
  const [method, setMethod] = useState<'pix' | 'card'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<any>(null);
  const [pixData, setPixData] = useState({ qrCode: '', base64: '' });
  const [payerEmail, setPayerEmail] = useState('');

  // Geração de PIX Direto via nossa API (Sem depender do Brick chato)
  const generatePix = async () => {
    if (!payerEmail) return alert("Insira seu e-mail para receber a nota.");
    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionAmount: 320.00,
          paymentMethodId: 'pix',
          payer: { email: payerEmail, firstName: 'Cliente', lastName: 'VIP', identification: { type: 'CPF', number: '00000000000' } }
        }),
      });
      const data = await response.json();
      if (data.status === 'pending') {
        setPixData({ qrCode: data.qr_code, base64: data.qr_code_base64 });
        setPaymentStatus('pix_pending');
      } else {
        setPaymentStatus('error');
      }
    } catch (e) {
      setPaymentStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Configuração para o Cartão de Crédito
  const customization = {
    paymentMethods: { creditCard: 'all', pix: 'none', maxInstallments: 3 },
    visual: {
      style: {
        theme: 'default', // O tema dark do MP buga os iframes. Vamos usar o default e forçar variáveis.
        customVariables: {
          formBackgroundColor: '#09090b',
          baseColor: '#ffffff',
          textPrimaryColor: '#ffffff',
          textSecondaryColor: '#a1a1aa',
          inputBackgroundColor: '#18181b', // Cinza escuro para forçar contraste nos iframes
          inputTextColor: '#ffffff',
          errorColor: '#ef4444',
          buttonTextColor: '#000000',
          buttonBackgroundColor: '#ffffff',
        }
      }
    }
  };

  const initialization = { amount: 320.00, preferenceId: 'simulacao_lote_zero' };
  const onSubmitCard = async (formData: any) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();
      setPaymentStatus(data.status === 'approved' ? 'approved' : 'rejected');
    } catch (e) { setPaymentStatus('error'); } 
    finally { setIsProcessing(false); }
  };

  return (
    <main className="min-h-screen bg-brand-black text-white pt-24 px-6 pb-20 font-mono">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12">
        
        {/* RESUMO DO LOTE */}
        <div className="w-full md:w-1/3">
          <h2 className="font-serif text-xl uppercase tracking-widest mb-6 border-b border-zinc-800 pb-2">Manifesto</h2>
          <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-4">
            <div><span className="block text-[9px] text-zinc-500 uppercase tracking-widest">Item</span><span className="text-sm font-bold text-white uppercase tracking-wider">Camiseta Boxy Heavyweight</span></div>
            <div className="flex justify-between border-t border-zinc-900 pt-4"><span className="text-[10px] text-zinc-400 uppercase tracking-widest">Subtotal</span><span className="text-xs">R$ 320,00</span></div>
            <div className="flex justify-between border-t border-zinc-800 pt-4"><span className="text-xs font-bold text-white uppercase tracking-widest">Total</span><span className="text-sm font-bold">R$ 320,00</span></div>
          </div>
        </div>

        {/* ÁREA DE PAGAMENTO */}
        <div className="w-full md:w-2/3">
          <h1 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider mb-2">Checkout Criptografado</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-8">Conexão P2P Segura.</p>

          <AnimatePresence mode="wait">
            {!paymentStatus && !isProcessing && (
              <motion.div key="methods" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                
                {/* Abas Brutalistas */}
                <div className="flex gap-4 border-b border-zinc-800 pb-4">
                  <button onClick={() => setMethod('pix')} className={`text-xs uppercase tracking-widest pb-1 transition-colors ${method === 'pix' ? 'text-white border-b-2 border-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}>Pix (Imediato)</button>
                  <button onClick={() => setMethod('card')} className={`text-xs uppercase tracking-widest pb-1 transition-colors ${method === 'card' ? 'text-white border-b-2 border-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}>Cartão de Crédito</button>
                </div>

                {/* Aba PIX */}
                {method === 'pix' && (
                  <div className="bg-zinc-950 p-6 border border-zinc-900 space-y-4">
                    <p className="text-xs text-zinc-400">Insira seu e-mail para receber a confirmação e gerar o código Pix.</p>
                    <input type="email" placeholder="seu@email.com" value={payerEmail} onChange={(e) => setPayerEmail(e.target.value)} className="w-full bg-[#000000] border border-zinc-800 p-4 text-sm text-white uppercase focus:border-white outline-none transition-colors" />
                    <button onClick={generatePix} className="w-full bg-white text-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-zinc-300 transition-colors mt-2">
                      [ GERAR PROTOCOLO PIX ]
                    </button>
                  </div>
                )}

                {/* Aba CARTÃO */}
                {method === 'card' && (
                  <div className="bg-zinc-950 p-4 border border-zinc-900">
                    <style dangerouslySetInnerHTML={{__html: `
                      /* Blindagem CSS para forçar legibilidade sobre a injeção do Mercado Pago */
                      .mp-wrapper { background: #09090b !important; }
                      .mp-input, iframe { color: #ffffff !important; background-color: #18181b !important; color-scheme: dark !important; }
                      .mp-label { color: #a1a1aa !important; text-transform: uppercase; font-size: 10px; font-family: monospace; }
                      .mp-button { background-color: #ffffff !important; color: #000000 !important; font-weight: bold; border-radius: 0 !important; text-transform: uppercase; }
                    `}} />
                    <Payment initialization={initialization} customization={customization as any} onSubmit={onSubmitCard as any} />
                  </div>
                )}
              </motion.div>
            )}

            {isProcessing && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 border border-zinc-900 bg-zinc-950">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest animate-pulse">Processando Liquidação...</span>
              </motion.div>
            )}

            {paymentStatus === 'pix_pending' && (
              <motion.div key="pix_success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-zinc-950 border border-zinc-800 p-8 text-center space-y-6">
                <h3 className="font-serif text-xl uppercase text-white tracking-widest">Protocolo Gerado</h3>
                <div className="bg-white p-4 inline-block mx-auto border-4 border-zinc-800">
                  <img src={`data:image/jpeg;base64,${pixData.base64}`} alt="QR Code PIX" className="w-48 h-48" />
                </div>
                <div className="space-y-2">
                  <span className="block text-[9px] text-zinc-500 uppercase tracking-widest">Pix Copia e Cola</span>
                  <input type="text" value={pixData.qrCode} readOnly className="w-full bg-[#000000] border border-zinc-800 p-4 text-[10px] text-white font-mono text-center focus:outline-none" />
                </div>
              </motion.div>
            )}

            {paymentStatus === 'approved' && (
              <motion.div key="approved" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-zinc-950 border border-zinc-800 p-8 text-center space-y-4">
                <div className="w-12 h-12 border border-white mx-auto rounded-full flex items-center justify-center bg-white text-black font-bold">✓</div>
                <h3 className="font-serif text-xl uppercase tracking-widest">Transação Aprovada</h3>
              </motion.div>
            )}

            {(paymentStatus === 'rejected' || paymentStatus === 'error') && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-brand-red/10 border border-brand-red p-8 text-center space-y-4">
                <h3 className="font-serif text-xl text-brand-red uppercase tracking-widest">Falha na Liquidação</h3>
                <button onClick={() => setPaymentStatus(null)} className="mt-4 border border-zinc-800 px-4 py-2 text-[9px] uppercase tracking-widest hover:bg-zinc-900 transition-colors">Tentar Novamente</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}