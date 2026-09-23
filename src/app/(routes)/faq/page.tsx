'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    id: '01',
    category: 'LOTE ZERO // ACESSO',
    question: 'Como funciona a prioridade de alocação do Lote Zero?',
    answer: 'O Lote Zero é a tiragem inaugural de peças da LaRomme. Os cadastrados na lista VIP recebem uma chave de acesso exclusiva por e-mail com 24 horas de antecedência ao lançamento público, garantindo a reserva dos itens antes do esgotamento do estoque.'
  },
  {
    id: '02',
    category: 'LOGÍSTICA & ENVIO',
    question: 'Qual é o prazo de processamento e entrega das peças?',
    answer: 'Pedidos do Lote Zero são processados em até 48 horas úteis após a confirmação do pagamento. O prazo final de transporte via Correios (Sedex) ou Transportadora expressa varia de 2 a 7 dias úteis de acordo com as coordenadas do CEP informado.'
  },
  {
    id: '03',
    category: 'CUIDADOS DE MANUTENÇÃO',
    question: 'Como lavar tecidos de algodão heavyweight (400g/m²)?',
    answer: 'Recomendamos lavar a peça pelo avesso, com água fria e sabão neutro. Não utilize alvejantes e evite secadoras de tambor quente para preservar a estrutura das fibras densas do algodão e a tonalidade profunda dos pigmentos.'
  },
  {
    id: '04',
    category: 'DIRETRIZES DE TROCA',
    question: 'Qual é a política para trocas de tamanho ou devolução?',
    answer: 'Você possui até 7 dias corridos após o recebimento da encomenda para solicitar a devolução gratuita ou troca por tamanho (sujeito à disponibilidade em estoque de coleções limitadas). A peça deve estar com todas as etiquetas intactas e sem sinais de uso.'
  },
  {
    id: '05',
    category: 'PAGAMENTO & SEGURANÇA',
    question: 'Quais métodos de pagamento são aceitos no checkout?',
    answer: 'Aceitamos PIX com aprovação instantânea e Cartão de Crédito em até 3x sem juros. Toda a transação é processada sob ambiente criptografado SSL com proteção antifraude.'
  }
];

export default function FaqPage() {
  const [openId, setOpenId] = useState<string | null>('01');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="bg-brand-black min-h-screen text-brand-offwhite pt-32 pb-32 px-6">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="border-b border-zinc-900 pb-12"
        >
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block mb-4">
            Suporte e Protocolos // FAQ
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl uppercase tracking-wider text-white">
            Diretrizes
          </h1>
          <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest max-w-xl mt-4 leading-relaxed">
            Respostas estruturadas sobre o ecossistema de alocação, envios, qualidade têxtil e políticas operacionais da LaRomme.
          </p>
        </motion.div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div 
                key={faq.id} 
                className="bg-zinc-950 border border-zinc-900 overflow-hidden transition-colors duration-300"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-6 sm:p-8 text-left flex justify-between items-center gap-6 focus:outline-none"
                >
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] text-brand-red uppercase tracking-widest block">
                      {faq.category}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl uppercase tracking-wider text-white">
                      {faq.question}
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-zinc-500 flex-shrink-0">
                    {isOpen ? '[ - ]' : '[ + ]'}
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-zinc-900 px-6 pb-6 pt-4 sm:px-8 sm:pb-8"
                    >
                      <p className="font-mono text-xs text-zinc-400 leading-relaxed uppercase tracking-widest max-w-2xl">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}