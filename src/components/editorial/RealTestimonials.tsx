'use client';

import { motion } from 'framer-motion';
import { EASINGS, DURATIONS, fadeInUpVariants } from '@/config/motion';

export function RealTestimonials() {
  // Dados de prova social conforme Regra 30 (Depoimentos de Testers e Atletas Reais)
  const testimonials = [
    {
      quote: "O peso dessa gola não existe no mercado nacional.",
      author: "C. M.",
      context: "Teste de Modelagem: VESTIGIUM"
    },
    {
      quote: "Testei a Libertas correndo na Beira Mar ao meio-dia. A camisa sumiu no corpo.",
      author: "T. R.",
      context: "Teste de Performance: LIBERTAS"
    }
  ];

  return (
    <section className="py-24 px-6 border-b border-zinc-900 bg-zinc-900/10">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }} 
          variants={fadeInUpVariants}
          className="text-center mb-16"
        >
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block mb-4">
            Validação de Campo
          </span>
          <h2 className="font-serif text-3xl uppercase tracking-wider text-white">
            Performance Real
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.2, duration: DURATIONS.slow, ease: EASINGS.cinematic }}
              variants={fadeInUpVariants}
              className="border-l border-brand-red pl-6 space-y-4"
            >
              <p className="font-serif text-xl md:text-2xl text-zinc-300 leading-relaxed italic">
                "{t.quote}"
              </p>
              <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                <span className="text-white font-bold">{t.author}</span> // {t.context}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}