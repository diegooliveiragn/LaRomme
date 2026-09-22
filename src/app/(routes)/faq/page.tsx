'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { EASINGS, DURATIONS } from '@/config/motion';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "O que é o Lote Zero?",
      answer: "O Lote Zero é uma fração limitadíssima do nosso primeiro Drop (ORIGO). Antes de abrirmos a loja para o público geral, alocamos essas peças de forma restrita para os membros fundadores da nossa lista de Acesso VIP. É a forma mais exclusiva de entrar no ecossistema LaRomme."
    },
    {
      question: "Como consigo comprar uma peça agora?",
      answer: "No momento, o carrinho de compras público está fechado. Para garantir uma peça, você deve navegar até o artefato desejado, selecionar a sua estrutura (tamanho) e clicar em 'Solicitar Acesso VIP'. Os selecionados serão notificados por e-mail."
    },
    {
      question: "Qual a diferença entre a modelagem Boxy e a Performance?",
      answer: "A modelagem Boxy (presente na VESTIGIUM) é estruturada, feita em algodão pesado de 300g, com ombros deslocados e caimento amplo — ideal para presença urbana. A linha Performance (FORZA e LIBERTAS) possui caimento anatômico relaxado, fiação ultraleve e foco absoluto em mobilidade e transpiração para o esporte."
    },
    {
      question: "Como saberei qual é o meu tamanho exato?",
      answer: "Nós rejeitamos a ambiguidade. Em cada página de artefato, você encontrará um 'Guia de Medidas' milimétrico. Além disso, no rodapé do site, a seção 'Estrutura & Medidas' fornece a matriz cartesiana completa com tórax e comprimento de todas as peças."
    },
    {
      question: "O que significa 'Origo'?",
      answer: "Origo é a palavra latina para 'Origem'. É o título do nosso primeiro Drop, simbolizando a fundação da LaRomme: a interseção entre a disciplina arquitetônica de Roma e a energia litorânea de Fortaleza."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-brand-black text-brand-offwhite min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6 space-y-16">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
          className="text-center space-y-4"
        >
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block">
            Base de Conhecimento
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-wider text-white">
            Diretrizes & FAQ
          </h1>
          <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest max-w-lg mx-auto leading-relaxed">
            Respostas cartesianas para o funcionamento do ecossistema e a alocação do Lote Zero.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATIONS.medium, delay: 0.2 }}
          className="border-t border-zinc-900"
        >
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-zinc-900">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
              >
                <span className={`font-serif text-lg md:text-xl uppercase tracking-wider transition-colors duration-300 ${openIndex === index ? 'text-brand-red' : 'text-zinc-300 group-hover:text-white'}`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  size={20} 
                  className={`text-zinc-600 transition-transform duration-500 ${openIndex === index ? 'rotate-180 text-brand-red' : ''}`} 
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-8 font-sans text-xs text-zinc-500 uppercase tracking-widest leading-relaxed pr-8">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        <div className="pt-12 text-center flex flex-col items-center">
            <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mb-4">
              Necessita de suporte adicional?
            </span>
            <a href="mailto:romannuscompany@gmail.com" className="font-mono text-[10px] text-zinc-400 hover:text-white uppercase tracking-widest border-b border-zinc-800 hover:border-white pb-1 transition-all">
              romannuscompany@gmail.com
            </a>
        </div>

      </div>
    </div>
  );
}