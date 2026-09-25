'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

// Inicializando o motor visual do MP com a Chave PÚBLICA.
initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || '', { locale: 'pt-BR' });

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<any>(null);
  const [pixCode, setPixCode] = useState('');
  const [qrCodeImg, setQrCodeImg] = useState('');

  const customization = {
    paymentMethods: {
      pix: 'all',
      creditCard: 'all',
      maxInstallments: 3,
    },
    visual: {
      style: {
        theme: 'dark', // Essencial para o estilo brutalista da LaRomme
        customVariables: {
          textPrimaryColor: '#FFFFFF',
          textSecondaryColor: '#9CA3AF',
          inputBackgroundColor: '#09090b',
          inputTextColor: '#FFFFFF',
          baseColor: '#FFFFFF',
        }
      }
    }
  };

  const initialization = {
    amount: 320.00, // Valor exemplo da camiseta Origo
    preferenceId: 'simulacao_lote_zero',
  };

  const onSubmit = async (formData: any) => {
    setIsProcessing(true);
    setPaymentStatus(null);
    setPixCode('');

    try {
      // 1. Enviar os dados do cliente para o NOSSO backend seguro
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      // 2. Tratar a resposta
      if (data.status === 'approved') {
        setPaymentStatus('approved');
      } else if (data.status === 'pending' && data.qr_code) {
        // Se for Pix, o banco retorna o status pendente e os códigos
        setPaymentStatus('pix_pending');
        setPixCode(data.qr_code);
        setQrCodeImg(`data:image/jpeg;base64,${data.qr_code_base64}`);
      } else {
        setPaymentStatus('rejected');
      }
    } catch (error) {
      console.error(error);
      setPaymentStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-black text-white pt-24 px-6 pb-20 font-mono">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
        
        {/* Lado Esquerdo: Resumo do Lote */}
        <div className="w-full md:w-1/3">
          <h2 className="font-serif text-xl uppercase tracking-widest mb-6 border-b border-zinc-800 pb-2">Manifesto</h2>
          <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-4">
            <div>
              <span className="block text-[9px] text-zinc-500 uppercase tracking-widest">Item</span>
              <span className="text-sm font-bold text-white uppercase tracking-wider">Camiseta Boxy Heavyweight - Origo</span>
            </div>
            <div className="flex justify-between border-t border-zinc-900 pt-4">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest">Subtotal</span>
              <span className="text-xs">R$ 320,00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest">Frete (VIP)</span>
              <span className="text-xs text-brand-red">Cortesia</span>
            </div>
            <div className="flex justify-between border-t border-zinc-800 pt-4">
              <span className="text-xs font-bold text-white uppercase tracking-widest">Total</span>
              <span className="text-sm font-bold">R$ 320,00</span>
            </div>
          </div>
        </div>

        {/* Lado Direito: Adquirente */}
        <div className="w-full md:w-2/3">
          <h1 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider mb-2">Checkout Criptografado</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-8">Conexão segura com Mercado Pago Adquirente S.A.</p>

          <AnimatePresence mode="wait">
            {!paymentStatus && (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                 <div className="bg-zinc-950/50 p-1 rounded-sm">
                   {/* O componente mágico do SDK que renderiza o formulário dark */}
                   <Payment
                      initialization={initialization}
                      customization={customization as any}
                      onSubmit={onSubmit as any}
                   />
                 </div>
              </motion.div>
            )}

            {isProcessing && !paymentStatus && (
              <div className="text-center py-20 text-[10px] text-zinc-500 uppercase tracking-widest animate-pulse border border-zinc-900 bg-zinc-950">
                Processando Transação...
              </div>
            )}

            {paymentStatus === 'approved' && (
              <motion.div key="approved" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-zinc-950 border border-zinc-800 p-8 text-center space-y-4">
                <div className="w-12 h-12 border border-white mx-auto rounded-full flex items-center justify-center bg-white text-black font-bold">✓</div>
                <h3 className="font-serif text-xl uppercase tracking-widest">Transação Aprovada</h3>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest">A alocação do seu lote foi confirmada. Acompanhe a esteira de produção (Arella) via e-mail.</p>
              </motion.div>
            )}

            {paymentStatus === 'pix_pending' && (
              <motion.div key="pix" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-zinc-950 border border-zinc-800 p-8 space-y-6 text-center">
                <h3 className="font-serif text-xl uppercase tracking-widest text-brand-red">Protocolo Pix Gerado</h3>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest">O código é válido por 30 minutos. A alocação da peça será garantida após a compensação.</p>
                
                {qrCodeImg && (
                  <div className="bg-white p-4 inline-block mx-auto border-4 border-zinc-800">
                    <img src={qrCodeImg} alt="QR Code PIX" className="w-48 h-48" />
                  </div>
                )}
                
                <div className="space-y-2">
                  <span className="block text-[9px] text-zinc-500 uppercase tracking-widest">Pix Copia e Cola</span>
                  <input type="text" value={pixCode} readOnly className="w-full bg-brand-black border border-zinc-800 p-3 text-[10px] text-zinc-300 font-mono text-center focus:outline-none" />
                </div>
              </motion.div>
            )}

            {(paymentStatus === 'rejected' || paymentStatus === 'error') && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-brand-red/10 border border-brand-red p-8 text-center space-y-4">
                <h3 className="font-serif text-xl text-brand-red uppercase tracking-widest">Falha na Liquidação</h3>
                <p className="text-[10px] text-zinc-300 uppercase tracking-widest">Seu banco recusou a transação ou houve instabilidade na rede adquirente.</p>
                <button onClick={() => setPaymentStatus(null)} className="mt-4 border border-zinc-800 px-4 py-2 text-[9px] uppercase tracking-widest hover:bg-zinc-900 transition-colors">Tentar Novamente</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}