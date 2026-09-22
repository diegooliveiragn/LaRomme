'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { EASINGS, DURATIONS } from '@/config/motion';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Qual é o prazo e o custo do envio?',
      a: 'Os envios são calculados na etapa de checkout de acordo com o seu CEP. Oferecemos modalidades expressas e padrão para todo o território nacional.',
    },
    {
      q: 'Como funciona a política de troca e devolução?',
      a: 'Você possui até 7 dias corridos após o recebimento do produto para solicitar a troca ou devolução sem custos. A peça deve estar com as etiquetas originais e sem sinais de uso.',
    },
    {
      q: 'Qual a diferença entre a modelagem Boxy e a Performance Fit?',
      a: 'A modelagem Boxy (presente na VESTIGIUM) possui caimento amplo, ombros caídos e tecido de algodão encorpado. A modelagem Performance Fit (presente na FORZA e LIBERTAS) tem foco em mobilidade anatômica e secagem ultrarrápida.',
    },
    {
      q: 'Quais são as instruções de lavagem para preservar a peça?',
      a: 'Recomendamos lavar com água fria, do lado do avesso, sem o uso de alvejantes. Seque à sombra para preservar a pigmentação do tecido e as estampas.',
    },
  ];

  return (
    <div className="bg-brand-black text-brand-offwhite min-h-screen pt-36 pb-32">
      <div className="max-w-4xl mx-auto px-6 space-y-16">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
          className="text-center space-y-4"
        >
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block">
            LR / SUPORTE
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold uppercase tracking-wider">
            Perguntas Frequentes
          </h1>
          <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest max-w-md mx-auto">
            Esclarecimentos diretos sobre pedidos, entregas e especificações técnicas.
          </p>
        </motion.div>

        <div className="space-y-4 border-t border-zinc-900 pt-8">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-zinc-900 pb-4">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center text-left py-3 group"
              >
                <span className="font-serif text-lg font-bold uppercase tracking-wide text-zinc-200 group-hover:text-brand-red transition-colors">
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-zinc-500 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-brand-red' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="font-sans text-xs text-zinc-400 uppercase tracking-wider leading-relaxed pt-2 pb-2"
                >
                  {faq.a}
                </motion.p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}